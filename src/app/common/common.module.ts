import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {UtilsService} from './utils.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoadingBannerService} from "./loading-banner.service";
import {ActionsComponent} from "./actions/actions.component";



@NgModule({
    imports: [
        CommonModule,
        IonicModule,
        FormsModule,
        ReactiveFormsModule,
    ],
    declarations: [ActionsComponent],
    exports: [],
    entryComponents: [ActionsComponent],
    providers: [UtilsService, LoadingBannerService],

})
export class PgCommonModule {
}
