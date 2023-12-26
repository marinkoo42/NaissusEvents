import { createSelector } from "@ngrx/store";
import { HostingObject } from "src/app/models/HostingObject";
import { AppState } from "../app-state";
import { HostingObjectState } from "./hostingObject.reducer";




export const selectHostingObjectFeature = createSelector(
    (state: AppState) => state.hostingObjectState,
    (hostingObjectState) => hostingObjectState
)
export const selectHostingObjectAsDict = createSelector(
    selectHostingObjectFeature,
    (state: HostingObjectState) => state.entities
);

export const selectAllHostingObjects = createSelector(
    selectHostingObjectFeature,
    (state: HostingObjectState) => Object.values(state.entities).filter(myObject => myObject !== null).map(myObject => <HostingObject>myObject)
)

export const selectSelectedHostingObjectId = createSelector(
    selectHostingObjectFeature,
    (state : HostingObjectState) => state.selectedHostingObjectId
);

export const selectModeratorTables = createSelector(
    selectHostingObjectFeature,
    (state: HostingObjectState) => state.tables
);

export const selectSelectedHostingObject = createSelector(
    selectHostingObjectAsDict,
    selectSelectedHostingObjectId,
    (objekti,objekatId) => objekti[objekatId] ?? null
);
