import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { DealsProvider } from '../../providers/deals/deals';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

/**
 * Generated class for the ViewdealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-viewdeal',
  templateUrl: 'viewdeal.html',
})
export class ViewdealPage {
  private key: string;
  public deal: Observable<any[]>;
  public redeemedCount: number;
  public activeDays: any[];
  public start: string;
  public end: string;
  public times: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private dealProv: DealsProvider) {
    this.key = navParams.get('key');
    this.deal = this.dealProv.getDealByKey(this.key).pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.deal.subscribe(result => {
      this.start = moment.unix(result[0].StartTime).format('MMMM Do YYYY');
      this.end = moment.unix(result[0].EndTime).format('MMMM Do YYYY');
      this.times = moment.unix(result[0].StartTime).format("h:mm a") + " - " + moment.unix(result[0].EndTime).format("h:mm a");
      if (this.times == "12:00 am - 12:00 am"){
        this.times = "All Day"
      }
      if (result[0].hasOwnProperty('redeemed')){
        this.redeemedCount = Object.keys(result[0].redeemed).length;

      }else {
        this.redeemedCount = 0;
      }
    });
  }
}
