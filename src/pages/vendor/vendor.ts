import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { VendorsProvider } from '../../providers/vendors/vendors';
import { AngularFireAction } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DealsPage } from '../deals/deals';

@IonicPage()
@Component({
  selector: 'page-vendor',
  templateUrl: 'vendor.html',
})

export class VendorPage {
  public placeName: string;
  private ID: string;
  public location: Observable<any[]>;
  public loaded: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public vendProv: VendorsProvider) {
    this.placeName = navParams.get('name');
    this.ID = navParams.get('ID');
    this.location = this.vendProv.getRestaurantByName(this.ID).pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  viewDealsClicked(id: string){
    this.navCtrl.push(DealsPage, {
      ID: id,
      name: this.placeName
    });
  }

}
