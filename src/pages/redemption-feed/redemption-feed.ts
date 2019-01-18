import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { HomePage } from '../home/home';

/**
 * Generated class for the RedemptionFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-redemption-feed',
  templateUrl: 'redemption-feed.html',
})
export class RedemptionFeedPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, private afauth: AngularFireAuth, public af: AngularFireDatabase) {
  }

  signout(){
    this.af.database.goOffline();
    this.afauth.auth.signOut().then(val =>{
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.app.getRootNav().setRoot(HomePage);
    });
  }

  ionViewDidLoad() {
    
  }


}
