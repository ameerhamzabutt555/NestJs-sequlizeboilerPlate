import { Column, DataType, Table, HasOne } from 'sequelize-typescript';
import { ROLE_TYPE } from 'src/constants';
import { BaseEntity } from './base.entity';
import { Profile } from './profile.entity';
import { EmailVerification } from './email-verification.entity';
import { Otp } from './otp.entiry';

@Table({
  tableName: 'tbl_user'
})
export class User extends BaseEntity<User> {
  @Column({
    type: DataType.STRING,
    unique: true,
    field: 'user_name',
    allowNull: true
  })
  userName: string;

  @Column({
    type: 'enum',
    values: Object.values(ROLE_TYPE),
    defaultValue: ROLE_TYPE.ADMIN,
    allowNull: false
  })
  role: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  email: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: true
  })
  phone: string;

  @Column({
    type: DataType.STRING,
    field: 'login_type',
    defaultValue: null
  })
  loginType: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_email_verified'
  })
  isEmailVerified: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    field: 'is_phone_verified'
  })
  isPhoneVerified: boolean;

  @Column({
    type: DataType.STRING
  })
  password: string;

  @HasOne(() => Profile)
  profile: Profile;

  @HasOne(() => EmailVerification)
  emailVerification: EmailVerification;

  @HasOne(() => Otp)
  otp: Otp;
}
