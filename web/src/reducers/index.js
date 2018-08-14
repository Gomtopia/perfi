import {combineReducers} from 'redux';
import account from './account'
import entry from './entry'
import draft from './draft'
import user from './user'

export default combineReducers({
    account,
    entry,
    draft,
    user
})
