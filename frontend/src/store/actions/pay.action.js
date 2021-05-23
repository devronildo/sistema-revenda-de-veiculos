import { HttpAuth } from '../../config/Http';
import { ChangeLoading } from './loading.action';
import { changeNotify } from './notify.action';

export const actionTypes = {
     CHANGE: 'PAY_CHANGE',
     SUCCESS: 'PAY_SUCCESS',
     ERROR: 'PAY_ERROR'
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

export const alertError = (value) => dispatch => {
      dispatch(ChangeLoading({ open: false }))
      dispatch(changeNotify({
           open: true,
           msg: Object.values(value)[0],
           class: 'error'
      }))

      dispatch(error(value))
}

export const plans = () => dispatch => {
    return HttpAuth.get('/pay/plans')
    .then(res => typeof res !== 'undefined' && dispatch(change(res.data)));
}

export const payCard = (data) => dispatch => {
      dispatch(ChangeLoading({
           open: true,
           msg: 'Processando pagamento...'
      }))
      return HttpAuth.post("/pay/card", data)
              .then(res => {
                   dispatch(ChangeLoading({open: false}))

                   if(typeof res !== 'undefined'){
                        if(res.data.success){
                             dispatch(success(res.data.id))
                        }
                        if(res.data.error){
                            dispatch(error(res.data.error))
                        }
                   }
              })
    }
    

  export const payPec = (data) => dispatch => {
    dispatch(ChangeLoading({
        open: true,
        msg: 'Processando pagamento...'
   }))
   return HttpAuth.post("/pay/pec", data)
           .then(res => {
                dispatch(ChangeLoading({open: false}))

                if(typeof res !== 'undefined'){
                     if(res.data.success){
                          dispatch(success(res.data.id))
                     }
                     if(res.data.error){
                         dispatch(error(res.data.error))
                     }
                }
           })
  }    

