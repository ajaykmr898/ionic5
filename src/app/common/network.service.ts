import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class NetworkService {

    private online: boolean = window.navigator.onLine;

    constructor() {}

    public initialize() {
        window.addEventListener('online', () => {
            this.online = true;
        });
        window.addEventListener('offline', () => {
            this.online = false;
        });
    }

    public isOnline = () => {
        return this.online;
    }

}
