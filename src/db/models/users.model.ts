import { DataTypes } from 'sequelize';
import { BaseModel } from './abstract';

class Users extends BaseModel<Users> {
  declare email: string;
  declare password: string;
  declare firstName: string;
  declare lastName: string;
  declare phone: string;
}

Users.init(
  {
    ...BaseModel.BASE_ATTRIBUTES,
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: DataTypes.CHAR(120),
    lastName: DataTypes.CHAR(120),
    phone: DataTypes.CHAR(120),
  },
  BaseModel.initBaseOptions<Users>('users')
);

export { Users as UsersModel };
