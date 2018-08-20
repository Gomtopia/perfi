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
            const entriesIdToIndex = {}
            action.entryList.map((entry, index) => {
                entries[index] = entry;
                entriesIdToIndex[entry.id] = index;
            })

            return Object.assign({}, state, {
                isFetching: false,
                entries: entries,
                entriesIdToIndex: entriesIdToIndex
            })
        }
        case START_EDIT:
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [state.entriesIdToIndex[action.id]]: Object.assign(
                        {},
                        state.entries[state.entriesIdToIndex[action.id]],
                        {isEditing: true}
                    )
                })
            });
        case END_EDIT:
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [state.entriesIdToIndex[action.entry.id]]: action.entry
                })
            });
        default:
            return state
    }
}
