import { UsersModel } from '../../../db/models';
import { BaseCRUDService } from '../abstract/CRUD-for-models';

export class UserService extends BaseCRUDService<UsersModel> {}