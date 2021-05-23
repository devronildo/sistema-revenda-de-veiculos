import { actionTypes } from '../actions/pay.action';

const initialState = {
     plans: [],
     plan: {},
     pay_type: null,
     success: null,
     error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, {type, payload}) => {
    switch (type){
         case actionTypes.CHANGE:
             return { ...state, ...payload}
         
         case actionTypes.SUCCESS:
             return { 
                 ...state,
                 success: payload
             }     

         case actionTypes.ERROR:
             return { 
                 ...state, 
                 error: payload
                }     

         default: 
           return state

    }
}       
