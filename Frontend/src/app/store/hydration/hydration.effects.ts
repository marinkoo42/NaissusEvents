import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType, OnInitEffects } from "@ngrx/effects";
import { Action, Store } from "@ngrx/store";
import { AppState } from "../app-state";
import * as HydrationActions from './hydration.actions';
import * as KorisnikActions from './../korisnik/korisnik.actions'
import { distinctUntilChanged, map, switchMap, tap } from "rxjs/operators";


@Injectable()
export class HydrationEffects implements OnInitEffects {

    constructor(private action$: Actions, private store: Store<AppState>) { }
   
   
   
   
    hydrate$ = createEffect(() =>
        this.action$.pipe(
            ofType(HydrationActions.hydrate),
            map(() => {
                const storageValue = localStorage.getItem('state');
                // const userValue = localStorage.getItem('korisnik');

                if (storageValue) {
                    try {
                        const state = JSON.parse(storageValue);
                        // const user = JSON.parse(<string>userValue);
                        return HydrationActions.hydrateSuccess({ state });
                    } catch {
                        localStorage.removeItem('state');
                    }
                }
                return HydrationActions.hydrateFailure();
            })
        )
    );

 
    serialize$ = createEffect(
        () =>
            this.action$.pipe(
                ofType(HydrationActions.hydrateSuccess, HydrationActions.hydrateFailure),
                switchMap(() => this.store),
                distinctUntilChanged(),
                tap((state) => localStorage.setItem("state", JSON.stringify(state)))
            ),
        { dispatch: false }
    );

    ngrxOnInitEffects(): Action {
        return HydrationActions.hydrate();
    }
}