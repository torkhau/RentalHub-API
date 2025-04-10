import { Options, Sequelize } from 'sequelize';

class SequelizeInstance {
  private readonly _sequelizeOptions: Options = {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
  };
  private readonly _url: string = process.env.DB_URL || '';
  private readonly _sequelize: Sequelize;

  constructor() {
    this._sequelize = process.env.USE_DB_URL === 'true'
      ? new Sequelize(this._url)
      : new Sequelize(this._sequelizeOptions);
  }

  public get sequelize(): Sequelize {
    return this._sequelize;
  }

  public get authenticate() {
    return this._sequelize.authenticate.bind(this._sequelize);
  }

  public get sync() {
    return this._sequelize.sync.bind(this._sequelize);
  }

  public get transaction() {
    return this._sequelize.transaction.bind(this._sequelize);
  }
}

export const sequelizeInstance = new SequelizeInstance();
