import { createEntityAdapter, EntityState } from '@ngrx/entity';
import { createReducer, on } from '@ngrx/store';
import { myEvent } from 'src/app/models/myEvent';
import * as Actions from './event.actions'
import * as KorisnikActions from './../korisnik/korisnik.actions';


const adapter = createEntityAdapter<myEvent>();

export interface EventState extends EntityState<myEvent> {
    selectedEventId: number;
}

const initialState: EventState = adapter.getInitialState({

    selectedEventId : -1
}

);

export const eventReducer = createReducer(
    initialState,
    on(Actions.loadEventsSuccess, (state, { myEvents }) => adapter.setAll(myEvents, state)),
    on(Actions.selectEvent, (state, { eventId }) => ({
        ...state,
        selectedEventId: eventId
    })),
    on(KorisnikActions.izlogujKorisnika, (state) => ({
        ...state,
        selectedEventId: -1
    })),
    on(KorisnikActions.izlogujKorisnika, (state) => adapter.removeAll(state)),
    on(Actions.brisanjeEventaSuccess, (state, { eventId }) => adapter.removeOne(eventId, state)),
    on(Actions.dodavanjeEventaSuccess, (state, { event }) => adapter.addOne(event, state)),
    )
