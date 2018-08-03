import {createStore, applyMiddleware} from 'redux';
import thunkMiddleware from 'redux-thunk'
import combineReducers from './reducers/index';

export const store = createStore(
    combineReducers,
    applyMiddleware(
        thunkMiddleware
    )
)
