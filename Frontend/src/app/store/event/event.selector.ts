import { createSelector } from "@ngrx/store";
import { myEvent } from "src/app/models/myEvent";
import { HostingObject } from "src/app/models/HostingObject";
import { AppState } from "../app-state";
import { EventState } from "./event.reducer";



export const selectEventFeature = createSelector(
    (state: AppState) => state.eventState,
    (eventState) => eventState
    )
export const selectEventAsDict = createSelector(
        selectEventFeature,
        (state: EventState) => state.entities
    );

export const selectAllEvents = createSelector(
    selectEventFeature,
    (state: EventState) => Object.values(state.entities).filter(myEvent => myEvent !== null).map(myEvent => <myEvent>myEvent)
)

export const selectSelectedEventId = createSelector(
    selectEventFeature,
    (state: EventState) => state.selectedEventId
);

export const selectSelectedEvent = createSelector(
    selectEventAsDict,
    selectSelectedEventId,
    (eventi, eventId) => eventi[eventId] ?? null
);

export const selectObjectEvents = (  hostingObjectId: number ) => createSelector(
    selectEventFeature,
    (state: EventState) =>Object.values(state.entities).filter(myEvent => myEvent?.hostingObject.id == hostingObjectId).map(myEvent => <myEvent>myEvent)
);



