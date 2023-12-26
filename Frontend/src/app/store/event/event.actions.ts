import { createAction, props } from "@ngrx/store";
import { myEvent } from "src/app/models/myEvent";
import { Reservation } from "src/app/models/Reservation";
import { Table, tableType } from "src/app/models/Table";


export const selectEvent = createAction(
    "Selektovan event",
    props<{
        eventId: number
    }>()
)

export const ucitajEvente = createAction(
    "Ucitavanje eventa iz baze"
)

export const loadEventsSuccess = createAction(
    "Uspesno ucitavanje eventa iz baze",
    props<{myEvents : myEvent[]}>()
)


export const ucitajStolove = createAction(
    "Ucitavanje stolova iz baze"
)

export const loadTablesSuccess = createAction(
    "Uspesno ucitavanje Stolova iz baze",
    props<{ tables: Table[] }>()
)

export const dodavanjeRezervacije = createAction(
    "Dodavanje nove rezervacije",
    props<{
        eventId: number, userId: string , tableType: tableType , tableCapacity: number
    }>()
)

export const dodavanjeRezervacijeSuccess = createAction(
    "Uspesno dodavanje rezervacije"
)

export const izmeniEvent = createAction(
    "izmeni Event",
    props<{
        event: myEvent
    }>()
)

export const izmeniEventSuccess = createAction(
    "Uspesna izmena eventa"
)


export const brisanjeEventa = createAction(
    "Brisanje eventa",
    props<{
        eventId: number
    }>()
)

export const brisanjeEventaSuccess = createAction(
    "Uspesno brisanje eventa",
    props<{
        eventId: number
    }>()
)

export const dodavanjeEventa = createAction(
    "Dodavanje eventa",
    props<{
        hostingObjectId: number,
        imeDogadjaja:string,
        opisDogadjaja:string;
        datumDogadjaja:string
    }>()
)

export const dodavanjeEventaSuccess = createAction(
    "Uspesno dodavanje eventa",
    props<{
        event: myEvent
    }>()
)


