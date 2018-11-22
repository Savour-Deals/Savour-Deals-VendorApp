import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';

/*
  Generated class for the AppDataProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class AppDataProvider {

  constructor(public http: HttpClient, private af: AngularFireDatabase) {
    
  }

  getItemImages(){
    return this.af.list('appData/PreselectImgs').valueChanges();
  }
  getUserCount(){
    return this.af.object('appData/user_count').valueChanges();
  }
  getVendorCount(){
    return this.af.object('appData/vendor_count').valueChanges();
  }

}
