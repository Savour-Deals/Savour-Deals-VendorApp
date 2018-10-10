import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, LoadingController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { VendorPage } from '../vendor/vendor';
import { VendorsProvider } from '../../providers/vendors/vendors';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';


@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  public locations = [];
  public keys = [];
  public active: boolean;
  public user: any;
  public isVendor: boolean = true;
  public isLoaded: boolean = false;
  private _userSub: Subscription;
  public get userSub(): Subscription {
    return this._userSub;
  }
  private loader: any;

  public set userSub(value: Subscription) {
    this._userSub = value;
  }
  constructor(private app:App,private afauth: AngularFireAuth, public loadingCtrl: LoadingController,public navCtrl: NavController, public navParams: NavParams, public vendProv: VendorsProvider, public af: AngularFireDatabase) {
    this.loader = this.loadingCtrl.create({
      spinner: 'dots'
    });
    this.loader.setShowBackdrop(false);
  }

  signout(){
    this.af.database.goOffline();
    this.userSub.unsubscribe();
    this.userSub = null;
    this.afauth.auth.signOut().then(val =>{
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.app.getRootNav().setRoot(HomePage);
    });
  }


  ionViewDidLoad() {
    // this.loader.present();

    const user = this.afauth.auth.currentUser;

    //Get info for database. Save duplicate info on another node to easily find vendor data
    const userRef = this.af.object('Users/'+user.uid);
    const vendorRef = this.af.object('VendorAccounts/'+user.uid);
    if (user.displayName){
      userRef.update({"full_name":user.displayName});
      vendorRef.update({"full_name":user.displayName});
    }
    if (user.email){
      userRef.update({"email":user.email});
      vendorRef.update({"email":user.email});
    }

    this.userSub = this.af.object('Users/'+user.uid).snapshotChanges().subscribe( obj =>{
      // this.loader.dismiss();
      this.isVendor = false;
      this.user = obj.payload.val();
      let role = this.user.role || "Default";
      if (role == "admin"){
        this.isVendor = true;
        this.active = true;
        this.vendProv.getVendors().subscribe(locs=>{
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
      }else if (role == "vendor"){
        this.isVendor = true;
        if (this.user.stripe){
          this.active = this.user.stripe.active;
        } else{
          this.active = false;
        }
        var l = [];
        //Get locations this vendor has
        obj.payload.child("locations").forEach(function(temp) {
          if (temp.val() === true){
            l.push(temp.key);
          }
        });
        if(l.length >0){
          for (let location of l){
            this.vendProv.getVendorsByID(location).subscribe(locs=>{
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
          this.isLoaded = true;
        }

      }else{
        this.isVendor = false;
        this.isLoaded = true;
      }
    });
  }

  locationClicked(placeName, id, stripe){
    this.navCtrl.push(VendorPage, {
      name: placeName,
      ID: id
    });
  }


}
