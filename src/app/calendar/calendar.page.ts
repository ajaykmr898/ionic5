import {Component, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from '../common/utils.service';
import {NetworkService} from '../common/network.service';
import {DateRangeType, IgxCalendarComponent} from "igniteui-angular";
import * as moment from "moment";

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
})
export class CalendarPage {
  @ViewChild("calendar") public calendar: IgxCalendarComponent;
  public date: string = '';
  public time: string = '';
  public min;
  public max;
  public cal;
  public locale = "EN";
  public events = [];
  public status = ['success-icon', 'waiting-icon', 'cancel-icon'];

  constructor(private utils: UtilsService, private networkService: NetworkService) {
  }

  async ngAfterViewInit() {
    await this.initializeCalendar();
  }

  public getClass = (item) => {
    return this.status[item.status] || 'success-icon';
  };

  public onAdd = async () => {
    console.log(this.cal, moment(this.cal).isValid());
    if (this.cal) {
      let key = this.events.length + 1;
      this.events.push({id: key, desc: 'Event ' + key, date: this.cal, status: 1});
      await this.utils.showToast("Event added successfully", {color: 'success'});
    } else {
      await this.utils.showToast("Select a date where to add the event", {color: 'warning'});
    }
  };

  public edit = async (item) => {
    await this.utils.showToast(`Edit for ${item.desc} clicked`, {color: 'success'});
  };

  public delete = async (item) => {
    this.events = this.events.filter((v, k) => v.id != item.id);
  };

  public onSelection = async (ev) => {
    this.cal = moment(ev).format('YYYY-MM-DD');
    await this.initialize(this.cal);
  };

  public initialize = async (date) => {
    this.events = [];
  }

  public initializeCalendar = async () => {
    this.min = moment().format('YYYY-MM-DD');
    this.max = moment().add('1', 'year').format('YYYY-MM-DD');
    this.calendar.selectDate(this.cal);
    let date = [];
    let dates = [];
    try {
      dates = [];
      dates.map((v, k) => {
        v = v['date'];
        let y = moment(v).format('YYYY');
        let m = moment(v).format('MM');
        let d = moment(v).format('DD');
        date.push(new Date(parseInt(y), parseInt(m) - 1, parseInt(d)));
      });
    } catch {
    }
    this.calendar.disabledDates = [{type: DateRangeType.Before, dateRange: [new Date()]}, {
      type: DateRangeType.Specific,
      dateRange: date
    }];
  };
}
