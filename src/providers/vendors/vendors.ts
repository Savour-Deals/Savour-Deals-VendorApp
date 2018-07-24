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
    return this.af.list('Restaurants', ref => ref.orderByKey().equalTo(ID)).snapshotChanges();
  }
  getRestaurantByPlaceID(ID: string){
    console.log(ID);
    return this.af.list('Restaurants', ref => ref.orderByChild('placeID').equalTo(ID)).snapshotChanges();
  }

  editVendorInfo(id,data){
    this.af.object('Restaurants/'+id).update(data);
  }

}
