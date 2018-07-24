import { Component } from '@angular/core';
import { NavParams, ModalController, ViewController } from 'ionic-angular';
import { VendorModel } from '../../models/restaurant';
import { Observable } from 'rxjs';
import { EditItemPage } from '../edit-item/edit-item';

@Component({
  selector: 'page-edit-vendor',
  templateUrl: 'edit-vendor.html',
})
export class EditVendorPage {
  public obs: Observable<any[]> 
  public vendor: VendorModel = { 
    key: '',
    Name: '',
    Photo: '',
    Address: '',
    Description: '',
    Phone: '',
    Loyalty: {
        code: '',
        count: 0,
        deal: '',
        points: {
            Mon: 0,
            Tues: 0,
            Wed: 0,
            Thurs: 0,
            Fri: 0,
            Sat: 0,
            Sun : 0
        }
    }
  };
  
  constructor(public viewCtrl: ViewController, public modalCtrl: ModalController, public navParams: NavParams) {
    this.obs = navParams.get('loc');
    this.obs.subscribe(loc =>{
      const location = (loc as any);
      this.vendor.key = location.key;
      this.vendor.Name = location.Name;
      this.vendor.Photo = location.Photo;
      this.vendor.Address = location.Address;
      this.vendor.Description = location.Description;
      this.vendor.Loyalty = location.Loyalty;
    })
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditVendorPage');
  }

  editInfo(loc: any, item: number){
    if (item == 0){
      let popover = this.modalCtrl.create(EditItemPage, {
        item: item,
        location: loc
      }, { cssClass: 'my-modal-inner my-stretch'});
      popover.present({
      });
    }else if (item == 1){
      let popover = this.modalCtrl.create(EditItemPage, {
        item: item,
        location: loc
      }, { cssClass: 'my-modal-inner my-stretch'});
      popover.present({
      });
    }
  }

}

