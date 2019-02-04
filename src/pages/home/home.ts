import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';

import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { RootTabPage } from '../root-tab/root-tab';
import { environment as ENV } from '../../environments/environment';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {} as User;
  loader: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  version = ENV.app_version;
  

  constructor(private afauth: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public af: AngularFireDatabase) {
    this.loader = this.loadingCtrl.create({});
    this.loader.present();

    this.afauth.authState.subscribe(res => {
      this.loader.dismiss();
      if (res && res.uid) {
        console.log('user is logged in');
        this.navCtrl.setRoot(RootTabPage);
      } else {
        console.log('user not logged in');
      }
    });
  }


  
  async login(user: User) {
    try {
      this.presentLoading();
      const result = await this.afauth.auth.signInWithEmailAndPassword(user.email, user.password);
      if (result){

      }
    } catch (e) {
      console.error(e);
      let alert = this.alertCtrl.create({
        title: 'Login Failed',
        subTitle: 'Login information provided was incorrect. Please try again.',
        buttons: ['Okay']
      });
      this.loader.dismiss();
      alert.present();
    }

  }

  signInWithFacebook() {
    this.presentLoading();
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    this.afauth.auth.signInWithRedirect(provider);
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

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'eye-off' ? 'eye' : 'eye-off';
  }
}
