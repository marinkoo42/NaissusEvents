import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, of, tap } from "rxjs";

import { KorisnikService } from "src/app/services/korisnik.service";
import * as KorisnikActions from './korisnik.actions';
import * as HostingObjectActions from 'src/app/store/hostingObject/hostingObject.actions'


@Injectable()
export class KorisnikEffect {
    constructor(private _korisnikService: KorisnikService, private actions$: Actions ,private router : Router) {}



    dbmsAddEffect$ = createEffect(() =>
    this.actions$.pipe(
        ofType(KorisnikActions.registrovanjeNovogKorisnika),
        mergeMap((korisnik) => this._korisnikService.dodajKorisnika(korisnik.noviKorisnik).pipe(
            map(() => (KorisnikActions.ucitavanjeKorisnika())), //regstrovanje success
            catchError(() => of({type: "load error"}))
            )
        )
    )
    );
    dbmsDeleteEffect$ = createEffect(() => 
    this.actions$.pipe(
        ofType(KorisnikActions.brisiKorisnika),
        mergeMap((korisnik) => this._korisnikService.obrisiKorisnika(korisnik.korisnikId).pipe(
            map(() => (KorisnikActions.uspesnoBrisanjeKorisnika())),
            catchError(() => of({type: "load error"}))
            )
        )
    )
    );

    dbmsloadEffect$ = createEffect(() => 
    this.actions$.pipe(
        ofType(KorisnikActions.ucitavanjeKorisnika, KorisnikActions.dodavanjeModeratoraSuccess, HostingObjectActions.removeModeratorSuccess),// KorisnikActions.izmenjenKorisnikSuccess,
        mergeMap(() => this._korisnikService.getAll().pipe(
            map((korisnici) => (KorisnikActions.uspesnoUcitavanjeKorisnika({korisnici}))),
            catchError(() => of({type: "load error"}))
            )
        )
    )
    );    

    dbmsLogovanjeKorisnika$ = createEffect(() => 
    this.actions$.pipe(
        ofType(KorisnikActions.logovanjeKorisnika),
        mergeMap((params) => this._korisnikService.korisnikLogin(params.userName, params.password).pipe(
            map((token) => (KorisnikActions.uspesnoLogovanje({token}))),
            catchError((errResponse) => { console.log(errResponse);  return of(); })
            )
        )
        ));
    



    

    dmbsChangeUserObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(KorisnikActions.izmeniKorisnika),
            mergeMap((objekat) => this._korisnikService.izmeniKorisnika(objekat.korisnik).pipe(
                map((korisnik) => (KorisnikActions.izmeniKorisnikaSuccess({ korisnik: korisnik }))),
                catchError(() => of({ type: "load error" }))
            ))

        )
    )

    dmbsChangeLogedInUserObjects$ = createEffect(() =>
        this.actions$.pipe(
            ofType(KorisnikActions.izmeniUlogovanogKorisnika),
            mergeMap((objekat) => this._korisnikService.izmeniKorisnika(objekat.korisnik).pipe(
                map((korisnik) => (KorisnikActions.izmeniUlogovanogKorisnikaSuccess({ korisnik: korisnik }))),
                catchError(() => of({ type: "load error" }))
            ))

        )
    )

    dbmsDodajModeratora$ = createEffect(() =>
    this.actions$.pipe(
        ofType(KorisnikActions.dodajModeratora),
        mergeMap((objekat) => this._korisnikService.dodajModeratora(objekat.idKorisnika,objekat.idHostingObject).pipe(
            map(() => (KorisnikActions.dodavanjeModeratoraSuccess())),
            catchError(() => of({ type: "load error" }))
        ))

    )
)





}