import { Column, DataType, Model, Table } from 'sequelize-typescript';

export abstract class BaseEntity<T> extends Model<T> {
  @Column({
    type: DataType.INTEGER,
    field: 'created_by'
  })
  createdBy: number;

  @Column({
    type: DataType.INTEGER,
    field: 'updated_by'
  })
  updatedBy: number;

  @Column({
    type: DataType.DATE,
    field: 'created_at'
  })
  createdAt: Date;

  @Column({
    type: DataType.DATE,
    field: 'updated_at'
  })
  updatedAt: Date;
}
