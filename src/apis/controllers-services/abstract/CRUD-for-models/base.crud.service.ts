import { Model, ModelStatic } from 'sequelize';
import { Base } from '../base';

export abstract class BaseCRUDService<M extends Model> extends Base {
  protected abstract readonly model: ModelStatic<M>;

  public async getItem(id: number): Promise<M | null> {
    try {
      return await this.model.findByPk(id);
    } catch (error) {
      this.handleErrors(error, 'Error fetching item.');
    }
  }

  public async getItems(): Promise<M[]> {
    try {
      return await this.model.findAll();
    } catch (error) {
      this.handleErrors(error, 'Error fetching items.');
    }
  }
}
