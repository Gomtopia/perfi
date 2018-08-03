import {combineReducers} from 'redux';
import account from './account'
import entry from './entry'
import draft from './draft'

export default combineReducers({
    account,
    entry,
    draft
})
