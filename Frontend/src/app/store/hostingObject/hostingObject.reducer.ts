import { createEntityAdapter, EntityState } from "@ngrx/entity";
import { createReducer, on } from "@ngrx/store";
import { HostingObject } from "src/app/models/HostingObject";
import { Table } from "src/app/models/Table";
import * as Actions from 'src/app/store/hostingObject/hostingObject.actions'
import * as KorisnikActions from './../korisnik/korisnik.actions';

const adapter = createEntityAdapter<HostingObject>();


export interface HostingObjectState extends EntityState<HostingObject> {
    tables: Table[];
    selectedHostingObjectId: number;

}

const initialState: HostingObjectState = adapter.getInitialState({
    tables: [],
    selectedHostingObjectId: -1,
}
    
);


export const hostingObjectReducer = createReducer(
    initialState,    
    on(Actions.loadObjectsSuccess, (state, { objekti }) => adapter.setAll(objekti, state)),
    on(Actions.selectHostingObject, (state, { hostingObjectId }) => ({
        ...state,
        selectedHostingObjectId: hostingObjectId
    })),

    on(Actions.ucitajStoloveModeratoraSuccess, (state, { stolovi }) => ({
        ...state,
        tables: stolovi
    })),
    on(Actions.DodavanjeObjekataSuccess, (state, {hostingObject}) => adapter.addOne(hostingObject, state)),
    on(Actions.obrisiObjekat, (state, { hostingObjectId }) => adapter.removeOne(hostingObjectId, state)),
    on(KorisnikActions.izlogujKorisnika, (state) => ({
        ...state,
        tables : [],
       selectedHostingObjectId: -1
    })),
    on(KorisnikActions.izlogujKorisnika, (state) => adapter.removeAll(state)),
)
