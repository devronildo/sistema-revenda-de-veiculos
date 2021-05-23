import { HttpAuth } from '../../config/Http'
import { ChangeLoading } from './loading.action'

export const actionTypes = {
    INDEX: 'UNIT_INDEX',
    STORE: 'UNIT_STORE',
    UPDATE: 'UNIT_UPDATE',
    DESTROY: 'UNIT_DESTROY',
    CHANGE: 'UNIT_CHANGE',
    SUCCESS: 'UNIT_SUCCESS',
    ERROR: 'UNIT_ERROR'
}

export const change = (payload) => ({
    type: actionTypes.CHANGE,
    payload
})

export const success = (payload) => ({
    type: actionTypes.SUCCESS,
    payload
})

export const error = (payload) => ({
    type: actionTypes.ERROR,
    payload
})

// INDEX

export const indexResponse = (payload) => ({
    type: actionTypes.INDEX,
    payload
})

export const index = (query) => dispatch => {
    return HttpAuth.get('/units?'+ new URLSearchParams(query))
            .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data)))
}

// STORE

export const storeResponse = (payload) => ({
    type: actionTypes.STORE,
    payload
})

export const store = (data) => dispatch => {
    dispatch(ChangeLoading({ open: true }))
    
    return HttpAuth.post('/units', data)
            .then(res => {
                dispatch(ChangeLoading({ open: false }))

                if(res.data.error) {
                    dispatch(error(res.data.error))
                }

                if(res.data.id) {
                    dispatch(storeResponse(res.data))
                    dispatch(success(true))
                }
            })
}

// SHOW

export const show = (id) => dispatch => {
    return HttpAuth.get('/units/'+ id)
        .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data)))
}

// UPDATE

export const updateResponse = (payload) => ({
    type: actionTypes.UPDATE,
    payload
})

export const update = (data) => dispatch => {
    dispatch(ChangeLoading({ open: true }))

    return HttpAuth.put('/units/'+data.id, data)
        .then(res => {
            dispatch(ChangeLoading({ open: false }))

            if(typeof res !== 'undefined') {
                if(res.data.error) {
                    dispatch(error(res.data.error))
                }

                if(res.data.status === 200) {
                    dispatch(updateResponse(data))
                    dispatch(success(true))
                }
            }
        })
}


// DESTROY

export const destroyResponse = (payload) => ({
    type: actionTypes.DESTROY,
    payload
})

export const destroy = (id) => dispatch => {
    return HttpAuth.delete('/units/'+id)
            .then(res => typeof res !== 'undefined' && dispatch(destroyResponse(id)))
}

// CEP

export const cep = (zipCode) => dispatch => {
    if(zipCode.length > 8) {
        return HttpAuth.post('webservice/cep', {
            cep: zipCode
        })
        .then(res => typeof res !== 'undefined' && dispatch(change(res.data)));
    }
}