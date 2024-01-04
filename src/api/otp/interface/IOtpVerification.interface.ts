import { IOtp } from './IOtp.interface';

/**
 * this func will be get otp for verification.
 */
export interface IOtpVerification extends IOtp {
  otp: number;
}
