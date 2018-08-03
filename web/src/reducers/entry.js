import {REQUEST_ENTRY_LIST,
        RECEIVE_ENTRY_LIST,
        START_EDIT,
        END_EDIT
       } from '../actions/entry';

export default function entry(
    state={
        isFetching: false,
        entries: {}
    }, action) {

    switch(action.type) {
        case REQUEST_ENTRY_LIST:
            return Object.assign({}, state, {
                isFetching: true
            })
        case RECEIVE_ENTRY_LIST: {
            const entries = {}
            action.entryList.map((entry) => {
                entries[entry.id] = entry
            })

            return Object.assign({}, state, {
                isFetching: false,
                entries: entries
            })
        }
        case START_EDIT:
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.id]: Object.assign({}, state.entries[action.id], {
                        isEditing: true
                    })
                })
            });
        case END_EDIT:
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.entry.id]: action.entry
                })
            });
        default:
            return state
    }
}
