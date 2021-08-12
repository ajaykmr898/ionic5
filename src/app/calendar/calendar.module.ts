import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Routes, RouterModule} from '@angular/router';
import {IonicModule} from '@ionic/angular';
import {CalendarPage} from './calendar.page';
import {
  IgxCalendarModule,
  IgxDialogModule, IgxIconModule, IgxInputGroupModule
} from "igniteui-angular";

const routes: Routes = [
    {
        path: '',
        component: CalendarPage
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        IgxCalendarModule,
        IgxDialogModule,
        IgxInputGroupModule,
        IgxIconModule
    ],
    declarations: [CalendarPage]
})
export class CalendarPageModule {
}

