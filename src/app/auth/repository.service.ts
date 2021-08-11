import {Injectable} from '@angular/core';
import {Auth, UserProfile} from './auth.interface';
import axios from 'axios';
import {BadRequest, Conflict, InternalServerError, NotFound, TooManyRequests} from 'ts-httpexceptions';
import {AuthService} from './auth.service';
import {UtilsService} from "../common/utils.service";


@Injectable({
  providedIn: 'root'
})
export class RepositoryService {

  constructor(private authService: AuthService, private utilsService: UtilsService) {
  }

  public async getAuthByCredentials(username: string, password: string)/*: Promise<Auth>*/ {
    return {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVfZGF0ZSI6MTYyODY4MjE0NSwicmFuZG9tSWQiOiI2MTEzYTk5MTg3MjY0IiwidXNlcklkIjoiZTE5YmUzMzJjMmVmMjcwNTIxYTI0MzBlOTgzNTllYTUiLCJleHRlcm5hbFRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsYVdRaU9pSlRUMDVKUVM1Q1JWSkZWRlJCSWl3aWRXNXBjWFZsWDI1aGJXVWlPaUpUVDA1SlFTNUNSVkpGVkZSQklpd2lTWEJCWkdSeVpYTnpJam9pTlRJdU1UY3VPRE11T0RFaUxDSnVZbVlpT2pFMk1qZzJOemcxTkRZc0ltVjRjQ0k2TVRZeU9USTRNek0wTml3aWFXRjBJam94TmpJNE5qYzROVFEyZlEuLXdVcTQ0QlJpTFRfNVQ0LTFITm84bUpNNXhkZWpJMkdrdTNycVlMaTM0YyIsImdyb3VwSWQiOjI3LCJuYW1lIjoiU09OSUEuQkVSRVRUQSIsImVtYWlsIjoic2JlcmV0dGFAcGFyZGdyb3VwLmNvbSIsImV4dGVybmFsVWlkIjoiQjMzNTMiLCJzb3VyY2UiOiJ6YWMifQ.-jfePw4WQPMteRT5WWsdfGnasWs6bMxuncri_F-DHZ4",
        "refresh": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHBpcmVfZGF0ZSI6MTYyODY4MjE0NSwicmFuZG9tSWQiOiI2MTEzYTk5MTkxY2RmIiwidXNlcklkIjoiZTE5YmUzMzJjMmVmMjcwNTIxYTI0MzBlOTgzNTllYTUiLCJleHRlcm5hbFRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnVZVzFsYVdRaU9pSlRUMDVKUVM1Q1JWSkZWRlJCSWl3aWRXNXBjWFZsWDI1aGJXVWlPaUpUVDA1SlFTNUNSVkpGVkZSQklpd2lTWEJCWkdSeVpYTnpJam9pTlRJdU1UY3VPRE11T0RFaUxDSnVZbVlpT2pFMk1qZzJOemcxTkRZc0ltVjRjQ0k2TVRZeU9USTRNek0wTml3aWFXRjBJam94TmpJNE5qYzROVFEyZlEuLXdVcTQ0QlJpTFRfNVQ0LTFITm84bUpNNXhkZWpJMkdrdTNycVlMaTM0YyIsImdyb3VwSWQiOjI3LCJuYW1lIjoiU09OSUEuQkVSRVRUQSIsImVtYWlsIjoic2JlcmV0dGFAcGFyZGdyb3VwLmNvbSIsImV4dGVybmFsVWlkIjoiQjMzNTMiLCJzb3VyY2UiOiJ6YWMifQ.5hjQJEwkW8-ElJOiECopacsirTH8TxVKa2ZHtACvIIs"
    };

    let res = null;
    let endpoint = this.utilsService.getEndpoint() + '/token';
    try {
      res = await axios.post(endpoint, {username: username, password: password});
    } catch (err) {

      switch (err.response.status) {
        case 400:
          throw new BadRequest(err);
        case 404:
          throw new NotFound(err);
        case 429:
          throw new TooManyRequests(err.response.data.data.minutesToWait);
        default:
          throw new InternalServerError(err);
      }
    }

    if (!!res && res.status === 200) {
      return res.data.data;
    }

    throw new Error('Unexplainable error');
  }

  public async logout(): Promise<boolean> {
    return true;
    let res = null;
    let endpoint = this.utilsService.getEndpoint() + '/token';

    try {
      res = await axios.delete(endpoint);
    } catch (err) {

      switch (err.response.status) {
        case 404:
          throw new NotFound(err);
        case 409:
          throw new Conflict(err);
        default:
          throw new InternalServerError(err);
      }
    }

    if (!!res && res.status === 204) {
      return true;
    }

    throw new Error('Unexplainable error');
  }

  public async getUser()/*: Promise<UserProfile> */{
    return {
      "email": "sberetta@pardgroup.com",
      "name": "SONIA.BERETTA",
      "groupId": 27,
      "source": "zac"
    };
    let res = null;
    let endpoint = this.utilsService.getEndpoint() + '/me';

    try {
      res = await axios(endpoint);
    } catch (err) {

      switch (err.response.status) {
        case 400:
          throw new BadRequest(err);
        default:
          throw new InternalServerError(err);
      }
    }

    if (!!res && res.status === 200) {
      return res.data.data.user;
    }

    throw new Error('Unexplainable error');
  }

}
