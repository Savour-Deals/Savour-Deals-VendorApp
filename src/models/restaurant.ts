export interface restaurant {
    key?: string;
    Name: string;
    Photo: string;
    Address: string;
    Description: string;
    Phone: string;
    Loyalty: {
        code: string;
        count: number;
        deal: string;
        points: {
            Mon: number;
            Tues: number;
            Wed: number;
            Thurs: number;
            Fri: number;
            Sat: number;
            Sun : number;
        }
    }
}