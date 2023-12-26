import { HostingObject } from "./HostingObject";
import { Reservation } from "./Reservation";

export class myEvent{
    public id: number;
    public eventName: string;
    public eventDescription: string;
    public eventDate:string;
    public hostingObject: HostingObject;
    public reservations: Reservation[];
    public eventPicture: string;
    
    constructor(id: number, name: string, description: string, date: string, hostingObject:HostingObject, reservations: Reservation[],eventPicture:string) {
        this.id = id;
        this.eventName = name;
        this.eventDescription = description;
        this.eventDate = date;
        this.hostingObject = hostingObject;
        this.reservations = reservations;
        this.eventPicture=eventPicture;
    }   
    


}