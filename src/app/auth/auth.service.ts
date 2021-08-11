import {Injectable, OnInit} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import {Auth, UserProfile} from './auth.interface';
import {BehaviorSubject} from 'rxjs';
import {UtilsService} from '../common/utils.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private auth: Auth;
  private user: UserProfile;
  private image: string = '';
  public inited: boolean = false;
  private readySubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private storage: Storage, private utilsService: UtilsService) {
  }


  public init = async () => {
    await this.initializeAuth();
    await this.initializeUser();
  }

  public async storeAuth(auth: Auth): Promise<void> {
    await this.storage.set('auth', auth);
    this.auth = auth;
  }

  public async cleanAuth(): Promise<void> {
    await this.storage.remove('auth');
    this.auth = null;
  }

  public resetPasswordByUsername(username: string): void {
    throw new Error('Method to be implemented both on frontend and backend');
  }

  public isLogged(): boolean {
    return typeof this.auth !== 'undefined' && this.auth !== null;
  }

  public async isLoggedForGuards(): Promise<boolean> {
    await this.authReady();
    return typeof this.auth !== 'undefined' && this.auth !== null;
  }

  public async initializeAuth(): Promise<void> {
    try {
      this.auth = await this.storage.get('auth');
      await this.utilsService.initEndpoint();
    } catch (err) {

    }
    this.readySubject.next(true);
  }

  public async initializeUser(): Promise<void> {
    this.user = await this.storage.get('user');
  }

  public async authReady(): Promise<Auth> {

    return new Promise<Auth>((resolve) => {
      this.readySubject.subscribe((response) => {
        if (response === true) {
          return resolve(this.auth);
        }
      });
    });

  }

  public getAuth(): Auth {
    return this.auth;
  }

  public getUser(): UserProfile {
    return this.user;
  }

  storeUser = async (user: UserProfile) => {
    await this.storage.set('user', user);
    this.user = user;
  };

}
