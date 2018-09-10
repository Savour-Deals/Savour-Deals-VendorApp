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
    redeemed = [];

    constructor(deal: any) {
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
        if (dealData.redeemed){
            this.redeemed = Object.keys(dealData.redeemed);
        }
    }
}