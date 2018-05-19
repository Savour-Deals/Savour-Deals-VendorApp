import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs/Observable';
import { VendorPage } from '../vendor/vendor';
import { VendorsProvider } from '../../providers/vendors/vendors';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  public locations: Observable<any[]>;
  public isCurrent = true;
  constructor(private platform: Platform, private afauth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public vendProv: VendorsProvider) {

  }

  signout(){
    this.afauth.auth.signOut().then(val =>{
      this.navCtrl.setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.navCtrl.setRoot(HomePage);
    });
  }

  ionViewDidLoad() {
    if (this.afauth.auth.currentUser.uid == "jf1ZH0JKswXvVo9dEj1HlSiZNUr2"){
      this.locations = this.vendProv.getRestaurants();
    }else{
      this.locations = this.vendProv.getRestaurantsByID(this.afauth.auth.currentUser.uid);
    }
  }

  locationClicked(placeName, placeID){
    this.navCtrl.push(VendorPage, {
      name: placeName,
      ID: placeID
    });
  }
  beginSubscription(){

  }

}
