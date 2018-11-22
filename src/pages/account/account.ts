import { PaymentPage } from './../payment/payment';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, LoadingController } from 'ionic-angular';
import { AccountProvider } from '../../providers/account/account';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireFunctions } from 'angularfire2/functions';
import { HomePage } from '../home/home';
import { AngularFireDatabase } from 'angularfire2/database';
import { StripeJsPage } from '../stripe-js/stripe-js';
import * as moment from 'moment';
import { AppDataProvider } from '../../providers/app-data/app-data';

@IonicPage()
@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
})
export class AccountPage {
  cust_id: any;
  active: any;

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

  constructor(private app:App,public af: AngularFireDatabase, public loadingCtrl: LoadingController, public appData: AppDataProvider,private accProv: AccountProvider, public modalCtrl: ModalController, private afauth: AngularFireAuth, public navCtrl: NavController, public navParams: NavParams,  private afFunc: AngularFireFunctions) {
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
      }else{
        loading.present();
        this.accProv.getStripeCustomerID(uid).first().subscribe(cust_id=>{
          if (cust_id.payload.val()==null){
            this.cust_id = null;
            this.setInvoiceData();
            this.customerLoaded = true;
            loading.dismiss();
          }else{
            const id = cust_id.payload.val();
            var getCustomerStripe = this.afFunc.httpsCallable('getCustomerStripe');
            getCustomerStripe({"cust_id":id}).toPromise().then(result => {
              if (result.customer.deleted){
                //customer was deleted. Act as if not there. Webhook should remove data from firebase
                this.cust_id = null;
                this.customerLoaded = true;
              }else{
                this.cust_id = cust_id.payload.val();
                result.customer.sources.data.forEach(source => {
                  this.sources.push(source);
                  if (source.id === result.customer.default_source){
                    this.current_source = source;
                  }
                },error => {
                  alert(error.message);
                });
                this.customerLoaded = true;
              }
            }).then(()=>{
              this.setInvoiceData();
              loading.dismiss();
            });
          }
        })
        this.accProv.getStripeSubscriptionID(uid).first().subscribe(data=>{
          if (data.payload.val()==null){
            this.sub_id = null;
          }else{
            this.sub_id = data.payload.val();
          }
        });
        this.accProv.getStripeActive(uid).first().subscribe(data=>{
          if (data.payload.val()==null){
            this.active = null;
          }else{
            this.active = data.payload.val();
          }
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

  gotoPage(idx){
    const modalOptions = {
      enableBackdropDismiss: false,
      cssClass: 'my-modal-inner my-stretch '
    }
    switch(idx){
      case (1): 
      //Stripe account and cards already exist. 
        let  paymentModal = this.modalCtrl.create(PaymentPage,{
          current_source: this.current_source,
          sources: this.sources,
          cust_id: this.cust_id,
        }, modalOptions);
        paymentModal.onDidDismiss(data => {
          if (data.current_source){
            this.current_source = data.current_source;
          }
        });
        paymentModal.present();
        break;
      case (2):
      //No stripe account has been made, prompt for payment info 
        let  stripeModal = this.modalCtrl.create(StripeJsPage,{page:"account"}, modalOptions);
        stripeModal.onDidDismiss(data => {
          if (data.current_source){
            this.current_source = data.current_source;
            this.sources.push(this.current_source);
            const uid = this.afauth.auth.currentUser.uid;
            this.accProv.getStripeCustomerID(uid).first().subscribe(cust_id=>{
              if (cust_id.payload.val()==null){
                this.cust_id = null;
              }else{
                this.cust_id = cust_id.payload.val();
                this.setInvoiceData();
              }
            });
            this.accProv.getStripeSubscriptionID(uid).first().subscribe(sub_id=>{
              if (sub_id.payload.val()==null){
                this.sub_id = null;
              }else{
                this.sub_id = sub_id.payload.val();
              }
            })
          }
          if (data.subscription){
            this.sub_id = data.subscription.id;
          }
        });
        stripeModal.present();
        break;
      default:
        alert("Could not find selected page. We are working on this!");
      break;
    }
  }

  updateSubscription(){
    var loader = this.loadingCtrl.create({});
    var updateStripeSubscription = this.afFunc.httpsCallable('updateStripeSubscription');
    if (this.sub_id){
      loader.setContent("Canceling subscription. Please wait.");
      loader.present();
      updateStripeSubscription({"sub_id":this.sub_id, cust_id: this.cust_id}).toPromise().then(result => {
        this.sub_id = null;
        this.setInvoiceData();
        setTimeout(() => {
          loader.dismiss();
        },2000);
      },error => {
        alert(error.message);
        loader.dismiss();
      });
    }else{
      loader.setContent("Subscribing. Please wait.");
      loader.present();
      updateStripeSubscription({cust_id: this.cust_id}).toPromise().then(result => {
        this.sub_id = result.sub_id;
        this.setInvoiceData();
        setTimeout(() => {
          loader.dismiss();
        },2000);
      },error => {
        alert(error.message);
        loader.dismiss();
      });
    }
  }

  setInvoiceData(){
    if (this.cust_id){
      var getInvoiceStripe = this.afFunc.httpsCallable('getInvoiceStripe');
      getInvoiceStripe({"cust_id":this.cust_id}).toPromise().then(result => {
        this.curr_invoice = result.invoice;
        this.curr_invoice.amount_due = this.curr_invoice.amount_due;
        this.planData = this.curr_invoice.lines.data[0];
        if (this.curr_invoice.discount){
          this.trialing = true;
          this.trialEnd = moment.unix(this.curr_invoice.discount.end).format('MMM Do');
        }
        if (this.trialing){
        }
        this.billingStart = moment.unix(this.curr_invoice.period_start).format('MMM Do');
        this.billingEnd = moment.unix(this.curr_invoice.period_end).format('MMM Do');
      });
    }else{
      this.curr_invoice = null;
      this.planData = null;
      this.billingStart = null;
      this.billingEnd = null;
    }
  }
}
