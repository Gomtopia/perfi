import {LOGIN_SUCCESSFUL, LOGIN_FAILED, LOGOUT} from '../actions/user';

export default function user(
    state={
        isAuthenticated: false,
        id: null,
        username: null
    }, action) {

    switch(action.type) {
    case LOGIN_SUCCESSFUL:
        return Object.assign({}, state, {
            isAuthenticated: true,
            id: action.id,
            username: action.username
        })
    case LOGIN_FAILED:
    case LOGOUT:
        return Object.assign({}, state, {
            isAuthenticated: false,
            id: null,
            username: null
        })
    default:
        return state
    }
}
