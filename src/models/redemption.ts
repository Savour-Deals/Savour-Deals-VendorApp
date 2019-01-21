import { DealModel } from './deal';
import { VendorModel } from './vendor';

export interface Redemption { 
	deal_id: string; 
	deal_photo: string; 
	description: string;
	timestamp: number;//time is stored as *-1 for firebase indexing
	type : string;
	user_id: string;
	vendor_id: string;
	vendor_photo: string; 
	username: String;
	vendor: VendorModel;
	deal: DealModel;
}