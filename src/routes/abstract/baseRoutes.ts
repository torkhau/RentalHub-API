import { NextFunction, Request, Response, Router } from 'express';

export interface Endpoint {
  path: string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
  handler: (req: Request, res: Response, next: NextFunction) => void;
}

export abstract class BaseRoutes {
  private readonly _router: Router;

  constructor() {
    this._router = Router();
  }

  protected generateRoutes(routes: Endpoint[]): void {
    routes.forEach((route) => {
      const { method, path, handler } = route;
      this._router[method](path, handler);
    });
  }

  public get router(): Router {
    return this._router;
  }
}