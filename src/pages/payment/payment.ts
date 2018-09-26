import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController, LoadingController } from 'ionic-angular';
import { AngularFireFunctions } from 'angularfire2/functions';
import { StripeJsPage } from '../stripe-js/stripe-js';


@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  cust_id: any;
  current_source: any;
  full_name: any;
  sources = [];
  loader: any;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,private viewCtrl: ViewController, public navParams: NavParams, public modalCtrl: ModalController, private afFunc: AngularFireFunctions) {
    this.sources = navParams.get('sources');
    this.current_source = navParams.get('current_source');
    this.cust_id = navParams.get('cust_id');
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
    this.viewCtrl.dismiss({"current_source":this.current_source});
  }

  changeCard(idx){
    this.loader = this.loadingCtrl.create({
      content: "Making requested changes. Please wait.",
    }); 
    if(this.sources[idx]){
      const newSrc = this.sources[idx];
      if (newSrc.id !== this.current_source.id){
        this.loader.present(); 
        var changeStripeSource = this.afFunc.httpsCallable('changeStripeSource');
        changeStripeSource({"cust_id":this.cust_id,"src_id":newSrc.id}).toPromise().then(result => {
          this.loader.dismiss();
          if (result){
            this.current_source = newSrc;
            var resultMessage = result.msg;
            this.dismiss();
            alert(resultMessage);
          }else{
            alert('Unknown error occured.');
          }
        },error => {
          this.loader.dismiss();
          alert(error.message);
        });
      }
    }
  }


  gotoPage(idx){
    const modalOptions = {
      enableBackdropDismiss: false,
      // enterAnimation: 'modal-slide-in',
      // leaveAnimation: 'modal-slide-out',
      cssClass: 'my-modal-inner my-stretch '
    }
    switch(idx){
      case (1): 
        let  stripeModal = this.modalCtrl.create(StripeJsPage,{
          current_source: this.current_source,
          sources: this.sources,
          page:"payment"
        }, modalOptions);
        stripeModal.onDidDismiss(data => {
          if (data.current_source){
            this.current_source = data.current_source;
            this.sources.push(data.current_source); 
          }
          if (data.subscription){
            
          }
        });
        stripeModal.present();
        break;
      default:
        alert("Could not find selected page. We are working on this!");
      break;
    }
  }

}
