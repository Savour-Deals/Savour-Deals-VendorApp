import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { AngularFireAuth } from 'angularfire2/auth';
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';
import { AppDataProvider } from '../../providers/app-data/app-data';
import { environment as ENV } from '../../environments/environment';
import { DealsProvider } from '../../providers/deals/deals';
import { AngularFireStorage } from 'angularfire2/storage';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  cust_id: any;
  active: any;
  thiskeys = ENV.app_version;


  customerLoaded = false;
  sub_id: any;

  curr_invoice: any;
  planData: any;
  billingStart: string;
  billingEnd: string;

  private user:any;
  isAdmin: boolean;

  trialing: boolean;
  trialEnd: string;

  current_source: any;
  full_name: any;
  sources = [];

  public userCount;
  public vendorCount;

  constructor(public afStor: AngularFireStorage,private app:App,public dealProv: DealsProvider,public af: AngularFireDatabase, public loadingCtrl: LoadingController, public appData: AppDataProvider,private accProv: AccountProvider, public modalCtrl: ModalController, private afauth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams) {
    const uid = this.afauth.auth.currentUser.uid;
    let loading = this.loadingCtrl.create({
      spinner: 'dots'
    });
    loading.setShowBackdrop(false);
    const user = this.afauth.auth.currentUser;

    this.af.object('Users/'+user.uid).valueChanges().subscribe( obj =>{
      this.isAdmin = false;
      this.user = obj;
      let role = this.user.role || "Default";
      if (role == "admin"){ //if admin, show different page
        this.isAdmin = true;
        this.appData.getUserCount().subscribe(count=>{
          this.userCount = count;
        });
        this.appData.getVendorCount().subscribe(count=>{
          this.vendorCount = count;
        });
      }
    });
    
    this.accProv.getName(uid).first().subscribe(data=>{
      if (data.payload.val()==null){
        this.full_name = null;
      }else{
        this.full_name = data.payload.val();
      }
    });
  }

  ionViewDidLoad() {
  }

  signout(){
    this.af.database.goOffline();
    this.afauth.auth.signOut().then(val =>{
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.app.getRootNav().setRoot(HomePage);
    });
  }

  //The following was used as a hacky script to reduce image sizes of current images in the db
  //Now images shoudld be uploaded at lower rez but for future reference the commented
  // code may be used/modified to reduce images
  // shrinkify(){
  //   var dealsarr: string[] = []
  //   this.dealProv.getDeals().subscribe(deals =>{
  //     deals.forEach(dealSnap => {
  //       const tempDeal = new DealModel().fromSnapshot(dealSnap);
  //       if (dealsarr.indexOf(tempDeal.key) == -1){
  //         dealsarr.push(tempDeal.key);
  //         var photo = tempDeal.photo;
  //         var re = /firebasestorage/gi;
  //         var ree = new RegExp(tempDeal.vendor_id,'gi')
  //         if (photo.search(re)!= -1){
  //           if (photo.search(ree)!= -1){
  //             var refLoc = photo.split('/o/')[1].split('?')[0].replace(new RegExp("%2F",'gi'),"/").replace(new RegExp("%20",'gi')," ");
  //             var HTTPREF = this.afStor.storage.ref(refLoc);
  //             var Tempthis = this;

  //             HTTPREF.getDownloadURL().then(function(url) {
  //               var xhr = new XMLHttpRequest();
  //               xhr.responseType = 'blob';
  //               xhr.onload = function(event) {
  //                 var blob = xhr.response;
  //                 var image = new Image();
  //                 image.src = URL.createObjectURL(blob);
  //                 document.getElementById("myphoto").appendChild(image);
  //                 image.onload = function () { 
  //                   var MAX_HEIGHT = 800
  //                   var height = image.naturalHeight;
  //                   var width = image.naturalWidth;
  //                   var canvas = document.createElement("canvas");
  //                   var ctx = canvas.getContext("2d");
  //                   ctx.drawImage(image, 0, 0);
  //                   if (height > 800) {
  //                     //resize to 800pixels hight, keep aspect
  //                     width *= MAX_HEIGHT / height;
  //                     height = MAX_HEIGHT;
  //                     console.log(tempDeal.key + ' image resized: H-'+height+" W-"+width);

  //                   }else{
  //                     console.log(tempDeal.key + ' image size retained: H-'+height+" W-"+width);
  //                   }
  //                   canvas.width = width;
  //                   canvas.height = height;
  //                   ctx.drawImage(image, 0, 0, width, height);

  //                   canvas.toBlob((blob)=>{
  //                     const task = Tempthis.afStor.ref(refLoc).put(blob);
  //                     task.snapshotChanges().pipe(
  //                       finalize(() => {
  //                         // tempThis.downloadURL = tempThis.ref.getDownloadURL()
  //                         Tempthis.afStor.ref(refLoc).getDownloadURL().subscribe(url => {
  //                           tempDeal.photo = url;
  //                           Tempthis.dealProv.updateDeal(tempDeal);      
  //                         });
  //                       })
  //                     ).subscribe()
  //                   }, 'image/jpeg', 0.95);
  //                 }
  //               };
  //               xhr.open('GET', url);
  //               xhr.send();
  //             });
  //           }else{
  //             console.log(tempDeal.key + ": Firebase stock image")
  //           }
  //         }else{
  //           console.log(tempDeal.key + ": " + tempDeal.photo);
  //         }
  //       }
  //     });
  //   });//.unsubscribe();
  // }
}
