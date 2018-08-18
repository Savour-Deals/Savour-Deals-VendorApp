export interface VendorModel {
    key?: string;
    name: string;
    photo: string;
    address: string;
    description: string;
    phone: string;
    loyalty: {
        code: string;
        count: number;
        deal: string;
        points: {
            mon: number;
            tues: number;
            wed: number;
            thur: number;
            fri: number;
            sat: number;
            sun : number;
        }
    }
}