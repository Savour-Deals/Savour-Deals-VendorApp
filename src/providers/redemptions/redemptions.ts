import {Injectable} from '@angular/core';
import {AngularFireDatabase} from 'angularfire2/database';
import {Redemption} from '../../models/redemption';
@Injectable () 
export class RedemptionProvider {
	constructor ( 
		private db: AngularFireDatabase 
	) {}
}