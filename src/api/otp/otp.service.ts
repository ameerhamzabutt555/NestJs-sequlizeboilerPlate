import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { IOtp } from './interface/IOtp.interface';
import { IOtpVerification } from './interface/IOtpVerification.interface';
import { UtilitiesService } from 'src/helpers/utils';
import { BaseService } from 'src/core/base/base.service';
import { Otp } from 'src/entities';

@Injectable()
export class OtpService extends BaseService {
  constructor(private readonly utilities: UtilitiesService) {
    super(Otp);
  }

  /**
   * Generate and send an OTP to a phone number.
   * @param generataOtpDto - Input DTO containing the phone number.
   * @returns A success message indicating that the OTP was sent.
   */
  async generateOtp(generataOtpDto: IOtp): Promise<any> {
    const { phone } = generataOtpDto;
    const otp: number = this.utilities.generateOtp();
    // add otp send here
    // await this.utilities.sendOtp(phone, otp);
    await this.createOrUpdate({
      phone,
      otpExpiration: this.utilities.generateFutureDate(120000),
      otp
    });

    return { message: `Otp Sent Successfully ${otp}` };
  }

  /**
   * Verify if the provided OTP matches the stored OTP for a phone number.
   * @param verifyOtpDto - Input DTO containing the phone number and OTP.
   * @returns True if the OTP is valid; otherwise, false.
   */
  async verifyOtp(verifyOtpDto: IOtpVerification): Promise<boolean> {
    const { phone, otp } = verifyOtpDto;
    const otpField = await this.findOne({ phone });
    return otpField.otp === otp;
  }

  /**
   * Check if the OTP for a phone number has expired.
   * @param verifyOtpDto - Input DTO containing the phone number.
   * @returns True if the OTP is expired; otherwise, false.
   */
  async isOtpExpired(verifyOtpDto: IOtpVerification): Promise<boolean> {
    const { phone } = verifyOtpDto;
    const otpField = await this.findOne({ phone });
    return new Date(otpField.otpExpiration).getTime() < new Date().getTime();
  }
}
