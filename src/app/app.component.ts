import {Component} from '@angular/core';
import {InterceptorService} from './common/interceptor.service';
import {NetworkService} from './common/network.service';
import {Storage} from '@ionic/storage-angular';
import {MenuController, NavController, Platform} from "@ionic/angular";
import {AuthService} from "./auth/auth.service";
import {RepositoryService} from "./auth/repository.service";
import {deferredAddToHomePrompt, PgServiceWorkerService, restartBrowserApp} from "./common/pg-service-worker.service";
import {UtilsService} from "./common/utils.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    {title: 'Home', url: '/home/', icon: 'home'},
  ];
  public selectedIndex = 0;
  public subSelectedIndex = 0;
  public subs = {};
  constructor(
    private interceptorService: InterceptorService,
    private network: NetworkService,
    private storage: Storage,
    private platform: Platform,
    public authService: AuthService,
    private authRepository: RepositoryService,
    private navigator: NavController,
    private sw: PgServiceWorkerService,
    private util: UtilsService,
    private menu: MenuController
  ) {

  }

  async ngOnInit() {
    await this.storage.create();
    this.network.initialize();
    this.interceptorService.initialize();
    this.sw.init();
    await this.authService.init();
  }

  public async logout(): Promise<void> {

    try {
      await this.authRepository.logout();
      await this.authService.cleanAuth();
      await this.navigator.navigateRoot('login');

    } catch (e) {
      await this.authService.cleanAuth();
      await this.navigator.navigateRoot('login');
    }

    window.location.href = '/';
  }

  public click = async (url: string, i: any, type: string, submenu: [] = [], key: string = '') => {
    this.selectedIndex = i;
    if (submenu.length == 0) {
      await this.menu.toggle();
      if (type == 'menu') {
        this.subSelectedIndex = -1;
        for (let s of Object.keys(this.subs)) {
          this.subs[s] = false;
        }
        if (url == '/logout/') {
          await this.logout();
        }
      } else {
        this.subSelectedIndex = i;
      }
    } else {
      this.subs[key] = !this.subs[key];
    }
  }

  public canInstallPwa() {
    return !!deferredAddToHomePrompt;
  }

  public doInstallPwa() {
    console.debug('doInstallPwa()');
    // noinspection TypeScriptValidateJSTypes
    deferredAddToHomePrompt.prompt();
  }


  public doCheckUpdates() {
    this.util.showToast('Checking updates in background...\nThis operation may take some minutes.', {
      color: 'success',
      duration: 3000
    })
      .catch(console.error);
    this.sw.checkForUpdate();
  }


  public doRefreshBrowser() {
    restartBrowserApp();
  }
}
