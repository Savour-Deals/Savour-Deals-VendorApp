import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DealsProvider } from '../../providers/deals/deals';
import * as moment from 'moment';
import { CreatedealPage } from '../createdeal/createdeal';
import { DealModel } from '../../models/deal';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-viewdeal',
  templateUrl: 'viewdeal.html',
})
export class ViewdealPage {
  private key: string;
  public deal: DealModel;
  public redeemedCount: number;
  public activeDays: any[];
  public start: string;
  public end: string;
  public times: string;
  public admin = false;

  constructor(private afauth: AngularFireAuth,public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, private dealProv: DealsProvider, public af: AngularFireDatabase) {
    this.key = navParams.get('key');
    this.dealProv.getDealByKey(this.key).subscribe(snap => {
      this.deal = new DealModel().fromSnapshot(snap);
      this.start = moment.unix(this.deal.start_time).format('MMMM Do YYYY');
      this.end = moment.unix(this.deal.end_time).format('MMMM Do YYYY');
      this.times = moment.unix(this.deal.start_time).format("h:mm a") + " - " + moment.unix(this.deal.end_time).format("h:mm a");
      if (this.times == "12:00 am - 12:00 am"){
        this.times = "All Day"
      }
      if (this.deal.redeemed != null){
        this.redeemedCount = Object.keys(this.deal.redeemed).length;
      }else{
        this.redeemedCount = 0;
      }
    });
    const user = this.afauth.auth.currentUser;
    this.af.object('Users/'+user.uid).valueChanges().subscribe( obj =>{//check if we are admin
      const user = obj as any;
      let role = user.role || "Default";
      if (role == "admin"){
        this.admin = true;
      }
    });
  }

  editDealClicked(){
    let dealModal = this.modalCtrl.create(CreatedealPage, {
      deal: this.deal,
    }, { cssClass: "my-fullscreen", enableBackdropDismiss : false});
    dealModal.onDidDismiss(data => {
  
    })
    dealModal.present();
  }
}
