export const REQUEST_ENTRY_LIST = 'REQUEST_ENTRY_LIST'
function requestEntryList() {
    return {
        type: REQUEST_ENTRY_LIST
    }
}

export const RECEIVE_ENTRY_LIST = 'RECEIVE_ENTRY_LIST'
function receiveEntryList(json) {
    return {
        type: RECEIVE_ENTRY_LIST,
        entryList: json
    }
}

export const START_EDIT = 'START_EDIT'
export function startEdit(entry) {
    return {
        type: START_EDIT,
        id: entry.id
    }
}

export const END_EDIT = 'END_EDIT'
function endEdit(entry) {
    return {
        type: END_EDIT,
        entry: entry
    }
}

export function fetchEntryList() {
    return dispatch => {
        dispatch(requestEntryList())
        return fetch('api/entries/')
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => dispatch(receiveEntryList(json)))
    }
}

export function addEntry(entry) {
    return dispatch => {
        return fetch('api/entries/',
                     {
                         method: 'POST',
                         headers: {
                             Accept: 'application/json',
                             'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(entry),
                     })
            .then(
                response => dispatch(fetchEntryList()),
                error => console.log('An error occurred.', error)
            )
    }
}

export function deleteEntry(entry) {
    return dispatch => {
        return fetch('api/entries/' + entry.id + '/',
                     {
                         method: 'DELETE',
                         headers: {
                             Accept: 'application/json',
                             'Content-Type': 'application/json'
                         },
                         body: JSON.stringify(entry)
                     })
            .then(
                response => dispatch(fetchEntryList()),
                error => console.log('An error occurred.', error)
            )
    }
}

export function updateEntry(entry) {
    return dispatch => {
        return fetch('api/entries/' + entry.id + '/',
                     {
                         method: 'PUT',
                         headers: {
                             Accept: 'application/json',
                             'Content-Type': 'application/json',
                         },
                         body: JSON.stringify(entry)
                     })
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => dispatch(endEdit(json)))
    }
}
