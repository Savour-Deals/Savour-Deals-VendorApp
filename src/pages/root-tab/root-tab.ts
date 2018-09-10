import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MainPage } from '../main/main';
import { AccountPage } from '../account/account';


@IonicPage()
@Component({
  selector: 'page-root-tab',
  templateUrl: 'root-tab.html',
})
export class RootTabPage {

  mainPage = MainPage;
  accountPage = AccountPage;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RootTabPage');
  }

}
