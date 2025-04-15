import { UsersModel } from '../../../db/models';
import { BaseCRUDController } from '../abstract/CRUD-for-models';
import { UserService } from './user.service';

interface UserDTO {
  id: number;
  firstName?: string;
  lastName?: string;
  phone?: string;
  email: string;
}

export class UserController extends BaseCRUDController<UsersModel, UserService, UserDTO> {
  protected service = new UserService();

  constructor() {
    super(UserController);
  }

  public static toDTO(model: UsersModel): UserDTO {
    return {
      id: model.id,
      firstName: model.firstName,
      lastName: model.lastName,
      phone: model.phone,
      email: model.email,
    };
  }

}