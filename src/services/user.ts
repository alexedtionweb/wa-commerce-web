import { DeepReadonly } from 'helpers/immutable';
import { IPaginationParams, IPaginationResponse } from 'interfaces/pagination';
import { IUser } from 'interfaces/user';
import { IUserRole } from 'interfaces/userRole';
import * as rxjs from 'rxjs';
import rxjsOperators from 'rxjs-operators';

import apiService, { ApiService } from './api';

export class UserService {
  constructor(private apiService: ApiService) { }

  public list(params: IPaginationParams): rxjs.Observable<IPaginationResponse<IUser>> {
    return this.apiService.get('/user', params);
  }

  public roles(refresh: boolean = false): rxjs.Observable<DeepReadonly<IUserRole[]>> {
    return this.apiService.get('/user/roles').pipe(
      rxjsOperators.cache('user-service-roles', { refresh })
    );
  }

  public save(model: IUser): rxjs.Observable<IUser> {
    return this.apiService.post('/user', model);
  }

  public delete(id: number): rxjs.Observable<void> {
    return this.apiService.delete(`/user/${id}`);
  }
}

const userService = new UserService(apiService);
export default userService;