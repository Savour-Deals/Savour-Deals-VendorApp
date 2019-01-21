import { DealModel } from './deal';
import { VendorModel } from './vendor';
import { Observable } from "rxjs";

export interface Redemption { 
	deal_id: string; 
	deal_photo: string; 
	description: string;
	timestamp: number;
	type : string;
	user_id: string;
	vendor_id: string;
	vendor_photo: string; 
	username: String;
	vendor: VendorModel;
	deal: DealModel;
}