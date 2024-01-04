/**
 * Enum containing various response messages for different modules.
 */
export enum RESPONSE_MESSAGES {
  // =================> Email Module <================= //
  EMAIL_SENT = 'Email sent successfully',

  // =================> Registration Module <================= //
  VERIFY_EMAIL = 'Please verify your email first!',
  PASSWORD_UPDATED = 'Password updated successfully',
  OTP_EXPIRED = 'OTP expired',
  OTP_VERIFIED = 'OTP verified successfully',
  OTP_SENT = 'OTP sent successfully'
}
