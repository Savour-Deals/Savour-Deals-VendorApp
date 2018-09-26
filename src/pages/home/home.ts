import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';
import { RegisterPage } from '../register/register';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user';

import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import { RootTabPage } from '../root-tab/root-tab';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user = {} as User;
  loader: any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';
  

  constructor(private afauth: AngularFireAuth, public navCtrl: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public af: AngularFireDatabase) {
    this.loader = this.loadingCtrl.create({

    });
    this.loader.present();
    this.afauth.authState.subscribe(res => {
      if (res && res.uid) {
        this.loader.dismiss();
        console.log('user is logged in');
        this.navCtrl.setRoot(RootTabPage);
      } else {
        this.loader.dismiss();
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
      this.loader.dismiss();
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
    var provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('public_profile');
    firebase.auth().signInWithRedirect(provider);
    firebase.auth().getRedirectResult().then(function(result) {
 
    }).catch(function(error) {

    });
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
