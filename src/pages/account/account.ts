import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { StripeJsPage } from '../stripe-js/stripe-js';
import { AccountProvider } from '../../providers/account/account';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireFunctions } from 'angularfire2/functions';
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  cust_id: any;
  current_source: any;
  full_name: any;
  sources=[];

  constructor(public af: AngularFireDatabase, private afFunc: AngularFireFunctions, public modalCtrl: ModalController, private afauth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams, private accProv: AccountProvider) {
    const uid = this.afauth.auth.currentUser.uid;
    this.accProv.getStripeCustomerID(uid).first().subscribe(cust_id=>{
      if (cust_id.payload.val()==null){
        this.cust_id = null;
      }else{
        this.cust_id = cust_id.payload.val();
        var getCustomerStripe = this.afFunc.httpsCallable('getCustomerStripe');
        getCustomerStripe({"cust_id":this.cust_id}).toPromise().then(result => {
          result.customer.sources.data.forEach(source => {
            this.sources.push(source);
          });
          this.current_source = result.customer.default_source;
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
      this.navCtrl.setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.navCtrl.setRoot(HomePage);
    });
  }

  gotoPage(idx){
    switch(idx){
      case (1): 
        let  stripeModal = this.modalCtrl.create(StripeJsPage,{}, { cssClass: 'my-modal-inner my-stretch '});
        stripeModal.onDidDismiss(data => {
          if (data.newSource){
            this.current_source = data.newSource.id;
            this.sources.push(data.newSource); 
          }
          if (data.subscription){
            
          }
        })
        stripeModal.present();
        break;
      default:
        alert("Could not find selected page. We are working on this!");
      break;
    }
  }

}
