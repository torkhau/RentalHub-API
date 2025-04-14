import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, InitOptions, Model } from 'sequelize';
import { sequelizeInstance } from '../..';

export abstract class BaseModel<M extends Model, Omits extends keyof M | never = never> extends Model<
  InferAttributes<M, { omit: Omits }>,
  InferCreationAttributes<M, { omit: Omits }>
> {
  declare id: CreationOptional<number>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  static readonly BASE_ATTRIBUTES = {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  };

  static initBaseOptions<M extends Model>(tableName: string): InitOptions<M> {
    return { sequelize: sequelizeInstance.sequelize, tableName };
  }
}
