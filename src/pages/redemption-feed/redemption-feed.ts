import { RedemptionProvider } from './../../providers/redemptions/redemptions';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import {Observable} from 'rxjs/Observable';
import { HomePage } from '../home/home';
import { Redemption } from '../../models/redemption';
import { take } from 'rxjs/operators';

/**
 * Generated class for the RedemptionFeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-redemption-feed',
  templateUrl: 'redemption-feed.html',
})
export class RedemptionFeedPage {

  redemptions : Observable<Redemption[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams, private app:App, private afauth: AngularFireAuth, public af: AngularFireDatabase, public rp: RedemptionProvider) {
  }

  signout(){
    this.af.database.goOffline();
    this.afauth.auth.signOut().then(val =>{
      this.app.getRootNav().setRoot(HomePage);
    }).catch(err => {//TODO: catch specific errors
      this.app.getRootNav().setRoot(HomePage);
    });
  }

  ionViewDidLoad() {
    this.redemptions = this.rp.getRedemptions$();
  }

  infinite (infiniteScroll): Promise <void> {
    if (!this.rp.finished) {
      return new Promise ((resolve, reject) => { 
        this.rp.nextPage () 
            .pipe (take(1)) 
            .subscribe (redemptions => { 
              console.log ('redemptions:', redemptions); 
              resolve(); 
            }); 
      }); 
    } 
    return Promise.resolve (); 
  }

  timeSince(unixTime) {//using unix time in seconds, not ms
    var now = new Date();
    var timeStamp = new Date(unixTime*1000);
		var secondsPast = (now.getTime() - timeStamp.getTime()) / 1000;
		if (secondsPast < 30){
			return 'just now';
		}
		if(secondsPast < 60){
			return secondsPast.toString() + 's';
		}
		if(secondsPast < 3600){
			return (secondsPast/60).toString() + 'm';
		}
		if(secondsPast <= 86400){
			return (secondsPast/3600).toString() + 'h';
		}
		if(secondsPast > 86400){
			let day = timeStamp.getDate();
			let month = timeStamp.toDateString().match(/ [a-zA-Z]*/)[0].replace(" ","");
			let year = timeStamp.getFullYear() == now.getFullYear() ? "" :  " "+timeStamp.getFullYear();
			return day + " " + month + year;
		}
	}
}
