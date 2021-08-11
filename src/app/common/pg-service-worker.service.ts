import {SwUpdate} from '@angular/service-worker';
import {Injectable, NgZone} from '@angular/core';
import {UtilsService} from "./utils.service";
import {interval} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
	providedIn: 'root'
})
export class PgServiceWorkerService {

	private swManaged: boolean = false;

	constructor(
		public sw: SwUpdate,
		private util: UtilsService,
		private zone: NgZone
	) {
	}

	init(seconds: number = 3600): boolean {

		if (this.swManaged) {
			console.error('[SW] already managed');
			return true;
		}

		if (!this.sw.isEnabled) {
			console.warn('[SW] not enabled');
			return false;
		}

		console.info('[SW] ' + (isInStandaloneMode() ? 'STANDALONE' : 'WEB') + ' APP');

		// Lock
		this.swManaged = true;

		//Home Screen
		window.addEventListener('beforeinstallprompt', (event: any) => {
			console.info('[SW] EVENT beforeinstallprompt');
			deferredAddToHomePrompt = event;
		});

		// Subscribe
		this.sw.available.subscribe(
			async (event) => {

				console.info('[SW] new version available');
				console.debug('current', event.current);
				console.debug('available', event.available);

				const res: boolean = await this.util.createConfirm('È disponibile una nuova versione.', 'Aggiornamento disponibile', 'Non ora', 'Aggiorna');
				if (res) {
					console.debug('[SW] attivazione');
					this.sw.activateUpdate()
						.then(() => {
							console.info('[SW] activateUpdate success');
						})
						.catch(err => {
							console.error('[SW] activateUpdate ERROR', err);
						});
				}
			}, err => {
				console.error('available', err);
			});

		this.sw.activated.subscribe(
			async (event) => {
				console.info('[SW] new version activated:');
				console.debug('current', event.previous);
				console.debug('available', event.current);

				const res: boolean = await this.util.createConfirm('L\'aggiornamento è stato scaricato con successo.<br>' +
					'È necessario riavviare l\'App per rendere effettive le modifiche.<br>' +
					'<b>I dati non salvati andranno persi.</b>', 'Aggiornamento completato', 'Rimanda', 'Riavvia ora');

				if (res) {
					console.info('[SW] reloading the app ...');
					document.location.reload(true);
				} else {
					await this.util.createDialog('Potrai riavviare l\'App toccando “Riavvia App” dal menù.', 'Aggiornamento rimandato');
				}
			}, err => {
				console.error('activated', err);
			}
		);

		// Set timer
		this.zone.runOutsideAngular(() => {
			interval(seconds * 1000).subscribe(() => {
				this.zone.run(() => {
					this.checkForUpdate();
				});
			});
		});

	}


	checkForUpdate() {
		console.debug('[SW] checkForUpdate()');
		this.sw.checkForUpdate()
			.then(() => {
				console.debug('[SW] checkForUpdate done')
			})
			.catch((err) => {
				console.error('[SW] checkForUpdate error', err)
			})
		;
	}


}


// NOTE: implementazione come descitto da google
export let deferredAddToHomePrompt: any = null;


function isInStandaloneMode(): boolean {
	return window.matchMedia('(display-mode: standalone)').matches;
}


export function restartBrowserApp() {
	window.location.href = '/';
	window.location.reload(true);
}

