import { HostingObject } from "./HostingObject";

export class PicturesData {
    id: number;
    pictures: string;
    hostingObject: HostingObject;

    constructor(id: number, url: string, hostingObjectId: HostingObject) {
        this.id = id;
        this.pictures = url;
        this.hostingObject = hostingObjectId;
    }
}