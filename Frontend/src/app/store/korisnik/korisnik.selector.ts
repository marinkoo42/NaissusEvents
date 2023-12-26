import { createAction, createSelector } from "@ngrx/store";
import { AppState } from "../app-state";
import { KorisnikState } from "./korisnik.reducer";
import { User } from "src/app/models/User";


export const selectKorisnikFeatures = createSelector(
    (state: AppState) => state.korisnikState,
    (korisnikState) => korisnikState
);
export const selectSviKorisnici = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => Object.values(state.entities).filter(korisnik => korisnik !== null).map(korisnik => <User>korisnik)
);

export const selectSviBezAdmina = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => Object.values(state.entities).filter(korisnik => korisnik !== null && korisnik?.role!=="Admin").map(korisnik => <User>korisnik)
);

export const selectPotencijalniModeratori = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => Object.values(state.entities).filter(korisnik => korisnik !== null && korisnik?.role !== "Admin" && korisnik?.role!=="Moderator").map(korisnik => <User>korisnik)
);


export const selectUlogovanKorisnikId = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => state.ulogovanKorisnikId
);

export const selectUlogovanKorisnikState = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => state.ulogovanKorisnik
);

export const selectUlogovanKorisnik = createSelector(
    selectUlogovanKorisnikState,
    (korisnik) => korisnik ?? null
);


export const selectUlogovanTokenState = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => state.token
);
export const selectUlogovanToken = createSelector(
    selectUlogovanTokenState,
    (token) => token ?? null
);

export const selectSelektovanKorisnikId = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => state.selektovanKorisnikId
);

export const selectSelektovanKorisnikDict = createSelector(
    selectKorisnikFeatures,
    (state: KorisnikState) => state.entities
);

export const selectSelektovanKorisnik = createSelector(
    selectSelektovanKorisnikDict,
    selectSelektovanKorisnikId,
    (korisnici, korisnikId) => korisnici[korisnikId] ?? null
);