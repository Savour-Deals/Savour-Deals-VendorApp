import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Observable } from 'rxjs';
import { DealsProvider } from '../../providers/deals/deals';
import { map } from 'rxjs/operators';

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
  constructor(public navCtrl: NavController, public navParams: NavParams, private dealProv: DealsProvider) {
    this.key = navParams.get('key');
    this.deal = this.dealProv.getDealByKey(this.key).pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
    this.deal.subscribe(result => {
      if (result[0].hasOwnProperty('redeemed')){
        this.redeemedCount = Object.keys(result[0].redeemed).length
      }else {
        this.redeemedCount = 0;
      }
    });
  }
}
