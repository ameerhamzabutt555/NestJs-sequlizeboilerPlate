import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EMAIL_SEND_TYPE, NOT_FOUND_RESPONSE, ROLE_TYPE } from 'src/constants';
import { EMAIL_ALREADY_EXIST_RESPONSE } from 'src/constants/response.types';
import { EmailDto } from 'src/generic-dto/email.dto';
import { UtilitiesService } from 'src/helpers/utils';
import { EmailVerificationService } from '../email/email-verification.service';
import sendEmail from 'src/helpers/send-email';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ChangePasswordFromLinkDto } from './dto/change-password-from-link.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserDto } from './dto/user.dto';
import { BaseService } from 'src/core/base/base.service';
import { User } from 'src/entities';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { OtpService } from '../otp/otp.service';
import { IOtpVerification } from '../otp/interface/IOtpVerification.interface';

@Injectable()
export class UsersService extends BaseService {
  constructor(
    private readonly helper: UtilitiesService,
    private readonly emailVerificationService: EmailVerificationService,
    private readonly _jwtService: JwtService,
    private readonly otp: OtpService
  ) {
    super(User);
  }

  /**
   * Create a new user account.
   *
   * @param payload - User registration data.
   * @returns The created user or an error message.
   */
  async createUser(payload: UserDto): Promise<any> {
    const { userName, email, password } = payload;

    const user_email = await this.findOne({ email });
    const user_name = await this.findOne({ userName });

    if (user_email)
      throw new HttpException(EMAIL_ALREADY_EXIST_RESPONSE.message, HttpStatus.CONFLICT);

    if (user_name) throw new HttpException('Username already exist', HttpStatus.CONFLICT);

    try {
      const encodedPassword: string = this.helper.encodePassword(password);
      const newUser: any = await this.create({
        ...payload,
        password: encodedPassword
      });

      await this.sendVerificationEmail(email, EMAIL_SEND_TYPE.EMAIL_VERIFICATION);
      delete newUser.password;
      return newUser;
    } catch (error: any) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /**
   * Create a new user account through OAuth login.
   *
   * @param email - User's email.
   * @param loginType - Type of OAuth login (e.g., 'google', 'facebook').
   * @returns The created user or an error message.
   */
  async createUserThroughOAuth(email: string, loginType: string) {
    const newUser = await this.create({
      email,
      userName: email, // to be removed
      password: '',
      loginType,
      role: ROLE_TYPE.SUPER_ADMIN,
      isEmailVerified: true
    });
    return newUser;
  }

  /**
   * Verify the user's email address and mark it as verified.
   *
   * @param req - Verification request data (email and access token).
   * @returns Verification status and a token.
   */
  async verifyEmail(req: VerifyEmailDto) {
    const { accessToken, email } = req;
    await this.verifyToken(accessToken, email);

    const updatedUser: any = await this.updateByCondition({ email }, { isEmailVerified: true });
    if (updatedUser.nModified === 0) {
      throw new HttpException('Email verification failed', HttpStatus.CONFLICT);
    }
    await this.emailVerificationService.updateTokenUsedStatus(email, true);
    const data = await this.findOne({ email });
    delete data.dataValues.password;

    const token: string = await this._jwtService.signAsync(
      { id: data.id, email: email },
      { secret: process.env.JWT_SECRET_KEY }
    );

    return {
      data: { ...data.dataValues, token },
      message: 'Email verified successfully'
    };
  }

  /**
   * Change a user's password using a password reset link.
   *
   * @param changePasswordFromLinkDto - Data for changing the password.
   * @returns Password change status.
   */
  async changePasswordFromLink(changePasswordFromLinkDto: ChangePasswordFromLinkDto) {
    const { email, password, accessToken } = changePasswordFromLinkDto;
    await this.verifyResetPasswordLink({ email, accessToken });
    return await this.changePasswordThroughEmail(email, password);
  }

  /**
   * Change a user's password.
   *
   * @param changePasswordDto - Data for changing the password.
   * @param user - User data.
   * @returns Password change status.
   */
  async changePassword(changePasswordDto: ChangePasswordDto, user: any) {
    const { oldPassword, newPassword, confirmPassword } = changePasswordDto;
    if (newPassword !== confirmPassword)
      throw new HttpException(
        'New password and confirm password does not match',
        HttpStatus.CONFLICT
      );

    const isPasswordValid = this.helper.isPasswordValid(oldPassword, user.password);

    if (!isPasswordValid) throw new HttpException('Invalid old password', HttpStatus.CONFLICT);

    return await this.changePasswordThroughEmail(user.email, newPassword);
  }

  /**
   * Request a password reset email.
   *
   * @param forgotPassword - User's email for password reset.
   * @returns Email status.
   */
  async forgotPassword(forgotPassword: EmailDto): Promise<any> {
    const { email } = forgotPassword;
    return await this.sendVerificationEmail(email, EMAIL_SEND_TYPE.RESET_PASSWORD);
  }

  /**
   * Generate an OTP (One-Time Password) for user verification.
   *
   * @param generateOtpDto - Data for generating OTP.
   * @returns OTP generation status.
   */
  async generateOtp(generateOtpDto: GenerateOtpDto): Promise<any> {
    return await this.otp.generateOtp(generateOtpDto);
  }

  /**
   * Verify a user's provided OTP (One-Time Password).
   *
   * @param verifyOtpDto - Data for OTP verification.
   * @param user - User data.
   * @returns OTP verification status.
   */
  async verifyOtp(verifyOtpDto: IOtpVerification, user: any) {
    const { id, isPhoneVerified } = user;
    const otpVerified = await this.otp.verifyOtp(verifyOtpDto);
    const isOtpExpired = await this.otp.isOtpExpired(verifyOtpDto);

    if (user.phone !== verifyOtpDto.phone)
      throw new HttpException('Invalid phone number', HttpStatus.CONFLICT);

    if (!otpVerified) throw new HttpException('Invalid OTP', HttpStatus.CONFLICT);

    if (isOtpExpired) throw new HttpException('OTP is Expired', HttpStatus.CONFLICT);

    return await this.update(
      id,
      { ...(isPhoneVerified === false && { isPhoneVerified: true }), isLoginVerified: true },
      id
    );
  }

  /**
   * Add a phone number to the user's profile and generate an OTP for verification.
   *
   * @param generateOtpDto - Data for generating OTP.
   * @param id - User ID.
   * @returns Phone addition status and OTP generation status.
   */
  async addPhone(generateOtpDto: GenerateOtpDto, id: number) {
    const [isUpdated] = await this.update(
      id,
      { phone: generateOtpDto.phone, isPhoneVerified: false, isLoginVerified: false },
      id
    );

    if (!isUpdated) throw new HttpException('Error while adding to database', HttpStatus.CONFLICT);
    return await this.generateOtp(generateOtpDto);
  }

  /**
   * Log the user out.
   *
   * @param id - User ID.
   * @returns Logout status.
   */
  async logout(id: number) {
    return await this.update(id, { isLoginVerified: false }, id);
  }

  /**
   * Verify the password reset link and mark the token as used.
   *
   * @param req - Verification request data (access token and email).
   */
  async verifyResetPasswordLink(req: VerifyEmailDto) {
    const { accessToken, email } = req;
    await this.verifyToken(accessToken, email);

    await this.emailVerificationService.updateTokenUsedStatus(email, true);
  }

  /**
   * Send a verification email to the user for email confirmation or password reset.
   *
   * @param email - User's email address.
   * @param type - Type of email (e.g., 'email verification', 'reset password').
   * @returns Email status or a message indicating that the email is already verified.
   */
  async sendVerificationEmail(email: string, type: string) {
    const user = await this.getUserByEmailOrUsername({ email });
    if (user && user.isEmailVerified && type !== EMAIL_SEND_TYPE.RESET_PASSWORD)
      return { message: 'This email is already verified' };
    if (user) {
      const token: string = await this._jwtService.signAsync(
        { id: user.id, email: user.email },
        { secret: process.env.JWT_SECRET_KEY }
      );
      // send email here
      const response = await sendEmail(email, token, type, user.userName);
      await this.emailVerificationService.updateVerifyEmailToken(email, token);
      return;
    }
    throw new HttpException(NOT_FOUND_RESPONSE.message, HttpStatus.NOT_FOUND);
  }

  /**
   * Change a user's password using their email.
   *
   * @param email - User's email address.
   * @param password - New password.
   * @returns Password change status.
   */
  async changePasswordThroughEmail(email: string, password: string) {
    const encyptedPass = this.helper.encodePassword(password);

    const updatedUser: any = await this.updateByCondition({ email }, { password: encyptedPass });
    if (updatedUser.nModified === 0) {
      throw new HttpException('Password change failed', HttpStatus.CONFLICT);
    }
    return {
      data: { email },
      message: 'Password updated successfully'
    };
  }

  /**
   * Verify the access token used for email verification.
   *
   * @param accessToken - Access token.
   * @param email - User's email address.
   */
  async verifyToken(accessToken: string, email: string) {
    const token = await this.emailVerificationService.getVerifyEmailTokenByEmail(email);
    const isTokenExpired = await this.emailVerificationService.isTokenExpired(email);
    const isTokenUsed = await this.emailVerificationService.isTokenUsed(email);

    if (isTokenUsed)
      throw new HttpException('Token already been used, access denied', HttpStatus.CONFLICT);

    if (isTokenExpired)
      throw new HttpException('Token expired, access denied', HttpStatus.CONFLICT);

    if (token !== accessToken) throw new HttpException('Invalid token', HttpStatus.CONFLICT);
  }

  /**
   * Find a user by specified arguments.
   *
   * @param args - Arguments for finding a user.
   * @returns User data or an error if the user is not found.
   */
  async findUserByArgs(args: object) {
    const user = await this.findOne({
      ...args
    });
    if (!user) throw new HttpException(NOT_FOUND_RESPONSE.message, HttpStatus.NOT_FOUND);
    return user;
  }

  /**
   * Get a user by email or username.
   *
   * @param body - Email data (email or username).
   * @returns User data or an error if the user is not found.
   */
  async getUserByEmailOrUsername(body: EmailDto) {
    const { email } = body;
    let user = await this.findOne({ email });
    if (!user) user = await this.findOne({ userName: email });
    if (!user) throw new HttpException('No user found', HttpStatus.NOT_FOUND);
    return user;
  }

  /**
   * Get a user by email.
   *
   * @param body - Email data.
   * @returns User data or null if the user is not found.
   */
  async getUserByEmail(body: EmailDto) {
    const { email } = body;

    const user = await this.findOne({ email });
    return user;
  }
}
