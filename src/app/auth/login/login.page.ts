import {Component, HostListener} from '@angular/core';
import {AuthService} from '../auth.service';
import {NavController} from '@ionic/angular';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
import {Auth} from '../auth.interface';
import {RepositoryService as AuthRepository} from '../repository.service';
import {BadRequest, NotFound, TooManyRequests, UnprocessableEntity} from 'ts-httpexceptions';
import {deferredAddToHomePrompt} from "../../common/pg-service-worker.service";
import {UtilsService} from "../../common/utils.service";
import {environment} from "../../../environments/environment";
import {Storage} from "@ionic/storage-angular";

@Component({
    selector: 'app-login',
    templateUrl: './login.page.html',
    styleUrls: ['./login.page.scss'],
})

export class LoginPage {

    public loginForm: FormGroup;
    @HostListener('document:keypress', ['$event'])
    async handleKeyboardEvent(event: KeyboardEvent) {
        if (event.key === 'Enter' && !this.loginForm.invalid) {
            await this.login();
        }
    }

    constructor(
        private authService: AuthService, private authRepository: AuthRepository, private navigator: NavController, private fb: FormBuilder,
        private utilsService: UtilsService, private storage: Storage
    ) {
        this.loginForm = this.fb.group({
            username: ['', [Validators.required, Validators.pattern('^[^<>\\/]+$')]],
            password: ['', [Validators.required, Validators.pattern('^[^<>\\/]+$')]]
        });
    }

    public async login(): Promise<void> {

        try {
            this.utilsService.setEndpoint(environment.endpoint).catch(console.error);

            let auth: Auth = await this.authRepository.getAuthByCredentials(this.loginForm.value.username, this.loginForm.value.password);
            await this.authService.storeAuth(auth);
            await this.authService.storeUser(
                await this.authRepository.getUser()
            );
            await this.navigator.navigateRoot('home');

        } catch (e) {
            let message = 'Error: Authentication failed, retry again...';
            if (e instanceof BadRequest) {
                message = 'Error: the request could not be understood by server due to malformed syntax';
            } else if (e instanceof NotFound) {
                message = 'Error: User not found with provided credentials, retry again....';
            } else if (e instanceof TooManyRequests) {
                message = 'Too many requests: you must wait ' + e.message + ' minutes before retrying';
            } else if (e instanceof UnprocessableEntity) {
                message = 'Error: Authentication failed, check username and password and retry again';
            }
            await this.utilsService.showToast(message, {color: 'danger', duration: 5000});
        }
    }


    public canInstallPwa() {
        //$log.debug('canInstallPwa()',deferredAddToHomePrompt);
        return !!deferredAddToHomePrompt;
    }


    public doInstallPwa() {
        console.debug('doInstallPwa()');
        deferredAddToHomePrompt.prompt();
    }

}
