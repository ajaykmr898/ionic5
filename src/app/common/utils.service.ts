import {Injectable} from '@angular/core';
import {
	AlertController,
	LoadingController,
	ModalController,
	NavController,
	PopoverController,
	ToastController
} from '@ionic/angular';
import {ActivatedRoute, Router} from '@angular/router';
import axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {BadRequest, InternalServerError, NotFound} from "ts-httpexceptions";
import {Storage} from '@ionic/storage-angular';


export interface IEndpointRequest {
	loader?: {
		message?: string;
	}
}

@Injectable()
export class UtilsService {

	private _endpoint: string = null;

	constructor(
		private loadingController: LoadingController,
		private modalController: ModalController,
		private toastController: ToastController,
		private popoverController: PopoverController,
		private alertController: AlertController,
		private router: Router,
		public nav: NavController,
		private storage: Storage
	) {
	}

  async ngOnInit() {
    await this.initEndpoint().catch(console.error);
  }

	public async initEndpoint(): Promise<string> {
		//console.debug('initEndpoint...');

		if (this._endpoint) {
			//console.debug('endpoint already initialized', this._endpoint);
			return this._endpoint;
		}

		let res: string = await this.storage.get('endpoint');
		if (res) {
			//console.debug('[ENDPOINT] reading from storage', res);
			this._endpoint = res;
			return this._endpoint;
		//} else {
			//console.debug('[ENDPOINT] not in storage');
		}
		return null;
	}


	public getEndpoint(): string {
		//console.debug('getEndpoint()....');
		return this._endpoint;
	}


	public async setEndpoint(value: string): Promise<void> {
		this._endpoint = value;
		//console.debug('[ENDPOINT] writing');
		await this.storage.set('endpoint', this._endpoint);
	}


	public showLoading = async (message: string = 'Loading...', extra?) => {
		const loading = await this.loadingController.create({
			spinner: null,
			message: message,
			translucent: true,
			cssClass: 'custom-class custom-loading',
			...extra
		});
		return await loading.present();
	};


	public showSpinner = async (extra?) => {
		const loading = await this.loadingController.create({
			message: null,
			cssClass: 'custom-class custom-loading',
			...extra
		});
		return await loading.present();
	};


	public hideLoading = async () => {
		try {
			await this.loadingController.dismiss();
		} catch (err) {
			console.debug('catched hideLoading', err);
		}
	};


	public showModal = async (component, componentProps?, extra?) => {
		const modal = await this.modalController.create({
			component: component,
			componentProps: componentProps,
			backdropDismiss: false,
			...extra
		});
		//return await modal.present();
		await modal.present();
		return await modal.onWillDismiss();
	};


	public showPopover = async (event, component, componentProps?) => {
		const popover = await this.popoverController.create({
			component: component,
			componentProps: componentProps,
			event: event,
			translucent: true
		});
		//return await popover.present();
		await popover.present();
		return await popover.onWillDismiss();
	};


	public closeModal = async (data?) => {
		await this.modalController.dismiss(data);
	};


	public showToast = async (message: string, extra?) => {
		const toast = await this.toastController.create({
			message: message,
			position: 'bottom',
			duration: 2000,
			...extra,
		});
		if (extra.redirect) {
			toast.onDidDismiss().then(async () => {
				await this.hideLoading();
				await this.router.navigateByUrl(extra.redirect);
			});
		}
		return await toast.present();
	};
/*

	public showToastOnErrorWithRedirect = async (message: string, path: string = '/dashboard') => {
		const toast = await this.toastController.create({
			message: message,
			showCloseButton: true,
			position: 'bottom',
			closeButtonText: 'Ok',
			color: 'danger',
			duration: 10000,
		});

		toast.onDidDismiss().then(async () => {
			await this.hideLoading();
			await this.router.navigateByUrl(path);
		});

		return await toast.present();
	};


	public showToastOnError = async (message: string) => {
		const toast = await this.toastController.create({
			message: message,
			duration: 10000,
			showCloseButton: true,
			position: 'bottom',
			closeButtonText: 'Ok',
			color: 'danger',
		});

		toast.onDidDismiss().then(async () => {
			// other events
		});

		return await toast.present();
	};


	public showToastOnSuccess = async (message: string) => {
		const toast = await this.toastController.create({
			message: message,
			duration: 10000,
			showCloseButton: true,
			position: 'bottom',
			closeButtonText: 'Ok',
			color: 'success'
		});

		toast.onDidDismiss().then(async () => {
			// other events
		});

		return await toast.present();
	};


	public showToastOnSuccessWithRedirect = async (message: string, path: string = '/dashboard') => {
		const toast = await this.toastController.create({
			message: message,
			duration: 10000,
			showCloseButton: true,
			position: 'bottom',
			closeButtonText: 'Ok',
			color: 'success'
		});

		toast.onDidDismiss().then(async () => {
			await this.hideLoading();
			await this.router.navigateByUrl(path);
		});

		return await toast.present();
	};
*/

	public showAlert = async (header, inputs?, buttons?, extra?): Promise<any> => {
		const alert = await this.alertController.create({
			header,
			inputs,
			buttons,
			backdropDismiss: false,
			...extra
		});

		await alert.present();
		return await alert.onWillDismiss();
	};


	public async createConfirm(message: string, header: string = '', cancel: string = 'Cancel', confirm: string = 'OK'): Promise<boolean> {
		let buttons = [
		    {
				text: confirm,
				role: 'confirm',
				cssClass: 'success',
			}
		];
		let res = await this.showAlert(header, [], buttons, {message: message, backdropDismiss: false});
		return res && res.role && res.role === 'confirm';
	}


	public async createDialog(message: string, header: string = '', confirm: string = 'OK'): Promise<void> {
		let buttons = [
			{
				text: confirm,
				role: 'confirm',
				cssClass: 'success',
			}
		];
		await this.showAlert(header, [], buttons, {message: message});
	}


	public getRouteParam(activatedRouter: ActivatedRoute, paramName: string, paramDefault: any = null) {
		let res: any = activatedRouter.snapshot.paramMap.get(paramName);
		if (res === null) {
			return paramDefault;
		}
		return res;
	}


	async endpointRequest<T>(url, options: AxiosRequestConfig = {}, extra: IEndpointRequest = {}): Promise<T> {

		let loaderMessage: string = extra.hasOwnProperty('loader') && extra.loader.hasOwnProperty('message') ? extra.loader.message : null;

		if (loaderMessage) {
			await this.showLoading(loaderMessage);
		}

		let reqUrl = this.getEndpoint() + url;

		try {
			let res: AxiosResponse = await axios(reqUrl, options);

			if (loaderMessage) {
				await this.hideLoading();
			}

			if (res && res.hasOwnProperty('data') && res.data.hasOwnProperty('data')) {
				return res.data.data;
			}

			// noinspection ExceptionCaughtLocallyJS
			throw new Error('Unexplainable error');

		} catch (err) {

			if (loaderMessage) {
				await this.hideLoading();
			}

			let newError = err;
			if (err.response.hasOwnProperty('data') && err.response.data.hasOwnProperty('errors') && Array.isArray(err.response.data.errors) && err.response.data.errors.length>0) {
				newError = err.response.data.errors[0];
			}

			switch (err.response.status) {
				case 400:
					throw new BadRequest(newError);
				case 404:
					throw new NotFound(newError);
				default:
					throw new InternalServerError(newError);
			}
		}
	}

	public reload = (time: number = 1000) => {
		setTimeout(() => window.location.reload(), time);
	};

}
