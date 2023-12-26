
// import { KorisnikState } from "./korisnik/korisnik.reducer";

import { createReducer } from "@ngrx/store";
import { EventState } from "./event/event.reducer";
import { HostingObjectState } from "./hostingObject/hostingObject.reducer";
import { KorisnikState } from "./korisnik/korisnik.reducer";



export interface AppState {
    eventState: EventState,
    korisnikState: KorisnikState,
    hostingObjectState : HostingObjectState
}
