import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import { DealsProvider } from '../../providers/deals/deals';

import { ViewdealPage } from '../viewdeal/viewdeal';
import { CreatedealPage } from '../createdeal/createdeal';
import * as moment from 'moment';

import { DealModel } from "../../models/deal";



@IonicPage()
@Component({
  selector: 'page-deals',
  templateUrl: 'deals.html',
})
export class DealsPage {
  private ID: string;
  public place: string;
  public activeDeals = [];
  public upcomingDeals = [];
  public expiredDeals = [];
  public showSections: boolean[] = [true,false,false];
  public dealsLoaded: boolean = false;
  public hasGroupNum: boolean[] = [false,false,false];


  constructor(public modalCtrl: ModalController, public navCtrl: NavController, public navParams: NavParams, public dealProv: DealsProvider) {
    this.ID = navParams.get('ID');
    this.place = navParams.get('name');
    var sub = this.dealProv.getDealsByID(this.ID).subscribe(deals =>{
      const now = moment().unix();
      const startOfToday = moment().startOf('day').unix();
      deals.forEach(dealSnap => {
        const tempDeal = new DealModel(dealSnap);
        if (tempDeal.StartTime > now){    //if now is before start time: Upcoming
          this.hasGroupNum[1] = true;
          this.upcomingDeals.push(tempDeal);
        }else if (tempDeal.EndTime < now && tempDeal.EndTime!=startOfToday){ //if now is after end time: expired
          this.hasGroupNum[2] = true;
          this.expiredDeals.push(tempDeal);
        }else{ //if neither of those, deal should be active
          this.hasGroupNum[0] = true;
          this.activeDeals.push(tempDeal);
        }
        this.dealsLoaded = true;
      });
      sub.unsubscribe();
    });
  }

  createDealClicked(){
    let dealModal = this.modalCtrl.create(CreatedealPage, {
      ID: this.ID,
      name: this.place
    }, { cssClass: "my-fullscreen", enableBackdropDismiss : false});
    dealModal.onDidDismiss(data => {
      if (data){
        const tempDeal = data;
        const now = moment().unix();
        const startOfToday = moment().startOf('day').unix();
        if (tempDeal.StartTime > now){    //if now is before start time: Upcoming
          this.hasGroupNum[1] = true;
          this.upcomingDeals.push(tempDeal);
        }else if (tempDeal.EndTime < now && tempDeal.EndTime!=startOfToday){ //if now is after end time: expired
          this.hasGroupNum[2] = true;
          this.expiredDeals.push(tempDeal);
        }else{ //if neither of those, deal should be active
          this.hasGroupNum[0] = true;
          this.activeDeals.push(tempDeal);
        }
        this.dealsLoaded = true;
      }    
    })
    dealModal.present();
  }

  dealClicked(key: string){
    this.navCtrl.push(ViewdealPage, {
      key: key
    });
  }

  accordianClick(index: number){
    this.showSections[index] = !this.showSections[index];
  }

  hasGroup(index: number){
    return this.hasGroupNum[index];
  }

  isGroupShown(index: number){
    return this.showSections[index];
  }
}
