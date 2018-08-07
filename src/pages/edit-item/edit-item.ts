import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { VendorsProvider } from '../../providers/vendors/vendors';

/**
 * Generated class for the EditNamePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-item',
  templateUrl: 'edit-item.html',
})
export class EditItemPage {

  public location: any;
  public item: number;
  public titles: string[];
  public values: any[];
  public description: String;
  public loyaltyEnabled: Boolean;

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private vendProv: VendorsProvider) {
    this.location = navParams.get('location');
    this.item = navParams.get('item');
    if (this.item == 0){
      this.titles = ['Name', 'Address', 'Menu'];
      this.values = [this.location.Name,this.location.Address,this.location.Menu];
    }else if (this.item == 1){
      this.titles = ["Description"];
      this.values = [this.location.Desc];
    }else if (this.item == 2){
      this.loyaltyEnabled = false;
      this.titles = ["Code (if needed)", "Deal", "Daily points (Customers need 100 points to redeem)"];
      if (this.location.loyalty){
        this.loyaltyEnabled = true
        this.titles = ["Code (if needed)", "Deal", "Daily points (Customers need 100 points to redeem)"];
        this.values = [this.location.loyalty.loyaltyCode, this.location.loyalty.loyaltyDeal,this.location.loyalty.loyaltyPoints];
      }
    }
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  submit(){
    var data = {};
    if (this.item == 0){
      data = {'Name': this.values[0], 'Address': this.values[1], 'Menu': this.values[2]};
    }else if (this.item == 1){
      data = {"Desc": this.values[0]};
    }else if (this.item == 2){
      if (this.loyaltyEnabled){
        data = {"loyalty":{
            "loyaltyCode" : this.values[0],
            "loyaltyCount" : 100,
            "loyaltyDeal" : this.values[1],
            "loyaltyPoints" : {
              "Fri" : this.values[2].Fri,
              "Mon" : this.values[2].Mon,
              "Sat" : this.values[2].Sat,
              "Sun" : this.values[2].Sun,
              "Thurs" : this.values[2].Thurs,
              "Tues" : this.values[2].Tues,
              "Wed" : this.values[2].Wed
            }
          }
        }
      }else{
        data = null;
      }
    }
    if (data){
      this.vendProv.editVendorInfo(this.location.key, data);
    }
    this.viewCtrl.dismiss();
  }

  getValue(i){
    return this.values[i];
  }

}
