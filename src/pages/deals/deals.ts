import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DealsProvider } from '../../providers/deals/deals';
import { AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ViewdealPage } from '../viewdeal/viewdeal';
import { CreatedealPage } from '../createdeal/createdeal';


@IonicPage()
@Component({
  selector: 'page-deals',
  templateUrl: 'deals.html',
})
export class DealsPage {
  private ID: string;
  public place: string;
  public deals: Observable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public dealProv: DealsProvider) {
    this.ID = navParams.get('ID');
    this.place = navParams.get('name');
    this.deals = this.dealProv.getDealsByID(this.ID).pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  createDealClicked(){
    this.navCtrl.push(CreatedealPage, {
    });
  }

  dealClicked(key: string){
    this.navCtrl.push(ViewdealPage, {
      key: key
    });
  }
}
