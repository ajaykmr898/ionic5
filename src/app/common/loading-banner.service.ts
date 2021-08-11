import {Injectable} from '@angular/core';
import {Storage} from '@ionic/storage-angular';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class LoadingBannerService {
    public minutes: number = 10;
    constructor(private storage: Storage) {
    }

    public initialize = async (force: boolean = false) => {
        let res = await this.storage.get('installinformation');
        let now = moment().format();
        let alert = false;
        if (!res || force) {
            if (force) { now = moment().subtract(this.minutes + 1, 'minutes').format(); alert = true;}
            await this.storage.set('installinformation', {installationDate: now, alertShown: alert, type: 'installation'});
        }
    };

    public update = async () => {
        let now = moment().format();
        await this.storage.set('installinformation', {installationDate: now, alertShown: false, type: 'update'});
    };

    public bannerIsVisibleInPage = async () => {
        let res = await this.storage.get('installinformation');
        if (res) {
            let time = res.installationDate;
            let timeMinutes = moment(time).add(this.minutes, 'minutes').format();
            if (!moment().isAfter(timeMinutes)){
                return [true, moment(timeMinutes).diff(moment())];
            }
        }
        return [false, 0];
    };

    public showAlert = async () => {
        let res = await this.storage.get('installinformation');
        if(res) {
            await this.storage.set('installinformation', {installationDate: res.installationDate, alertShown: true, type: res.type});
            return !res.alertShown;
        }
        return false;
    }
}
