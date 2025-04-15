import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { ErrorApi } from './apis/error';
import { ResponseApi } from './apis/response';
import { sequelizeInstance } from './db';

export class Server {
  private readonly port = parseInt(process.env.PORT || '3000', 10);
  private readonly _express: express.Application;

  constructor() {
    this._express = express();
  }

  private registerMiddlewares(): void {
    this._express.use(cors({ credentials: true }));
    this._express.use(cookieParser());
    this._express.use(express.json());
  }

  private registerRoutes(): void {
    this._express.get('/', (_req, res) => {
      res.send('There is API for RentalHub project.');
    });
  }

  private registerErrorHandler(): void {
    this._express.use(
      (error: ErrorApi, _req: express.Request, res: express.Response<ResponseApi>, _next: express.NextFunction) => {
        const status = error.status || 500;
        const message = error.customMessage;

        if (typeof message !== 'string' && process.env.NODE_ENV === 'development') message.stack = error.stack;
        
        res.status(status).json({ payload: null, message });
      }
    );
  }

  private async connectToDatabase(): Promise<void> {
    try {
      await sequelizeInstance.authenticate();
      console.log('Database connection has been established successfully.');
      await sequelizeInstance.sync({ alter: true });
      console.log('Database synchronized successfully.');
    } catch (error) {
      console.error('Database connection error:', error);
      throw new ErrorApi(500, 'Database connection error.');
    }
  }

  public async start(): Promise<void> {
    this.registerMiddlewares();
    this.registerRoutes();
    this.registerErrorHandler();
    try {
      await this.connectToDatabase();
    } catch (error) {
      if (error instanceof ErrorApi) {
        console.error('Database connection error:', error.message);
      } else {
        console.error('Unexpected error:', error);
      }
    }
    this._express.listen(this.port, () => console.log(`Server is running on port ${this.port}`));
  }
}
