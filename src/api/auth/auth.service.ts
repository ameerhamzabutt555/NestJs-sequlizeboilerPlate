import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UtilitiesService } from 'src/helpers/utils';
import { LoginDto } from '../users/dto/login.dto';
import { UsersService } from '../users/users.service';
import { LoginWithOAuthDto } from './dto/login-with-oauth.dto';
import { LoginWithLinkedInDto } from './dto/login-with-linkedin.dto';
import { catchError, firstValueFrom } from 'rxjs';
import { EmailVerificationService } from '../email/email-verification.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private readonly _jwtService: JwtService,
    private httpService: HttpService,
    private helper: UtilitiesService,
    private readonly emailVerificationService: EmailVerificationService
  ) {}

  /**
   * Authenticate a user using email and password.
   * @param userCredentials - LoginDto containing email and password.
   * @returns User information without password along with a JWT token.
   */
  async login(userCredentials: LoginDto) {
    const user: any = await this.userService.getUserByEmailOrUsername(userCredentials);

    if (!user) throw new HttpException('user not found', HttpStatus.NOT_FOUND);

    const isPasswordValid = this.helper.isPasswordValid(userCredentials.password, user.password);

    if (!isPasswordValid) throw new HttpException('invalid email/password', HttpStatus.CONFLICT);

    const token: string = await this._jwtService.signAsync(
      { id: user.id, email: user.email },
      { secret: process.env.JWT_SECRET_KEY }
    );

    const responseWithToken = { ...user.dataValues, token };
    const userWithoutPassword = this.helper.excludeOnlyPwd(responseWithToken);
    return userWithoutPassword;
  }

  /**
   * Check if a user exists by email and create one if not, using OAuth authentication.
   * @param email - User's email from the OAuth provider.
   * @param loginType - Type of OAuth login (e.g., 'microsoft').
   * @returns User information without password along with a JWT token.
   */
  async checkUserAndCreate(email: string, loginType: string) {
    if (loginType === 'microsoft') {
      email = email.split('#')[0];
      email = email.replace(/_([^_]*)$/, '@' + '$1');
    }

    let user: any = await this.userService.getUserByEmail({ email });
    if (!user) user = await this.userService.createUserThroughOAuth(email, loginType);
    if (user.loginType !== loginType)
      throw new HttpException(
        'This email is already associated with other account',
        HttpStatus.CONFLICT
      );

    const token: string = await this._jwtService.signAsync(
      { id: user.id, email: user.email },
      { secret: process.env.JWT_SECRET_KEY }
    );

    const responseWithToken = { ...user.dataValues, token };
    const userWithoutPassword = this.helper.excludeOnlyPwd(responseWithToken);
    return userWithoutPassword;
  }

  /**
   * Authenticate a user using OAuth (e.g., Google).
   * @param userCredentials - LoginWithOAuthDto containing accessToken, email, and loginType.
   * @returns User information without password along with a JWT token.
   */
  async loginAndSignUpWithOAuth(userCredentials: LoginWithOAuthDto) {
    const { accessToken, email, loginType } = userCredentials;

    if (email !== email) throw new HttpException('invalid email', HttpStatus.CONFLICT);

    return await this.checkUserAndCreate(email, loginType);
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

    const updatedUser: any = await this.userService.updateByCondition(
      { email },
      { isEmailVerified: true }
    );
    if (updatedUser.nModified === 0) {
      throw new HttpException('Email verification failed', HttpStatus.CONFLICT);
    }
    await this.emailVerificationService.updateTokenUsedStatus(email, true);
    const data = await this.userService.findOne({ email });
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
   * Authenticate a user using LinkedIn OAuth.
   * @param urlSearchParams - LoginWithLinkedInDto containing OAuth data.
   * @returns User information without password along with a JWT token.
   */
  async loginAndSignUpWithLinkedIn(urlSearchParams: LoginWithLinkedInDto) {
    const data = new URLSearchParams();
    data.append('grant_type', urlSearchParams.grantType);
    data.append('code', urlSearchParams.code);
    data.append('redirect_uri', urlSearchParams.redirectURI);
    data.append('client_id', urlSearchParams.clientId);
    data.append('client_secret', urlSearchParams.clientSecret);
    const { data: linkedinResponse } = await firstValueFrom(
      this.httpService.post('https://www.linkedin.com/oauth/v2/accessToken', data, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
    );
    // don't remove this, it will return the first and last name
    // const userData = await this.getLinkedInUserData(linkedinResponse);
    const emailAddress = await this.getLinkedInUserEmail(linkedinResponse.access_token);
    return await this.checkUserAndCreate(emailAddress, 'linkedin');
  }

  /**
   * Retrieve the user's email from LinkedIn using the provided access token.
   * @param accessToken - Access token obtained from LinkedIn.
   * @returns User's email address from LinkedIn.
   * @throws HttpException if an error occurs during the request.
   */
  async getLinkedInUserEmail(accessToken: string) {
    const headersRequest = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    };

    const { data: userData } = await firstValueFrom(
      this.httpService
        .get(`https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))`, {
          headers: headersRequest
        })
        .pipe(
          catchError((error: any) => {
            console.log(error, 'error ');
            throw new HttpException(error, HttpStatus.CONFLICT);
          })
        )
    );

    return userData.elements[0]['handle~'].emailAddress;
  }

  /**
   * Retrieve user data from LinkedIn using the provided access token.
   * @param linkedinResponse - LinkedIn OAuth response containing access token.
   * @returns User data from LinkedIn.
   * @throws HttpException if an error occurs during the request.
   */
  async getLinkedInUserData(linkedinResponse: any) {
    const { data: userData } = await firstValueFrom(
      this.httpService
        .get(`https://api.linkedin.com/v2/me?oauth2_access_token=${linkedinResponse.access_token}`)
        .pipe(
          catchError((error: any) => {
            console.log(error, 'error ');
            throw new HttpException(error, HttpStatus.CONFLICT);
          })
        )
    );
    return userData;
  }
}
