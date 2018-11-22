import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AccountProvider {

  constructor(public http: HttpClient, private af: AngularFireDatabase) {
  
  }

  getStripeCustomerID(ID: string){
    return this.af.object('Users/'+ID+'/stripe/customer_id').snapshotChanges();
  }

  getStripeActive(ID: string){
    return this.af.object('Users/'+ID+'/stripe/active').snapshotChanges();
  }

  getStripeSubscriptionID(ID: string){
    return this.af.object('Users/'+ID+'/stripe/stripe_subscription_id').snapshotChanges();
  }

  getStripeSources(ID: string){
    return this.af.list('Users/'+ID+'/stripe/sources').valueChanges();
  }
  getStripeCurrentSource(ID: string){
    return this.af.object('Users/'+ID+'/stripe/current_source').snapshotChanges();
  }

  getName(ID: string){
    return this.af.object('Users/'+ID+'/full_name').snapshotChanges();
  }

  getRole(ID: string){
    return this.af.object('Users/'+ID+'/role').snapshotChanges();
  }

  getUser(ID: string){
    return this.af.list('Users/'+ID).snapshotChanges();
  }

}
