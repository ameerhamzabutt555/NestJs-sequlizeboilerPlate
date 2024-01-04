import { Injectable } from '@nestjs/common';
import { Global } from '@nestjs/common/decorators';
import { EmailVerification } from 'src/entities/email-verification.entity';
import { BaseService } from 'src/core/base/base.service';

@Global()
@Injectable()
export class EmailVerificationService extends BaseService {
  constructor() {
    super(EmailVerification);
  }

  /**
   * Create verification data for email, including token and expiration.
   * @param email - User's email.
   * @param token - Verification token.
   * @returns Created verification data.
   */
  async createVerifyEmailData(email: string, token: string) {
    return await this.create({
      email,
      accessToken: token,
      tokenExpiration: new Date(new Date().getTime() + 600000),
      isTokenUsed: false
    });
  }

  /**
   * Update the verification token for an email address if it exists; otherwise, create it.
   * @param email - User's email.
   * @param token - New verification token.
   * @returns True if the update or creation is successful, false otherwise.
   */
  async updateVerifyEmailToken(email: string, token: string) {
    const isEmailExists = await this.isEmailExist(email);
    let response = {};
    if (isEmailExists) {
      response = await this.updateByCondition(
        { email },
        {
          accessToken: token,
          tokenExpiration: new Date(new Date().getTime() + 600000),
          isTokenUsed: false
        }
      );
    } else {
      response = await this.createVerifyEmailData(email, token);
    }
    if (response) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Update the status of token usage for a specific email.
   * @param email - User's email.
   * @param status - New token usage status.
   * @returns True if the update is successful, false otherwise.
   */
  async updateTokenUsedStatus(email: string, status: boolean) {
    const response: any = await this.updateByCondition({ email }, { isTokenUsed: status });
    if (response.nModified > 0) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Check if a verification token has been used for a specific email address.
   * @param email - User's email.
   * @returns True if the token is used; otherwise, false.
   */
  async isTokenUsed(email: string) {
    const response = await this.findOne({ email });
    return response?.isTokenUsed;
  }

  /**
   * Check if a verification token is expired for a specific email address.
   * @param email - User's email.
   * @returns True if the token is expired; otherwise, false.
   */
  async isTokenExpired(email: string) {
    const response = await this.findOne({ email });
    return new Date(response?.tokenExpiration).getTime() > new Date().getTime() ? false : true;
  }

  /**
   * Mark a verification token as used for a specific email.
   * @param email - User's email.
   * @returns True if the operation is successful, false otherwise.
   */
  async destroyVerificationToken(email: string) {
    return await this.updateByCondition({ email }, { isTokenUsed: true });
  }

  /**
   * Check if an email address exists in the verification data.
   * @param email - User's email.
   * @returns True if the email exists; otherwise, false.
   */
  async isEmailExist(email: string) {
    const response = await this.findAll({ email });
    return response.length > 0;
  }

  /**
   * Retrieve the verification token for a specific email address.
   * @param email - User's email.
   * @returns Verification token.
   */
  async getVerifyEmailTokenByEmail(email: string) {
    const res = await this.findOne({ email }, null, ['accessToken']);
    return res?.accessToken;
  }
}
