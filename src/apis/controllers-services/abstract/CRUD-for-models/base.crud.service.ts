import { Model } from 'sequelize';
import { BaseService } from '../base.service';

export abstract class BaseCRUDService<M extends Model> extends BaseService {}
