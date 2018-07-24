import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { VendorPage } from '../vendor/vendor';
import { VendorsProvider } from '../../providers/vendors/vendors';
import { AngularFireDatabase } from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  public locations = [];
  public keys = [];
  public isCurrent = true;
  public user: any;
  public isVendor: boolean = true;
  public isLoaded: boolean = false;
  constructor( private afauth: AngularFireAuth,public navCtrl: NavController, public navParams: NavParams, public vendProv: VendorsProvider, public af: AngularFireDatabase) {

  }

  signout(){
    this.afauth.auth.signOut().then(val =>{
      this.navCtrl.setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.navCtrl.setRoot(HomePage);
    });
  }

  ionViewDidLoad() {
    this.af.object('Users/'+this.afauth.auth.currentUser.uid).snapshotChanges().subscribe( obj =>{
          this.user = obj.payload.val();
          if (this.user.role == "admin"){
            this.isVendor = true;
            this.vendProv.getRestaurants().subscribe(locs=>{
              locs.forEach(loc => {
                var idx = this.keys.indexOf(loc.payload.key)
                if (idx > -1){
                  this.locations[idx] = loc.payload.val();
                }else{
                  this.locations.push(loc.payload.val());
                  this.keys.push(loc.payload.key);
                }
              });
              this.isLoaded = true;
            });
          }else if (this.user.role == "vendor"){
            this.isVendor = true;
            var l = [];
            //Get locations this vendor has
            obj.payload.child("locations").forEach(function(temp) {
              if (temp.val() === true){
                l.push(temp.key);
              }
            });
            for (let location of l){
              this.vendProv.getRestaurantsByID(location).subscribe(locs=>{
                locs.forEach(loc => { 
                  this.isLoaded = true;
                  var idx = this.keys.indexOf(loc.payload.key)
                  if (idx > -1){
                    this.locations[idx] = loc.payload.val();
                  }else{
                    this.locations.push(loc.payload.val());
                    this.keys.push(loc.payload.key);
                  }
                });
              });
            }
          }else{
            this.isVendor = false;
          }
      });
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
