import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the VendorsProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class VendorsProvider {
  constructor(public http: HttpClient, private af: AngularFireDatabase) {
  }

  getRestaurants(){
    return this.af.list('Restaurants').snapshotChanges();
  }

  getRestaurantsByID(ID: string){
    console.log(ID);
    return this.af.list('Restaurants', ref => ref.orderByChild('vendorID').equalTo(ID)).snapshotChanges();
  }
  getRestaurantByName(ID: string){
    console.log(ID);
    return this.af.list('Restaurants', ref => ref.orderByChild('placeID').equalTo(ID)).snapshotChanges();
  }

}
