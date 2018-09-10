import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var Stripe;

@IonicPage()
@Component({
  selector: 'page-stripe-js',
  templateUrl: 'stripe-js.html',
})
export class StripeJsPage {

  stripe = Stripe('pk_test_MTFwtUt1ZtK46XEoHemLdqVo');
  card: any;
  email: any;

  emailClass = "StripeElement"
  nameClass =  "StripeElement"
  
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.setupStripe();
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
 
      // this.stripe.createToken(this.card)
      this.stripe.createSource(this.card).then(result => {
        var form = document.getElementById('payment-form');
        var email = form.elements.namedItem("email").value;
        var name = form.elements.namedItem("name").value;
        var src_id = result.source.id

        if(name!=""){
          this.nameClass = ""
        }else{
          this.nameClass = "StripeElement--invalid"
        }

        if(email!=""){
          this.emailClass = ""
        }else{
          this.emailClass = "StripeElement--invalid"
        }

        if (result.error) {
          var errorElement = document.getElementById('card-errors');
          errorElement.textContent = result.error.message;
        } else {
          // Send the token to your server.
          if (email && name){
            this.stripeTokenHandler(email, name, src_id);
          }
        }
      });
    });
  }

  stripeTokenHandler(email, name, id) {

      var data = {"email":email,"name":name,"id":id};
  }

}

