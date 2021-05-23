import { HttpAuth } from '../../config/Http';
import { changeNotify } from './notify.action';

export const actionTypes = {
    INDEX: 'NOTE_INDEX',
    STORE: 'NOTE_STORE',
    UPDATE: 'NOTE_UPDATE',
    DESTROY: 'NOTE_DESTROY',
    CHANGE: 'NODE_CHANGE'
}



export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

//INDEX
export const indexResponse = (payload, isLoadMore) => ({
      type: actionTypes.INDEX,
      payload,
      isLoadMore
})

export const index = (query, isLoadMore) => dispatch => {
      return HttpAuth.get('/notes?'+ new URLSearchParams(query))
          .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data, isLoadMore)))
}

// STORE
export const storeResponse = (payload) => ({
    type: actionTypes.STORE,
    payload
})

export const store = (data) => dispatch => {
     return HttpAuth.post('/notes', data)
                    .then(res => typeof res !== 'undefined' && dispatch(storeResponse(res.data))) 
}

//UPDATE 
export const updateResponse = (payload, isLoadMore) => ({
    type: actionTypes.UPDATE,
    payload,
})

export const update = (data) => dispatch => {
       return HttpAuth.put('/notes/'+data.id, data)
              .then(res => {
                   if(typeof res !== 'undefined'){
                        if(res.data.status === 200){
                           dispatch(updateResponse(data))
                        }

                        if(res.data.error){
                             dispatch(changeNotify({
                                  open: true,
                                  msg: res.data.error,
                                  class: 'error'
                             }));
                        }
                   }
              })
}

// DESTROY 
export const destroyResponse = (payload, isLoadMore) => ({
    type: actionTypes.DESTROY,
    payload,
})

export const destroy = (id) => dispatch => {
          return HttpAuth.delete('/notes/'+id)
                .then(res => typeof res !== 'undefined' && dispatch(destroyResponse(id)))
}
