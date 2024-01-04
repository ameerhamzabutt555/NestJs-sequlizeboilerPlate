import { BelongsTo, Column, DataType, Table, ForeignKey } from 'sequelize-typescript';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Table({
  tableName: 'tbl_profile'
})
export class Profile extends BaseEntity<Profile> {
  @Column({
    type: DataType.STRING,
    unique: true,
    field: 'first_name',
    allowNull: true
  })
  firstName: string;

  @Column({
    type: DataType.STRING,
    unique: true,
    field: 'last_name',
    allowNull: true
  })
  lastName: string;

  @Column({
    type: DataType.STRING
  })
  country: string;

  @Column({
    type: DataType.STRING
  })
  city: string;

  @ForeignKey(() => User)
  @Column({ field: 'user_id' })
  userId: number;

  @BelongsTo(() => User)
  user: User;
}
