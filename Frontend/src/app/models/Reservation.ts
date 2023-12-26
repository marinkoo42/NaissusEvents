import { myEvent } from "./myEvent";
import { User } from "./User";
import { Table } from "./Table";

export class Reservation{

    id: number;
    event: myEvent;
    table: Table;
    myUser: User;

    constructor(id: number, eventId: myEvent, tableId: Table, userId: User) {
        this.id = id;
        this.event = eventId;
        this.table = tableId;
        this.myUser = userId;
    }


}