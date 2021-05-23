import {actionTypes} from '../actions/notify.action';

const initialState = {
      open: false,
      horizontal: 'center',
      vertical: 'top',
      class: 'error',
      time: 3000,
      msg: ''
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, {type, payload}) => {
     switch (type){
          case actionTypes.CHANGE:
                  return {...state, ...payload}
          default: 
               return state        
     }
}