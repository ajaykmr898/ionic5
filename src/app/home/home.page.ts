import {Component, OnInit} from '@angular/core';
import {LoadingBannerService} from '../common/loading-banner.service';
import {UtilsService} from '../common/utils.service';
import {NetworkService} from '../common/network.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.page.html',
    styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
    outline1: string = 'solid';
    public bannerIsVisible: any = false;

    constructor(private banner: LoadingBannerService, private utils: UtilsService, private networkService: NetworkService) {
    }

    public async ionViewDidEnter() {
        this.outline1 = 'solid';
    }

    async ngOnInit() {
        await this.banner.initialize(false);
    }

    public setAlertAndBanner = async () => {
        let res = await this.banner.bannerIsVisibleInPage();
        this.bannerIsVisible = res[0];
        if (this.bannerIsVisible) {
            let mSeconds: any = res[1];
            let interval = setInterval(() => { if (!this.networkService.isOnline()) {clearInterval(interval); this.bannerIsVisible = false; this.showConnectionAlert(); this.banner.initialize( true)}}, 1000);
            setTimeout(() => {this.bannerIsVisible = false; clearInterval(interval); }, mSeconds);
        }
        let res1 = await this.banner.showAlert();
        if (res1) {
            let message = 'Stiamo scaricando i dati neccesari per il corretto funzionamento dell\'app in background, rimani collegato alla rete';
            await this.utils.showAlert('Attenzione', [], [{text: 'Ok', role: 'confirm', cssClass: 'success'}], {message: message, backdropDismiss: false });
        }
    };

    public showConnectionAlert = async () => {
        let message = 'Hai perso la connessione alla rete nella fase di scaricamento dati. L\'app potrebbe non funzionare correttamente senza rete';
        await this.utils.showAlert('Attenzione', [], [{text: 'Chiudi', role: 'confirm', cssClass: 'success'}], {message: message, backdropDismiss: false });
    };

    public clicked = (index: number) => {

        switch (index) {
            case 1:
                this.outline1 = 'outline';
                break;
        }
    }
}
