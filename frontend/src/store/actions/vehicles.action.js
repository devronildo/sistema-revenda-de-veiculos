import { HttpAuth, HttpUpload } from '../../config/Http'
import { ChangeLoading } from './loading.action';
import { changeNotify } from './notify.action';

export const actionTypes = {
    INDEX: 'VEHICLE_INDEX', 
    UPDATE: 'VEHICLE_UPDATE', //PAREI AQI
    DESTROY: 'VEHICLE_DETROY',
    CHANGE: 'VEHICLE_CHANGE',
    UPLOAD_PHOTO: 'VEHICLE_UPLOAD_PHOTO',
    DELETE_PHOTO: 'VEHICLE_DELETE_PHOTO',
    REORDER_PHOTO: 'VEHICLE_REORDER_PHOTO', 
    SUCCESS: 'VEHICLE_SUCCESS',
    ERROR: 'VEHICLE_ERROR'
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

export const indexResponse = (payload, isLoadMore) => ({
     // eslint-disable-next-line no-undef
     type: actionTypes.INDEX,
     payload,
     isLoadMore
})

export const index = (query, isLoadMore) => dispatch => {
      return HttpAuth.get('/vehicles?' + new URLSearchParams(query))
                  .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data, isLoadMore)))
                  
}
//STORE

export const store = () => dispatch => {
     return HttpAuth.post('/vehicles')
                 .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data)))
 }

//SHOW

export const show = (id) => dispatch => {
    return HttpAuth.get('/vehicles/'+ id)
            .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data)))                
}

//UPDATE
export const updateResponse = (payload) => ({
     type: actionTypes.UPDATE,
     payload
 })


export const update = (data) => dispatch => {
     dispatch(ChangeLoading({
          open: true
     }))

     return HttpAuth.put('/vehicles/'+ data.id, data)
                 .then(res => {
                    dispatch(ChangeLoading({
                        open: false
                   }))

                   if(typeof res !== 'undefined'){
                        if(res.data.error){
                             dispatch(success(false));
                             dispatch(error(res.data.error))
                        }

                        if(res.data.status === 200){
                             dispatch(success(true));
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
     return HttpAuth.delete('/vehicles/'+ id)
         .then(res => {
              if(typeof res !== 'undefined'){
                   if(res.data.status === 200){
                        dispatch(destroyResponse(id))
                   }
              }
         })
}

// UPLOAD PHOTO

export const uploadPhotoResponse = (payload) => ({
     type: actionTypes.UPLOAD_PHOTO,
     payload
})

export const uploadPhoto = (item) => dispatch => {
      dispatch(indexResponse({ upload_photo : true }))

      return HttpUpload.post('upload/vehicle', item)
           .then(res => {
               dispatch(indexResponse({ upload_photo : false }))
               if(typeof res != 'undefined'){
                     if(res.data.error){
                            dispatch(changeNotify({
                                  open: true,
                                  msg: res.data.error,
                                  class: 'error'
                            }))
                     }

                     if(res.data.id){
                           dispatch(uploadPhotoResponse(res.data));
                     }
               }
           })
}

// DELETE PHOTO
export const deletePhotoResponse = (payload) => ({
     type: actionTypes.DELETE_PHOTO,
     payload
})

export const deletePhoto = (id) => dispatch => {
     return HttpAuth.delete('upload/vehicle/'+id)
      .then(res => {
            if(typeof res !== 'undefined'){
                   if(res.data.error){
                    dispatch(changeNotify({
                         open: true,
                         msg: res.data.error,
                         class: 'error'
                   }))
                }
                if(res.data.success){ 
                      dispatch(deletePhotoResponse(id));
                }
            }
      })
}
// REORDER PHOTO
export const reorderPhotoResponse = (payload) => ({
     type: actionTypes.REORDER_PHOTO,
     payload
});

export const reorderPhoto = (pos, data) => dispatch => {
     dispatch(reorderPhotoResponse(data));
     
     return HttpAuth.put('upload/vehicle/null', pos)
      .then(res => {
            if(typeof res !== 'undefined'){
                   if(res.data.success){
                         dispatch(changeNotify({
                            open: true,
                            msg: res.data.success,
                            class: 'success'
                    }))
                 }
            }
      })
}


// VEHICLE BRAND

export const brand = (vehicle_type) => dispatch => {
     dispatch(ChangeLoading({
          open: true
     }))
     return HttpAuth.get('/vehicles/'+vehicle_type+'/brand')
      .then(res => {
          dispatch(ChangeLoading({
               open: false
          }))
          if(typeof res !== 'undefined'){
                dispatch(indexResponse(res.data));
          }
      })
}

//VEHICLE MODEL
export const model = (vehicle_type, vehicle_brand) => dispatch => {
     dispatch(ChangeLoading({
          open: true
     }))
     return HttpAuth.get('/vehicles/'+vehicle_type+'/'+vehicle_brand+'/model')
     .then(res => {
          dispatch(ChangeLoading({
               open: false
          }))

          if(typeof res !== 'undefined'){
               dispatch(indexResponse(res.data));
          }
     })
}

//VEHICLE VERSION

export const version = (vehicle_brand, vehicle_model) => dispatch => {
     dispatch(ChangeLoading({
          open: true
     }))
     return HttpAuth.get('/vehicles/'+vehicle_brand+'/'+vehicle_model+'/version')
     .then(res => {
          dispatch(ChangeLoading({
               open: false
          }))

          if(typeof res !== 'undefined'){
               dispatch(indexResponse(res.data));
          }
     })
}


//CEP

export const cep = (zipCode) => dispatch => {
     if(zipCode.length > 8){
            return HttpAuth.post('/webservice/cep', {
                  cep: zipCode
            })
            .then(res => typeof res !== 'undefined' && dispatch(change(res.data)))
     }
} 