export const REQUEST_ACCOUNT_LIST = 'REQUEST_ACCOUNT_LIST'
function requestAccountList() {
    return {
        type: REQUEST_ACCOUNT_LIST
    }
}

export const RECEIVE_ACCOUNT_LIST = 'RECEIVE_ACCOUNT_LIST'
function receiveAccountList(json) {
    return {
        type: RECEIVE_ACCOUNT_LIST,
        accountList: json
    }
}

export function fetchAccountList() {
    return dispatch => {
        dispatch(requestAccountList())
        return fetch('api/accounts/')
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => dispatch(receiveAccountList(json)))
    }
}
