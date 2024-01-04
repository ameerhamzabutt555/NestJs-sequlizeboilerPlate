import { BelongsTo, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Table({
  tableName: 'tbl_email_verification'
})
export class EmailVerification extends BaseEntity<EmailVerification> {
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false,
    field: 'access_token'
  })
  accessToken: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.STRING,
    unique: true,
    allowNull: false
  })
  email: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    field: 'token_expiration'
  })
  tokenExpiration: Date;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
    allowNull: false,
    field: 'is_token_used'
  })
  isTokenUsed: Boolean;

  @BelongsTo(() => User, { foreignKey: 'email' })
  user: User;
}
