import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of } from "rxjs";
import { HostingObjectService } from "src/app/services/hosting-object.service";
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions'
import * as KorisnikActions from 'src/app/store/korisnik/korisnik.actions'




@Injectable()
export class HostingObjectEffect {

    constructor(private actions$: Actions, private hostingObjectService: HostingObjectService) {

    }

    loadHostingObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.ucitajObjekte, HostingObjectActions.izmeniObjekatSuccess, KorisnikActions.dodavanjeModeratoraSuccess, HostingObjectActions.removeModeratorSuccess, HostingObjectActions.obrisiObjekatSuccess),
            mergeMap(() => this.hostingObjectService.getAll().pipe(
                map((objekti) => (HostingObjectActions.loadObjectsSuccess({ objekti }))),
                catchError(() => of({ type: "load error" }))
            ))
        )
    )

    changeHostingObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.izmeniObjekat),
            mergeMap((objekat) => this.hostingObjectService.izmeniObjekat(objekat.hostingObject).pipe(
                map(() => (HostingObjectActions.izmeniObjekatSuccess())),
                catchError(() => of({ type: "load error" }))
            ))

        )
    )

    createHostingObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.DodajObjekat),
            mergeMap((objekat) => this.hostingObjectService.dodajObjekat(objekat.hostingObject).pipe(
                map((hostingObject) => (HostingObjectActions.DodavanjeObjekataSuccess({ hostingObject }))),
                catchError(() => of({ type: "load error" }))
            ))
    
        ));

    removeModeratorofHostingObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.removeModerator),
            mergeMap((objekat) => this.hostingObjectService.removeModerator(objekat.hostingObjectId).pipe(
                map(() => (HostingObjectActions.removeModeratorSuccess()),
                    catchError(() => of({ type: "load error" }))
                ))

            )));
    obrisiObjekat$ = createEffect(() =>
    this.actions$.pipe(
        ofType(HostingObjectActions.obrisiObjekat),
        mergeMap((objekat) => this.hostingObjectService.obrisiObjekat(objekat.hostingObjectId).pipe(
            map(() => (HostingObjectActions.obrisiObjekatSuccess()),
                catchError(() => of({ type: "load error" }))
            ))

        )));

    
    obrisiSto$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.obrisiSto),
            mergeMap((objekat) => this.hostingObjectService.obrisiSto(objekat.tableId).pipe(
                map((ho) => (HostingObjectActions.obrisiStoSuccess({ hostingObjectId: ho })),
                    catchError(() => of({ type: "load error" }))
                ))

            )));

    dodajSto$ = createEffect(() =>
    this.actions$.pipe(
        ofType(HostingObjectActions.dodajSto),
        mergeMap((objekat) => this.hostingObjectService.dodajSto(objekat.table).pipe(
            map(() => (HostingObjectActions.dodajStoSuccess())),
            catchError(() => of({ type: "load error" }))
        ))

        ));
    
    ucitajStoloveModeratora$ = createEffect(() =>
        this.actions$.pipe(
            ofType(HostingObjectActions.ucitajStoloveModeratora, HostingObjectActions.obrisiStoSuccess),
            mergeMap((objekat) => this.hostingObjectService.getTablesOfHostingObject(objekat.hostingObjectId).pipe(
                map((objekti) => (HostingObjectActions.ucitajStoloveModeratoraSuccess({stolovi:objekti}))),
                catchError(() => of({ type: "load error" }))
            ))

        ));




}
