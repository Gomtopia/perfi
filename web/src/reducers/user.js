import {LOGIN_SUCCESSFUL,
        LOGIN_FAILED,
        LOGOUT,
        CLEAR_DATA} from '../actions/user';

export default function user(
    state={
        isAuthenticated: false,
        id: null,
        username: null,
        error: null,
    }, action) {

    switch(action.type) {
        case LOGIN_SUCCESSFUL:
            return Object.assign({}, state, {
                isAuthenticated: true,
                id: action.data.id,
                username: action.data.username
            })
        case LOGIN_FAILED:
            return Object.assign({}, state, {
                error: action.data.error
            })
        case LOGOUT:
        case CLEAR_DATA:
            return Object.assign({}, state, {
                isAuthenticated: false,
                id: null,
                username: null,
                error: null
            })
        default:
            return state
    }
}
