import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides,Navbar, AlertController  } from 'ionic-angular';

/**
 * Generated class for the CreatedealPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-createdeal',
  templateUrl: 'createdeal.html',
})
export class CreatedealPage {
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Navbar) navbar: Navbar;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.slides.lockSwipes(true);
    this.navbar.backButtonClick = () => {
      let alert = this.alertCtrl.create({
        title: 'Notice',
        subTitle: 'Deal not yet created. Leaving now will delete any progress.',
        buttons: [{
          text: 'Leave',
          role: 'destructive',
          handler: () => {
            this.navCtrl.pop();
          }
        },{
          text: 'Stay'
        }
      ]
      });
      alert.present();
    }
  }

  prevClick(){
    this.slides.lockSwipes(false);
    this.slides.slidePrev();
    this.slides.lockSwipes(true);
  }

  nextClick(){
    this.slides.lockSwipes(false);
    this.slides.slideNext();
    this.slides.lockSwipes(true);
  }

}
