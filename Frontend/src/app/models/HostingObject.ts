
import { Table } from "./Table";
import { User } from "./User";

export class HostingObject
{
    public id: number;
    public name: string; 
    public adress: string; 
    public hours: string;
    public reviewStars: number;
    public phone: string;
    public mapX: number;
    public mapY: number;
    public thumbnailPicture: string;
    public tables: Table[];
    public moderator: User | null;


    constructor(Id: number, Name: string, Adress: string, Hours: string, thumbnailPicture: string ,ReviewStars: number, Phone: string, MapX: number, MapY: number, Tables :Table[], moderator : User | null)
    {
        this.id = Id;
        this.name = Name;
        this.adress = Adress;
        this.hours = Hours;
        this.reviewStars = ReviewStars;
        this.phone = Phone;
        this.mapX = MapX;
        this.mapY = MapY;
        this.tables = Tables;
        this.thumbnailPicture = thumbnailPicture;
        this.moderator = moderator;
    }
}