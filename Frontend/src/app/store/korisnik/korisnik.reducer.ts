import { tokenize } from "@angular/compiler/src/ml_parser/lexer";
import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { User } from "src/app/models/User";
import * as Actions from "./korisnik.actions";

const adapter = createEntityAdapter<User>();

export interface KorisnikState extends EntityState<User>{
    ulogovanKorisnikId: string,
    ulogovanKorisnik: User,
    token: string,
    selektovanKorisnikId: string
}

const initialState : KorisnikState = adapter.getInitialState({
    ulogovanKorisnikId: "-1",
    ulogovanKorisnik: new User("-1", "", "", "", "", "", "", "",""),
    token: "",
    selektovanKorisnikId: "-1",

    
});


export const korisnikReducer = createReducer(
    initialState,
    on(Actions.uspesnoLogovanje, (state, { token }) => ({
        ...state,
        token: token
    })),
    on(Actions.izmeniUlogovanogKorisnikaSuccess, (state, { korisnik }) => ({
        ...state,
        ulogovanKorisnik: korisnik
    })),
    on(Actions.registrovanjeNovogKorisnika, (state, { noviKorisnik }) => adapter.addOne(noviKorisnik, state)),
    on(Actions.brisiKorisnika, (state, { korisnikId }) => adapter.removeOne(korisnikId, state)),
    on(Actions.uspesnoUcitavanjeKorisnika, (state, { korisnici }) => adapter.setAll(korisnici, state)),
    on(Actions.izlogujKorisnika, (state) => ({
        ...state,
        ulogovanKorisnikId: "-1",
        ulogovanKorisnik: new User("-1", "", "", "", "", "", "", "", ""),
        token: "",
        selektovanKorisnikId: "-1"
    })),
    on(Actions.izlogujKorisnika, (state) => adapter.removeAll(state)),
    
    on(Actions.citajToken, (state, { korisnik }) => ({
        ...state,
        ulogovanKorisnikId: korisnik.id,
        ulogovanKorisnik: korisnik
    })),
    on(Actions.selectUser, (state, { selektovanKorisnikId }) => ({
        ...state,
        selektovanKorisnikId: selektovanKorisnikId,
        
    })),
    

)
       