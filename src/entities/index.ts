import { EmailVerification } from './email-verification.entity';
import { Otp } from './otp.entiry';
import { Profile } from './profile.entity';
import { User } from './user.entity';

const entities = [User, EmailVerification, Otp, Profile];

export { User, EmailVerification, Otp, Profile };
export default entities;
