import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { myEvent } from "src/app/models/myEvent";
import { EventService } from "src/app/services/event.service";
import * as EventActions from './event.actions';
import * as KorisnikActions from './../korisnik/korisnik.actions'



@Injectable()
export class EventEffect{

    constructor(private actions$: Actions, private eventService: EventService)
    {

    }
    
    loadEvents$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EventActions.ucitajEvente, EventActions.izmeniEventSuccess, KorisnikActions.izlogujKorisnika),
            mergeMap(() => this.eventService.getAll().pipe(
                map((myEvents) => (EventActions.loadEventsSuccess({ myEvents }))),
                catchError(() => of({ type: "load error" }))
            ))
            
        ));
    
    changeEvent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EventActions.izmeniEvent),
            mergeMap((objekat) => this.eventService.izmeniEvent(objekat.event).pipe(
                map(() => (EventActions.izmeniEventSuccess())),
                catchError(() => of({ type: "load error" }))
            ))

        ));
    
    addEvent$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EventActions.dodavanjeEventa),
            mergeMap((objekat) => this.eventService.dodajEvent(objekat.hostingObjectId,objekat.imeDogadjaja,objekat.opisDogadjaja,objekat.datumDogadjaja).pipe(
                map((event) => (EventActions.dodavanjeEventaSuccess({ event : event }))),
                catchError(() => of({ type: "load error" }))
            ))

        )
    )
    
   
    
    dbmsAddReservationEffect$ = createEffect(() =>
        this.actions$.pipe(
            ofType(EventActions.dodavanjeRezervacije),
            mergeMap((data) => this.eventService.dodajRezervaciju(data.eventId,data.userId,data.tableType,data.tableCapacity).pipe(
                map(() => (EventActions.dodavanjeRezervacijeSuccess())),
                catchError(() => of({ type: "load error" }))
            )
            )
        )
    );

    obrisiEvent$ = createEffect(() =>
    this.actions$.pipe(
        ofType(EventActions.brisanjeEventa),
        mergeMap((objekat) => this.eventService.obrisiEvent(objekat.eventId).pipe(
            map((id) => (EventActions.brisanjeEventaSuccess({ eventId: id })),
                catchError(() => of({ type: "load error" }))
            ))

        )));
}