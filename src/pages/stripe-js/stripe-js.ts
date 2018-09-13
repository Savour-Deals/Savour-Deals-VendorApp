import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ViewController } from 'ionic-angular';
import { AngularFireFunctions } from 'angularfire2/functions';
import { AccountProvider } from '../../providers/account/account';
import { AngularFireAuth } from 'angularfire2/auth';


declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-stripe-js',
  templateUrl: 'stripe-js.html',
})
export class StripeJsPage {

  stripe = Stripe('pk_test_MTFwtUt1ZtK46XEoHemLdqVo');
  card: any;
  email: String = "";
  name: String = "";

  loader: any;

  emailClass = "StripeElement"
  nameClass =  "StripeElement"

  private cust_id: any;
  private sub_id: any;
  private source: any;
  
  constructor(public viewCtrl: ViewController,public navCtrl: NavController, private afauth: AngularFireAuth, public loadingCtrl: LoadingController, public navParams: NavParams, private afFunc: AngularFireFunctions, private accProv: AccountProvider) {
    const uid = this.afauth.auth.currentUser.uid;
    this.accProv.getStripeCustomerID(uid).first().subscribe(cust_id=>{
      if (cust_id.payload.val()==null){
        this.cust_id = null;
      }else{
        this.cust_id = cust_id.payload.val();
      }
    });
    this.accProv.getStripeSubscriptionID(uid).first().subscribe(sub_id=>{
      if (sub_id.payload.val()==null){
        this.sub_id = null;
      }else{
        this.sub_id = sub_id.payload.val();
      }
    });
  }

  ionViewDidLoad() {
    //hide tab bar
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(56px)';
      });
    }
  }

  ionViewDidEnter(){
    this.setupStripe();
  }

  ionViewWillLeave() {
    //put tabbar back 
    let tabs = document.querySelectorAll('.tabbar');
    if ( tabs !== null ) {
      Object.keys(tabs).map((key) => {
        tabs[ key ].style.transform = 'translateY(0)';
      });
    }
  }

  dismiss() {
    this.viewCtrl.dismiss({"newSource":this.source});
  }

  setupStripe(){
    let elements = this.stripe.elements();
    var style = {
      base: {
        color: '#32325d',
        lineHeight: '24px',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };
 
    this.card = elements.create('card', { style: style });

 
    this.card.mount('#card-element');
 
    this.card.addEventListener('change', event => {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
 
    var form = document.getElementById('payment-form');
    form.addEventListener('submit', event => {
      event.preventDefault();
 
      this.stripe.createSource(this.card).then(result => {
        if (!result.error){
          var src_id = result.source.id;
          this.source = result.source;
          if (this.cust_id ){
            this.nameClass = (this.name!="") ? "" : "StripeElement--invalid"
    
            if (result.error) {
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              // Send the token to your server.
              if (this.name!=""){
                this.stripeAddNewCard(this.name, src_id);
              }
            }
          }else{
            //Customer does not exist in stripe. create one!
            this.nameClass = (this.name!="") ? "" : "StripeElement--invalid"
            this.emailClass = (this.email!="") ? "" : "StripeElement--invalid"
    
            if (result.error) {
              var errorElement = document.getElementById('card-errors');
              errorElement.textContent = result.error.message;
            } else {
              // Send the token to your server.
              if (this.email!="" && this.name!=""){
                this.stripeCreateAccount(this.email, this.name, src_id);
              }
            }
          }
        }

      });
    });
  }

  stripeCreateAccount(email, name, src_id) {
    this.loader = this.loadingCtrl.create({
      content: "Processing payment method. Please wait.",
    });
    this.loader.present();  
    //No stripe account, have to make one
    var createStripe = this.afFunc.httpsCallable('createStripe');
    createStripe({"email":email,"name":name,"src_id":src_id}).toPromise().then(result => {
      this.loader.dismiss();
      if (result){
        var resultMessage = result.msg;
        this.dismiss();
        alert(resultMessage);
      }else{
        alert('Unknown error occured.');
      }
    },error => {
      alert(error);
    });
  }

  stripeAddNewCard(name,src_id){
    this.loader = this.loadingCtrl.create({
      content: "Processing payment method. Please wait.",
    });
    this.loader.present(); 
    //stripe account already there, just update card info
    var attachCardStripe = this.afFunc.httpsCallable('attachCardStripe');
    attachCardStripe({"cust_id":this.cust_id,"src_id":src_id,"name":name}).toPromise().then(result => {
      this.loader.dismiss();
      if (result){
        var resultMessage = result.msg;
        this.dismiss();
        alert(resultMessage);
      }else{
        alert('Unknown error occured.');
      }
    },error => {
      alert(error);
    });
  }
}

