import {REQUEST_ACCOUNT_LIST,
        RECEIVE_ACCOUNT_LIST
       } from '../actions/account';

export default function account(
    state={
        isFetching: false,
        accountList: []
    },
    action) {

    switch(action.type) {
        case REQUEST_ACCOUNT_LIST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ACCOUNT_LIST:
            return Object.assign({}, state, {
                isFetching: false,
                accountList: action.accountList
            })
        default:
            return state
    }
}
