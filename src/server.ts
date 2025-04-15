import cookieParser from 'cookie-parser';
import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import { ErrorApi } from './apis/error';
import { sequelizeInstance } from './db';
import { AuthRouter } from './routes';

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
    this._express.use('/auth', new AuthRouter().router);
    const routers = express.Router();
    this._express.use('/api', routers);
  }

  private registerErrorHandler(): void {
    this._express.use((error: ErrorApi, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
      const status = error.status || 500;
      res.status(status).send({
        payload: null,
        message: {
          ...error,
          message: error.message,
          stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
        },
      });
    });
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
