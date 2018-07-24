import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { VendorsProvider } from '../../providers/vendors/vendors';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { DealsPage } from '../deals/deals';
import { CreatedealPage } from '../createdeal/createdeal';
import { EditVendorPage } from '../edit-vendor/edit-vendor';

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

  constructor(public modalCtrl: ModalController,public navCtrl: NavController, public navParams: NavParams, public vendProv: VendorsProvider) {
    this.placeName = navParams.get('name');
    this.ID = navParams.get('ID');
    this.location = this.vendProv.getRestaurantByPlaceID(this.ID).pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }
  
  createDealClicked(id,name){
    let profileModal = this.modalCtrl.create(CreatedealPage, {
      ID: id,
      name: name
    }, { cssClass: "my-fullscreen", enableBackdropDismiss : false });
    profileModal.present();
  }

  viewDealsClicked(id: string){
    this.navCtrl.push(DealsPage, {
      ID: id,
      name: this.placeName
    });
  }

  editLocation(id: string){
    let profileModal = this.modalCtrl.create(EditVendorPage, {loc: this.location}, { cssClass: 'my-fullscreen',enableBackdropDismiss : false});
    profileModal.present();
  }

  showMenu(url: string){
    window.open(url, "_blank"); 
  }

}
