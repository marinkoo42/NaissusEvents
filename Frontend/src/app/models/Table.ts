import { HostingObject } from "./HostingObject";

export class Table{

    id: number;
    tableType: tableType;
    tableCapacity: number;
    hostingObject: HostingObject | null;

    constructor(id: number, type: tableType,capacity:number, hostingObject:HostingObject | null) {
        this.id = id;
        this.tableType = type;
        this.tableCapacity = capacity;
        this.hostingObject = hostingObject;
    }
}

export enum tableType
{
    Barski,
    Separe,
    Niski_sto,
    Sank
}