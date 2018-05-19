import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';
import { Platform } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import * as firebase from 'firebase/app';
import { MainPage } from "../main/main";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {} as User;
  loader: any;

  constructor(private afauth: AngularFireAuth, private fb: Facebook, private platform: Platform, public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present();
    this.afauth.authState.subscribe(res => {
      if (res && res.uid) {
        this.loader.dismiss();
        console.log('user is logged in');
        this.navCtrl.setRoot(MainPage);
      } else {
        this.loader.dismiss();
        console.log('user not logged in');
      }
    });
  }
  
  async login(user: User) {
    try {
      this.presentLoading();
      const result = await this.afauth.auth.signInWithEmailAndPassword("test@test.com","123456");//user.email, user.password);
      if (result){
      }
    } catch (e) {
      console.error(e);
      let alert = this.alertCtrl.create({
        title: 'Login Failed',
        subTitle: 'Login information provided was incorrect. Please try again.',
        buttons: ['Okay']
      });
      alert.present();
    }
  }

  signInWithFacebook() {
    this.presentLoading();
    if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        firebase.auth().signInWithCredential(facebookCredential).then(success=>{
          if (success){
          }
        }).catch((error) => { 
          console.log(error.code);
          let alert = this.alertCtrl.create({
            title: 'Login Failed',
            subTitle: 'Sorry, we could not log you in with Facebook. Please try again.',
            buttons: ['Okay']
          });
          alert.present();
        });
      }).catch((error) => { 
      });
    }else {
      this.afauth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then((res) => {
        });
    }
  }

  register() {
    this.navCtrl.push(RegisterPage);
  }

  presentLoading() {
    this.loader = this.loadingCtrl.create({
      content: "Logging In...",
    });
    this.loader.present();
  }
}
