import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { MainPage } from '../main/main';

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  SignupForm: FormGroup;
  loader:any;
  passwordType: string = 'password';
  passwordIcon: string = 'eye-off';

  constructor(public af: AngularFireDatabase,public afauth: AngularFireAuth, public afdb: AngularFireDatabase, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public navCtrl: NavController, public navParams: NavParams, public formBuilder: FormBuilder) {
    this.SignupForm = formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.maxLength(100), Validators.pattern("(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"), Validators.required])],
      password: ['', Validators.compose([Validators.maxLength(30), Validators.minLength(6), Validators.required])],
    });
    this.loader = this.loadingCtrl.create({

    });
    this.afauth.authState.subscribe(res => {
      if (res && res.uid) {
        const userRef = this.af.object('Users/'+res.uid);
        if (res.displayName){
          userRef.update({"FullName":res.displayName})
        }
        if (res.email){
          userRef.update({"Email":res.email})
        }
        this.loader.dismiss();
        console.log('user is logged in');
        this.navCtrl.setRoot(MainPage);
      } else {
        this.loader.dismiss();
        console.log('user not logged in');
      }
    });
  }

  ionViewDidLoad() {

  }

  signup(){
    this.presentLoading();
    if (this.SignupForm.valid){
      this.afauth.auth.createUserWithEmailAndPassword(this.SignupForm.value.email, this.SignupForm.value.password).then( authData => {
        const userRef = this.af.object('Users/'+authData.user.uid);
        userRef.update({"Email":this.SignupForm.value.email,"FullName":this.SignupForm.value.name});
      }, error => {
        this.loader.dismiss().then( () => {
          let alert = this.alertCtrl.create({
            message: error.message,
            buttons: [
              {
                text: "Ok",
                role: 'cancel'
              }
            ]
          });
          alert.present();
        });
      });
    }else{
      let alert = this.alertCtrl.create({
        message: "Some of the information provided was invalid. Please check the info and try again.",
        buttons: [
          {
            text: "Ok",
            role: 'cancel'
          }
        ]
      });
      alert.present();
      this.loader.dismiss();
    }
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
