import { Action, ActionReducer } from "@ngrx/store";
import { User } from "src/app/models/User";
import { AppState } from "../app-state";
import * as HydrationActions from './hydration.actions'


function isHydrateSuccess(action: Action): action is ReturnType<typeof HydrationActions.hydrateSuccess> {
    return action.type === HydrationActions.hydrateSuccess.type;
}

export const hydrationMetaReducer = (reducer: ActionReducer<AppState>): ActionReducer<AppState> => {
    return (state, action) => {
        if (isHydrateSuccess(action)) {
            return action.state;
        } else {
            return reducer(state, action);
        }
    };
};

// export const hydrationUserMetaReducer = (reducer: ActionReducer<User>): ActionReducer<User> => {
//     return (user, action) => {
//         if (isHydrateSuccess(action)) {
//             return action.user;
//         } else {
//             return reducer(user, action);
//         }
//     };
// };