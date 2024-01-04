import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../generic-dto/pagination.dto';

/**
 * BaseService
 *
 */
@Injectable()
export class BaseService {
  /**
   * Sequelize Schema Model
   */
  public model: any;

  /**
   *
   * @param model SequelizeSchemaModel
   */
  constructor(model: any) {
    this.model = model;
  }

  /**
   * Find one record by condition
   *
   * @param condition any
   * @returns Model
   */
  public findOne(condition: any, include?: any, attributes?: any, order?: any) {
    console.log('findOne', condition);
    return this.model.findOne({
      where: condition,
      include: include,
      attributes: attributes,
      order: order
    });
  }

  /**
   * Find one record by id
   *
   * @param id number
   * @returns Model
   */
  public findOneById(id: number, include?: any, attributes?: any, order?: any) {
    return this.findOne({ id: id }, include, attributes, order);
  }

  /**
   * Find all by condition
   *
   * @param condition any
   * @returns Model
   */
  public findAll(condition?: any, sortOrder?: any, include?: any, attributes?: any) {
    return this.model.findAll({
      where: condition,
      order: sortOrder,
      include: include,
      attributes: attributes,
      subQuery: false
    });
  }

  /**
   * @param payload
   * @param include
   * @returns
   */
  public async findAllWithPagination(payload: PaginationDto, include?: any) {
    const records = await this.model.findAndCountAll({
      include: include,
      where: payload.condition,
      attributes: payload.attributes,
      order: [[payload.sortColumn, payload.sortOrder]],
      offset: payload.page && payload.pageSize ? (payload.page - 1) * payload.pageSize : undefined,
      limit: payload.pageSize,
      subQuery: false
    });
    console.log(records, 'records');
    // const totalRecords = await this.model.count({ where: payload.condition });
    return { data: records.rows, totalRecords: records.count };
  }

  /**
   * Find or create
   *
   * @param condition any
   * @param fields any
   * @returns Model
   */
  public findOrCreate(condition: any, fields: any) {
    return this.model.findOrCreate({ where: condition, defaults: fields });
  }

  /**
   * Find and count all by condition
   * @param condition any
   * @returns Model
   */
  public findAndCountAll(condition: any) {
    return this.model.findAndCountAll({ where: condition });
  }

  /**
   * Create new record.
   *
   * @param fields any
   * @param userId number
   * @returns Model
   */
  public create(fields: any, userId?: any, include?: any) {
    fields['createdBy'] = userId;
    return this.model.create(fields, { include });
  }

  /**
   * Bulk create new record.
   *
   * @param fields any
   * @param userId number
   * @returns Model
   */
  public bulkCreateOrUpdate(fields: any, userId?: any, option?: any) {
    if (option) {
      fields.forEach((field) => (field['updatedBy'] = userId));
    } else {
      fields.forEach((field) => (field['createdBy'] = userId));
    }
    return this.model.bulkCreate(fields, { ...option });
  }

  /**
   * Create new record while in transaction mode.
   *
   * @param fields any
   * @param userId number
   * @param transaction object
   * @returns Model
   */
  public createWithTransaction(fields: any, userId?: any, transaction?: any) {
    fields['createdBy'] = userId;

    return this.model.create(fields, { transaction });
  }
  /**
   * Update new record while in transaction mode.
   *
   * @param condition any
   * @param fields any
   * @param userId number
   * @param transaction object
   * @param returning boolean
   * @returns Model
   */
  public updateWithTransaction(
    condition: any,
    fields: any,
    userId?: number,
    transaction?: any,
    returning?: boolean
  ) {
    fields['updatedBy'] = userId;

    return this.model.update(fields, { where: condition, returning: returning, transaction });
  }

  /**
   * Update record(s) by condition;
   *
   * @param condition any
   * @param fields any
   * @param userId number
   * @returns
   */
  public updateByCondition(
    condition: any,
    fields: any,
    userId?: number,
    returning?: boolean,
    include?: any
  ) {
    fields['updatedBy'] = userId;
    return this.model.update(fields, { where: condition, returning: returning, include });
  }

  /**
   * Update record(s) by condition;
   *
   * @param condition any
   * @param fields any
   * @param userId number
   * @returns
   */
  public createOrUpdate(fields: any, userId?: number) {
    return this.model.upsert(fields, { userId, hooks: true });
  }

  /**
   * Update one record by id
   * @param id number
   * @param fields any
   * @param userId number
   * @returns
   */
  public update(id: number, fields: any, userId?: number, returning?: boolean, include?: any) {
    return this.updateByCondition({ id: id }, fields, userId, returning, include);
  }

  /**
   * Delete record(s) by condition
   * @param condition any
   * @returns
   */
  public deleteByCondition(condition: any) {
    return this.model.destroy({ where: condition });
  }

  /**
   * Delete one record by id (primary key)
   * @param id number
   * @returns
   */
  public delete(id: number) {
    return this.deleteByCondition({ id: id });
  }

  /**
   *
   * @param origin
   * @param destination
   * @returns
   */
  public async reorder(origin: number, destination: number, id: number) {
    await this.updateByCondition({ sequence: origin }, { sequence: 0 }, id);

    if (origin < destination) {
      for (let i = origin; i < destination; i++) {
        await this.updateByCondition({ sequence: i + 1 }, { sequence: i }, id);
      }
    } else {
      for (let i = origin; i > destination; i--) {
        await this.updateByCondition({ sequence: i - 1 }, { sequence: i }, id);
      }
    }

    await this.updateByCondition({ sequence: 0 }, { sequence: destination }, id);

    return await this.findAll({}, [['sequence', 'asc']]);
  }
}
