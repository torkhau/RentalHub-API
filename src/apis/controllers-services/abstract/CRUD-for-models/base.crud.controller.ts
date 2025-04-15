import { Model } from 'sequelize';
import { BaseCRUDService } from './base.crud.service';

interface StaticToDTO<M, DTO> {
  toDTO(model: M): DTO;
}

export abstract class BaseCRUDController<M extends Model, S extends BaseCRUDService<M>, DTO extends object> {
  protected abstract service: S;
  protected readonly staticToDTO: StaticToDTO<M, DTO>;

  constructor(staticToDTO: StaticToDTO<M, DTO>) {
    this.staticToDTO = staticToDTO;
  }
}
