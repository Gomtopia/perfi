import {getCookie} from '../helper'

export const REQUEST_DRAFT = 'REQUEST_DRAFT'
function requestDraft() {
    return {
        type: REQUEST_DRAFT
    }
}

export const RECEIVE_DRAFT = 'RECEIVE_DRAFT'
function receiveDraft(json) {
    return {
        type: RECEIVE_DRAFT,
        draft: json
    }
}

export const REQUEST_SPLIT = 'REQUEST_SPLIT'
export function requestSplit(entryId) {
    return {
        type: REQUEST_SPLIT,
        entryId: entryId
    }
}

export const CANCEL_SPLIT = 'CANCEL_SPLIT'
export function cancelSplit(entryId) {
    return {
        type: CANCEL_SPLIT,
        entryId: entryId
    }
}

export const ADD_SUB_ENTRY = 'ADD_SUB_ENTRY'
export function addSubEntry(entryId) {
    return {
        type: ADD_SUB_ENTRY,
        entryId: entryId
    }
}

export const REMOVE_SUB_ENTRY = 'REMOVE_SUB_ENTRY'
export function removeSubEntry(entryId) {
    return {
        type: REMOVE_SUB_ENTRY,
        entryId: entryId
    }
}

export function getDraftFromFile(file) {
    return dispatch => {
        dispatch(requestDraft())

        const formData = new FormData();
        formData.append('file', file);

        return fetch('/api/drafts/', {
            method: 'POST',
            headers: {
                'X-CSRFToken': getCookie('csrftoken')
            },
            credentials: 'same-origin',
            body: formData,
        })
            .then(
                response => response.json(),
                error => console.log('An error occurred.', error)
            )
            .then(json => dispatch(receiveDraft(json)))
    }
}
