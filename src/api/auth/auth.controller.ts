import { LoginDto } from '../users/dto/login.dto';
import { Controller, Body, Post, HttpCode } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginWithOAuthDto } from './dto/login-with-oauth.dto';
import { LoginWithLinkedInDto } from './dto/login-with-linkedin.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@ApiTags('login') // This decorator is used to categorize and group APIs in Swagger documentation.
@Controller('auth') // This controller handles routes under the '/auth' path.
export class AuthController {
  constructor(private authService: AuthService) {}

  // Endpoint for user login
  @Post('login') // HTTP POST request to '/auth/login'
  @HttpCode(200) // HTTP status code for the response
  login(@Body() dto: LoginDto) {
    // Call the AuthService to handle the login logic and return the result.
    return this.authService.login(dto);
  }

  // Endpoint for login and sign-up with OAuth (e.g., Google)
  @Post('login-and-sign-up-with-oauth') // HTTP POST request to '/auth/login-and-sign-up-with-oauth'
  @HttpCode(200) // HTTP status code for the response
  loginWithGoogle(@Body() dto: LoginWithOAuthDto) {
    // Call the AuthService to handle login and sign-up with OAuth logic.
    return this.authService.loginAndSignUpWithOAuth(dto);
  }

  // Endpoint for login and sign-up with LinkedIn
  @Post('login-and-sign-up-with-linkedin') // HTTP POST request to '/auth/login-and-sign-up-with-linkedin'
  @HttpCode(200) // HTTP status code for the response
  loginWithLinkedIn(@Body() dto: LoginWithLinkedInDto) {
    // Call the AuthService to handle login and sign-up with LinkedIn logic.
    return this.authService.loginAndSignUpWithLinkedIn(dto);
  }
  /**
   * Request to verify the user's email.
   * @param verifyEmailDto - DTO containing the email verification token.
   * @returns The result of email verification.
   */
  @Post('/verify-email')
  async verifyEmail(@Body() verifyEmailDto: VerifyEmailDto) {
    return await this.authService.verifyEmail(verifyEmailDto);
  }
}
