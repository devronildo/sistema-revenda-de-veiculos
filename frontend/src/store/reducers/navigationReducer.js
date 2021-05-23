import { actionTypes } from '../actions/navigation.action';

const initialState = {
     screenA: {
         open: false,
         type: null,
         props: {}
     },
     screenB: {
        open: false,
        type: null,
        props: {}
    },
    screenC: {
        open: false,
        type: null,
        props: {}
    },

}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, {type, payload}) => {
   switch (type){
        case actionTypes.SCREEN_A:
                return {
                    ...state,
                    screenA: {
                        ...payload    
                    }
                }
        case actionTypes.SCREEN_B:
            return {
                ...state,
                screenB: {
                    ...payload    
                }
            }
            case actionTypes.SCREEN_C:
                return {
                    ...state,
                    screenC: {
                        ...payload    
                    }
                }      
        default: 
             return state        
   }
}