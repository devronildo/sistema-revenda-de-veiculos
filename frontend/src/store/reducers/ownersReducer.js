import { actionTypes } from '../actions/owners.action';

const initialState = {
     owners: {
         data: []
     },
     owner: {},
     vehicles: {
         data: []
     },
     success: false,
     error: {}
}

// eslint-disable-next-line import/no-anonymous-default-export
export default (state = initialState, {type, payload, isLoadMore}) => {
    switch (type){
         case actionTypes.INDEX:
                 if(isLoadMore){
                       payload.owners.data = state.owners.data.concat(payload.owners.data)
                 }
               return {...state, ...payload}

         case actionTypes.STORE:
               state.owners.total = state.owners.total + 1;
               return {
                    ...state,
                    owners: {
                         ...state.owners,
                         data: [
                             ...[payload],
                             ...state.owners.data
                         ].sort((a,b) => {
                              if(a.name < b.name){
                                   return -1
                              }
                              if(a.name > b.name){
                                  return 1
                              }
                              return 0
                         })
                    }
               }

          case actionTypes.UPDATE: 
               let index = state.owners.data.findIndex(item => item.id === payload.id)
                state.owners.data[index] = payload
                
                return {
                     ...state,
                     owners: {
                          ...state.owners,
                          data: state.owners.data
                     }
                }

          case actionTypes.DESTROY:      
          state.owners.total = state.owners.total - 1;
            return {
                 ...state,
                 owners: {
                      ...state.owners,
                      data: state.owners.data.filter(item => item.id !== payload)
                 }
            }

          case actionTypes.VEHICLES: 
            if(isLoadMore){
                  payload.vehicles.data = state.vehicles.data.concat(payload.vehicles.data)
            }
            return {...state, ...payload}

            case actionTypes.CHANGE: 
                 return {
                      ...state,
                      owner: (payload === 'clear') ? {} : {
                           ...state.owner,
                           ...payload
                      }
                 }
          
            case actionTypes.SUCCESS: 
                 return  {
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