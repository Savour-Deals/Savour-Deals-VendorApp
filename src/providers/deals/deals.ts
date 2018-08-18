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
    console.log(ID);
    return this.af.list('Deals', ref => ref.orderByChild('r_id').equalTo(ID)).snapshotChanges();
  }
  
  getDealByKey(key: string){
    console.log(key);
    return this.af.list('Deals', ref => ref.orderByKey().equalTo(key)).snapshotChanges();
  }

  createDeal(newDeal: any){
    const dealsRef = this.af.list('Deals');
    const newDealRef = dealsRef.push(newDeal);
    return newDealRef.key;
  }
}
