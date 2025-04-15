import { Model } from 'sequelize';
import { BaseCRUDService } from './base.crud.service';

export abstract class BaseCRUDController<M extends Model, S extends BaseCRUDService<M>, DTO extends object> {
  protected abstract service: S;
  protected abstract toDTO(model: M): DTO;
}
