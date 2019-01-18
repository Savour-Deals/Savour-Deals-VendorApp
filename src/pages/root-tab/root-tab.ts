import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { MainPage } from '../main/main';
import { AccountPage } from '../account/account';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { RedemptionFeedPage } from '../redemption-feed/redemption-feed';


@IonicPage()
@Component({
  selector: 'page-root-tab',
  templateUrl: 'root-tab.html',
})
export class RootTabPage {

  mainPage = MainPage;
  accountPage = AccountPage;
  redemptionPage = RedemptionFeedPage;
  role: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private afauth: AngularFireAuth,  public af: AngularFireDatabase) {
  }

  ionViewDidLoad() {
    const user = this.afauth.auth.currentUser;
    this.af.object('Users/'+user.uid).valueChanges().subscribe( obj =>{
      // this.loader.dismiss();
      const usrData = obj as any;
      this.role = usrData.role || "Default";
    });
  }

}
