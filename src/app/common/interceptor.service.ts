import {Injectable} from '@angular/core';
import axios from 'axios';
import {AuthService} from '../auth/auth.service';
import {Auth} from '../auth/auth.interface';
import {LoadingController, NavController, ToastController} from '@ionic/angular';
import {UtilsService} from "./utils.service";


@Injectable({
    providedIn: 'root'
})
export class InterceptorService {


    constructor(private authService: AuthService, private navigator: NavController, private loader:LoadingController, private toast:ToastController, private utilsService: UtilsService) {
    }


    public initialize() {
        axios.interceptors.request.use(
            (config) => {

                let auth: Auth = this.authService.getAuth();

                if (!(config['url'].indexOf('/token') != -1 && config['method'] == 'post') && auth) {
                    config['headers']['Authorization'] = 'Bearer ' + auth.token;
                }

                return config;
            },

            (error) => {
                // Fai qualcosa nel caso di un errore return Promise.reject(error);
                console.error('[InterceptorService] inizialize error', error);
            }
        );

        axios.interceptors.response.use(
            (response) => {
                return response;
            },
            async (error) => {
                const originalRequest = error.config;

                console.debug('axios interceptor onRejected', error.response.status, error.response.data );

                // AGX: axios generalmente ritorna 504 quando sei offline
                if (error.response.status===504) {
                    console.warn('axios failed because offline');
                    return error;
                }

                // Se è 403 oppure è la URL del refresh token allora non possiamo + continuare e deve tornare alla home
                if (originalRequest['url'].indexOf('/token/refresh') !== -1) {
                    console.debug('redirecting to home', error.response.status);
                    await this.authService.cleanAuth();
                    // Chiude tutti i popup eventualmente attivi
                    try {
                        await this.loader.dismiss();
                        await this.toast.dismiss();
                    } catch(err) {
                        // ignora l'errore nel caso il loader o il toast non fosse attivo
                    }
                    await this.navigator.navigateRoot('/');
                    return error;
                }

                //console.debug('interceptor rejected with', error.response.status);

                if (error.response.status === 401 /*|| error.response.status === 403*/) {

                    let auth: Auth = this.authService.getAuth();

                    if (auth) {
                        console.debug('refreshing token for:', originalRequest.url);
                        let res = await axios.post(this.utilsService.getEndpoint() + '/token/refresh', {}, {
                            headers: {
                                'Authorization': 'Bearer ' + auth.refresh
                            }
                        });

                        if (!!res && res.status === 200 && res.data.hasOwnProperty('data')  ) {
                            //console.info('new token',res.data.data);
                            await this.authService.storeAuth(res.data.data);

                            // TODO: add the new token to the header of the originalRequest
                            auth = this.authService.getAuth();
                            originalRequest.headers['Authorization'] = 'Bearer '+ auth.token;

                            return axios(originalRequest);
                        }
                        console.error('token refresh failed.', res);
                    }

                }
                return Promise.reject(error);
            }
        );
    }


}
