export class DealModel {
    key: string;
    StartTime: number;
    EndTime: number;
    rID: string;
    photo: string;
    rName: string;
    dealDesc: string;
    activeDays: {
        Mon: boolean;
        Tues: boolean;
        Wed: boolean;
        Thurs: boolean;
        Fri: boolean;
        Sat: boolean;
        Sun : boolean;
    }
    redeemed = [];

    constructor(deal: any) {
        this.key = deal.key;
        const dealData = (deal.payload.val() as any);
        this.StartTime = dealData.StartTime;
        this.EndTime = dealData.EndTime;
        this.rID = dealData.rID;
        this.photo = dealData.photo;
        this.rName = dealData.rName;
        this.dealDesc = dealData.dealDesc;
        this.activeDays = {
            Mon: dealData.activeDays.Mon,
            Tues: dealData.activeDays.Tues,
            Wed: dealData.activeDays.Wed,
            Thurs: dealData.activeDays.Thurs,
            Fri: dealData.activeDays.Fri,
            Sat: dealData.activeDays.Sat,
            Sun: dealData.activeDays.Sun
        }
        if (dealData.redeemed){
            this.redeemed = Object.keys(dealData.redeemed);
        }
    }
}