import { Column, DataType, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Table({
  tableName: 'tbl_otp'
})
export class Otp extends BaseEntity<Otp> {
  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  phone: string;

  @Column({
    type: DataType.NUMBER,
    allowNull: false
  })
  otp: number;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'otp_expiration'
  })
  otpExpiration: Date;

  @BelongsTo(() => User, { foreignKey: 'phone' })
  user: User;
}
