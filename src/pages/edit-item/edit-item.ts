import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

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
  public name: string;
  public item: number;
  public title: string;
  constructor(public viewCtrl: ViewController, public navCtrl: NavController, public navParams: NavParams) {
    this.name = navParams.get('name');
    this.item = navParams.get('item');
    if (this.item == 0){
      this.title = "Enter new vendor name:"
    }else if (this.item == 1){
      this.title = "Enter new address:"
    }
  }

  ionViewDidLoad() {
  }

  close() {
    this.viewCtrl.dismiss();
  }

  submit(){
    this.viewCtrl.dismiss();
  }

}
