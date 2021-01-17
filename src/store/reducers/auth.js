import * as actionTypes from "../actions/actionTypes";
import { updateObject } from "../utility";

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false
}

const authStart = (state) => updateObject(state, { loading: true, error: null });

const authSuccess = (state, action) => updateObject(state, {
    loading: false,
    error: null,
    token: action.idToken,
    userId: action.userId
});

const authFailure = (state, action) => updateObject(state, { loading: false, error: action.error });

const authLogout = (state) => updateObject(state, { token: null, userId: null });

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START:
            return authStart(state);
        case actionTypes.AUTH_SUCCESS:
            return authSuccess(state, action);
        case actionTypes.AUTH_FAILED:
            return authFailure(state, action);
        case actionTypes.AUTH_LOGOUT:
            return authLogout(state);
        default:
            return state;
    }
}

export default reducer;