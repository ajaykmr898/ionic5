import {Component, Input, OnInit} from '@angular/core';
import {PopoverController} from "@ionic/angular";

@Component({
    selector: 'app-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss'],
})
export class ActionsComponent implements OnInit {

    @Input() actions: any;

    constructor(private popoverController: PopoverController) {
    }

    ngOnInit() {
    }

    public closeAction = async (action: Number) => {
        await this.popoverController.dismiss(action);
    };
}
