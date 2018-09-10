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

  getVendors(){
    return this.af.list('Vendors').snapshotChanges();
  }

  getVendorsByID(ID: string){
    console.log(ID);
    return this.af.list('Vendors', ref => ref.orderByKey().equalTo(ID)).snapshotChanges();
  }
  getVendorsByPlaceID(ID: string){
    console.log(ID);
    return this.af.list('Vendors', ref => ref.orderByChild('place_id').equalTo(ID)).snapshotChanges();
  }

  editVendorInfo(id,data){
    return this.af.object('Vendors/'+id).update(data);
  }

  removeVendorInfo(id,key){
    return this.af.object('Vendors/'+id+'/'+key).remove()
  }

}
