import { DealsProvider } from './../deals/deals';
import { VendorsProvider } from './../vendors/vendors';
import {Injectable} from '@angular/core';
import {AngularFireDatabase, AngularFireList} from 'angularfire2/database';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import {Redemption} from '../../models/redemption';
import 'rxjs/add/operator/map'
import { tap, take } from 'rxjs/operators';
import { AccountProvider } from '../account/account';
import { VendorModel } from '../../models/vendor';
import { DealModel } from '../../models/deal';

@Injectable () 
export class RedemptionProvider {
	private _redemptions$ = new BehaviorSubject <Redemption[]>([]);  
	limit = 8; //How many we show at a time 
	lastKey = 0; 
	finished = false; // have we hit the bottom?

	constructor ( 
		private db: AngularFireDatabase, public ap: AccountProvider, public vp: VendorsProvider, public dp: DealsProvider
	) {
		// initial call to fetch data in firebase       
		this.nextPage() 
			.pipe (take(1)) 
			.subscribe(); 
	}

	getRedemptions$(): Observable <Redemption[]>{
		return this._redemptions$.asObservable();
	}

	private getRedemptions(limit: number, lastKey: number):Observable<Redemption[]>{
		return this.mapListKeys<Redemption>(
			this.db.list <Redemption>('/Redemptions', ref => {//grab our redemption node
				const query = ref 	//setup our query 
					.orderByChild ('timestamp') 
					.limitToFirst (limit);
				return (this.lastKey)  
					? query.startAt (this.lastKey) 
					: query; 
			}) 
		);
	}

	mapListKeys<T>(list: AngularFireList<T>): Observable<T[]> { 
		return list 
			.snapshotChanges() 
			.map(actions => 
				actions.map(action => 
					({key: action.key, ...action.payload.val()}) 
				) 
			); 
	}

	nextPage():Observable<Redemption[]>{
		if (this.finished){
			return this._redemptions$;
		}
		return this.getRedemptions(this.limit+1, this.lastKey)
			.pipe(
				tap(redemptions => {
					this.lastKey = redemptions[redemptions.length-1]['timestamp'];
					const newRedemptions = redemptions.slice(0,this.limit);
					const currentRedemptions = this._redemptions$.getValue();
					redemptions.forEach(redemption => {
						redemption.description = redemption.description.charAt(0).toUpperCase() + redemption.description.slice(1);;

						this.ap.getName(redemption.user_id).first().subscribe(data =>{
							if(data.payload.val()==null){
								redemption.username = "A user";
							}else{ //get username and capitolize first letter
								var temp = data.payload.val() as String;
								temp = temp.charAt(0).toUpperCase() + temp.slice(1);
								redemption.username = temp;
							}
						});
						if (redemption.type === "loyalty"){
							this.vp.getVendorsByID(redemption.vendor_id).subscribe(locs =>{
								//get the location name. should just be one
								locs.forEach(loc => {
									redemption.vendor = loc.payload.val() as VendorModel;
								});
							});
						}else if (redemption.type === 'deal'){
							this.dp.getDealByKey(redemption.deal_id).subscribe(deals =>{
								//get the location name. should just be one
								deals.forEach(deal => {
									redemption.deal = deal.payload.val() as DealModel;
								});
							});
						}
					});
					if (this.lastKey == newRedemptions[newRedemptions.length-1]['timestamp']){
						this.finished = true;
					}
					this._redemptions$.next(currentRedemptions.concat(newRedemptions));
				})
			)
	}
}

