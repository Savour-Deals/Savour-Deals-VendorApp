export class DealModel {
    key: string;
    start_time: number;
    end_time: number;
    vendor_id: string;
    photo: string;
    vendor_name: string;
    deal_description: string;
    active_days: {
        mon: boolean;
        tues: boolean;
        wed: boolean;
        thur: boolean;
        fri: boolean;
        sat: boolean;
        sun : boolean;
    }
    redeemed: any;

    constructor(){
        this.start_time = 0;
        this.end_time = 0;
        this.vendor_id = '';
        this.photo = '';
        this.vendor_name = '';
        this.deal_description = '';
        this.active_days = { mon: false, tues: false, wed: false, thur: false, fri: false, sat: false, sun : false };
    }

    fromDeal(deal: DealModel){
        this.start_time = deal.start_time;
        this.end_time = deal.end_time;
        this.vendor_id = deal.vendor_id
        this.photo = deal.photo
        this.vendor_name = deal.vendor_name
        this.deal_description = deal.deal_description
        this.active_days = deal.active_days;
        this.redeemed = deal.redeemed;
    }

    fromSnapshot(deal: any) {
        this.key = deal.key;
        const dealData = (deal.payload.val() as any);
        this.start_time = dealData.start_time;
        this.end_time = dealData.end_time;
        this.vendor_id = dealData.vendor_id;
        this.photo = dealData.photo;
        this.vendor_name = dealData.vendor_name;
        this.deal_description = dealData.deal_description;
        this.active_days = {
            mon: dealData.active_days.mon,
            tues: dealData.active_days.tues,
            wed: dealData.active_days.wed,
            thur: dealData.active_days.thurs,
            fri: dealData.active_days.fri,
            sat: dealData.active_days.sat,
            sun: dealData.active_days.sun
        }
        this.redeemed = dealData.redeemed;
        return this;
    }
}