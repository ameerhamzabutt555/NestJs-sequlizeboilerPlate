import { Body, Controller, Post, Req, UseGuards, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EMAIL_SEND_TYPE, ROLE_TYPE } from 'src/constants';
import { Roles } from 'src/decorators/roles.decorator';
import { EmailDto } from 'src/generic-dto/email.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { PermissionAccessGuard } from 'src/guards/permission-access-guard.guard';
import { ChangePasswordFromLinkDto } from './dto/change-password-from-link.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { GenerateOtpDto } from './dto/generate-otp.dto';
import { UserDto } from './dto/user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { UsersService } from './users.service';
import { LoginVerifiedGuard } from 'src/guards/login-verified.guard';
import { EmailVerifiedGuard } from 'src/guards/email-verified.guard';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private usersService: UsersService) {}

  /**
   * Add a phone number to the user profile and generate an OTP for verification.
   * @param generateOtpDto - DTO containing the phone number.
   * @param req - Request object containing user information.
   * @returns The result of adding the phone and generating an OTP.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionAccessGuard, EmailVerifiedGuard)
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Post('add-phone-and-generate-otp')
  async addPhone(@Body() generateOtpDto: GenerateOtpDto, @Req() req: any) {
    return await this.usersService.addPhone(generateOtpDto, req.user.id);
  }

  /**
   * Generate an OTP for the user's phone number.
   * @param req - Request object containing user information.
   * @returns The generated OTP.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionAccessGuard, EmailVerifiedGuard)
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Get('generate-otp')
  async generateOtp(@Req() req: any) {
    return await this.usersService.generateOtp({ phone: req.user.phone });
  }

  /**
   * Verify an OTP sent to the user's phone number.
   * @param verifyOtpDto - DTO containing the OTP.
   * @param req - Request object containing user information.
   * @returns The result of OTP verification.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionAccessGuard, EmailVerifiedGuard)
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto, @Req() req: any) {
    return await this.usersService.verifyOtp({ ...verifyOtpDto, phone: req.user.phone }, req.user);
  }

  /**
   * Logout the user.
   * @param req - Request object containing user information.
   * @returns The result of the user logout.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionAccessGuard, LoginVerifiedGuard)
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Get('logout')
  async logout(@Req() req: any) {
    return await this.usersService.logout(req.user.id);
  }

  /**
   * Get the user's profile information.
   * @param req - Request object containing user information.
   * @returns The user's profile.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, PermissionAccessGuard, LoginVerifiedGuard)
  @Roles(ROLE_TYPE.USER, ROLE_TYPE.ADMIN, ROLE_TYPE.SUPER_ADMIN)
  @Get('')
  async user(@Req() req: any) {
    const user = await this.usersService.findOneById(req.user.id);
    delete user.dataValues.password;
    return user;
  }
  /**
   * Request to generate a forget password link for the user.
   * @param forgotPasswordDto - DTO containing the user's email.
   * @returns The result of generating the forget password link.
   */
  @Post('/generate-forget-password-link')
  async forgetPasswordUser(@Body() forgotPasswordDto: EmailDto) {
    return await this.usersService.forgotPassword(forgotPasswordDto);
  }

  /**
   * Request to regenerate an email verification link.
   * @param emailDto - DTO containing the user's email.
   * @returns The result of regenerating the email verification link.
   */
  @Post('/regenerate-email-link')
  async regenerateEmailLink(@Body() emailDto: EmailDto) {
    return await this.usersService.sendVerificationEmail(
      emailDto.email,
      EMAIL_SEND_TYPE.EMAIL_VERIFICATION
    );
  }

  /**
   * Request to change the user's password using a link.
   * @param changePasswordDto - DTO containing the new password and token.
   * @returns The result of changing the password using a link.
   */
  @Post('/change-password-from-link')
  async changePasswordFromLink(@Body() changePasswordDto: ChangePasswordFromLinkDto) {
    return await this.usersService.changePasswordFromLink(changePasswordDto);
  }

  /**
   * Request to change the user's password.
   * @param changePasswordDto - DTO containing the new password.
   * @param req - Request object containing user information.
   * @returns The result of changing the user's password.
   */
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('/change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: any) {
    return await this.usersService.changePassword(changePasswordDto, req.user);
  }

  /**
   * Request to register a new user.
   * @param userDto - DTO containing user registration information.
   * @returns The newly registered user.
   */
  @Post('/register')
  async createUser(@Body() userDto: UserDto) {
    const user = await this.usersService.createUser(userDto);
    return user;
  }
}
