import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
import { EmailComposer } from '@ionic-native/email-composer';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  constructor(private emailComposer: EmailComposer,private iab: InAppBrowser, public navCtrl: NavController, public navParams: NavParams) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  sendEmail(){
    this.emailComposer.isAvailable().then((available: boolean) =>{
      if(available) {
        //Now we know we can send
      }
     });
     
     let email = {
       to: 'info@savourdeals.com',
       cc: 'christopher.patterson@savourdeals.com',
       subject: 'Savour Vendor Signup',
       body: 'Company Name: <br>Company Address <br>Number Locations: <br>Company Type: {Bar, Restaurant,Coffee Shop} <br>Manager/Owner Name: <br>Manager/Owner Email: <br>Manager/Owner Phone Number: <br> Best Way to Contact: ',
       isHtml: true
     };
     // Send a text message using default options
     this.emailComposer.open(email);
  }

  viewPage(){
    const options: InAppBrowserOptions = {
      zoom: 'no',
      hardwareback: 'yes',
      location: 'yes'
    }
    // Opening a URL and returning an InAppBrowserObject
    const browser = this.iab.create('http://savourdeals.com/index.php/vendors/', '_self', options);
  }

}
