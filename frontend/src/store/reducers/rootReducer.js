import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';
import notifyReducer from './notifyReducer';
import alertReducer from './alertReducer';
import authReducer from './authReducer';
import registerReducer from './registerReducer';
import vehiclesReducer from './vehiclesReducer';
import navigationReducer from './navigationReducer'
import notesReducer from './notesReducer'
import ownersReducer from './ownersReducer'
import appReducer from './appReducer'
import unitsReducer from './unitsReducer'
import payReducer from './payReducer'

const rootReducer = combineReducers({
    loadingReducer,
    notifyReducer,
    alertReducer,
    authReducer,
    registerReducer,
    vehiclesReducer,
    navigationReducer,
    notesReducer,
    ownersReducer,
    appReducer,
    unitsReducer,
    payReducer
})

export default rootReducer;