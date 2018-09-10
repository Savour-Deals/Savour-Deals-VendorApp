import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { StripeJsPage } from '../stripe-js/stripe-js';


@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AccountPage');
  }

  gotoPage(idx){
    switch(idx){
      case (1): 
      this.navCtrl.push(StripeJsPage, {});
      break;
      default:
      alert("Could not find selected page. We are working on this!");
      break;
    }
  }

}
