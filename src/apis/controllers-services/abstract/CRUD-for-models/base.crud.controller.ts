import { NextFunction, Request, Response } from 'express';
import { Model } from 'sequelize';
import { Endpoint } from '../../../../routes/abstract';
import { ErrorApi } from '../../../error';
import { Base } from '../base';
import { BaseCRUDService } from './base.crud.service';

export abstract class BaseCRUDController<
  M extends Model,
  S extends BaseCRUDService<M>,
  DTO extends object,
> extends Base {
  protected abstract readonly service: S;
  protected abstract readonly routePrefix: string;
  protected abstract toDTO(model: M): DTO;

  private toNumber(value: string | number): number {
    const num = Number(value);

    if (!Number.isInteger(num) || num <= 0) throw new ErrorApi(400, 'Invalid ID format.');

    return num;
  }

  private async getItem(id: number): Promise<M> {
    try {
      const item = await this.service.getItem(id);

      if (item) return item;

      throw new ErrorApi(404, 'Item not found.');
    } catch (error) {
      this.handleErrors(error, 'Error fetching item.');
    }
  }

  private async getItems(): Promise<M[]> {
    try {
      const items = await this.service.getItems();

      if (items.length) return items;

      throw new ErrorApi(404, 'Items not found.');
    } catch (error) {
      this.handleErrors(error, 'Error fetching items.');
    }
  }

  protected async handlerGetItem({ params: { id } }: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const items: M[] = [];

      if (id) {
        const item = await this.getItem(this.toNumber(id));

        items.push(item);
      } else {
        const allItems = await this.getItems();

        items.push(...allItems);
      }

      res.status(200).json(items.map(this.toDTO));
    } catch (error) {
      next(this.parseError(error, 'Error fetching item.'));
    }
  }

  public get endpoints(): Endpoint[] {
    return [
      {
        method: 'get',
        path: `${this.routePrefix}/:id?`,
        handler: (req, res, next) => this.handlerGetItem(req, res, next),
      },
    ];
  }
}
