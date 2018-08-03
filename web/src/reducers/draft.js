import {REQUEST_DRAFT,
        RECEIVE_DRAFT,
        REQUEST_SPLIT,
        CANCEL_SPLIT,
        ADD_SUB_ENTRY,
        REMOVE_SUB_ENTRY
       } from '../actions/draft';

export default function draft(
    state={
        isFetching: false,
        entries: {}
    }, action) {

    switch(action.type) {
    case REQUEST_DRAFT:
            return Object.assign({}, state, {
                isFetching: true
            });
        case RECEIVE_DRAFT: {
            let entries = {};
            action.draft.map((entry) => {
                entries[entry.id] = entry
            })
            return Object.assign({}, state, {
                isFetching: false,
                entries: entries
            })
        }
        case REQUEST_SPLIT: {
            let entry = state.entries[action.entryId];
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.entryId]: Object.assign({}, state.entries[action.entryId], {
                        isSpliting: true,
                        subEntries: [
                            {id: entry.id+'_0', date: entry.date, amount: entry.amount},
                            {id: entry.id+'_1', date: entry.date, amount: 0}
                        ],
                    })
                })
            })
        }
        case CANCEL_SPLIT:
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.entryId]: Object.assign({}, state.entries[action.entryId], {isSpliting: false})
                })
            })
        case ADD_SUB_ENTRY: {
            const subEntries = state.entries[action.entryId].subEntries;
            subEntries.push({
                id: action.entryId+'_'+subEntries.length, date: state.entries[action.entryId].date, amount: 0
            })
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.entryId]: Object.assign({}, state.entries[action.entryId], {
                        subEntries: subEntries
                    })
                })
            })
        }
        case REMOVE_SUB_ENTRY: {
            const subEntries = state.entries[action.entryId].subEntries;
            subEntries.pop();
            return Object.assign({}, state, {
                entries: Object.assign({}, state.entries, {
                    [action.entryId]: Object.assign({}, state.entries[action.entryId], {
                        isSpliting: (subEntries.length >= 2),
                        subEntries: subEntries
                    })
                })
            })
        }
        default:
            return state
    }
}
