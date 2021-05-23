import { actionTypes } from '../actions/register.action';

const initialState = {
     user: {
          'name': '',
          'email': '',
          'password': ''
     },
     success: false,
     error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, {type, payload}) => {
    switch (type){
         case actionTypes.CHANGE:
                  return {...state, user: {
                       ...state.user,
                       ...payload
                  }
                }
         case actionTypes.SUCCESS:
            return {
                ...state, success: payload
            }    
            
            case actionTypes.ERROR:
            return {
                ...state, error: payload
            }        
         default: 
              return state        
    }
}