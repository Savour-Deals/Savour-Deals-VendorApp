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

  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams, private vendProv: VendorsProvider) {
    this.location = navParams.get('location');
    this.item = navParams.get('item');
    if (this.item == 0){
      this.titles = ['Name', 'Address', 'Menu'];
      this.values = [this.location.Name,this.location.Address,this.location.Menu];
    }else if (this.item == 1){
      this.titles = ["Description"];
      this.values = [this.location.Desc];
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
    }
    this.vendProv.editVendorInfo(this.location.key, data);
    this.viewCtrl.dismiss();
  }

  getValue(i){
    return this.values[i];
  }

}
