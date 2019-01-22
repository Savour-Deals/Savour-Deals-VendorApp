import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class DealsProvider {
  constructor(public http: HttpClient, private af: AngularFireDatabase) {
    
  }

  getDeals(){
    return this.af.list('Deals').snapshotChanges();
  }

  getDealsByID(ID: string){
    return this.af.list('Deals', ref => ref.orderByChild('vendor_id').equalTo(ID)).snapshotChanges();
  }
  
  getDealByKey(key: string){
    return this.af.object('Deals/'+key).snapshotChanges();
  }

  createDeal(newDeal: any){
    const dealsRef = this.af.list('Deals');
    newDeal.key = null; //clear out the key since we dont store that on the DB
    newDeal.redeemed = null;
    const newDealRef = dealsRef.push(newDeal);
    return newDealRef.key;
  }

  updateDeal(newDeal: any){
    const dealsRef = this.af.object('Deals/'+newDeal.key);
    newDeal.key = null; //clear out the key since we dont store that on the DB
    dealsRef.update(newDeal);
  }
}
