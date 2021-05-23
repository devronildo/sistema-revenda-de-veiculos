import { HttpAuth } from '../../config/Http'
import { ChangeLoading } from './loading.action'
import { changeNotify } from './notify.action'
import { changeAlert } from './alert.action'

export const actionTypes = {
    INDEX: 'APP_INDEX',
    UPDATE: 'APP_UPDATE',
    CHANGE: 'APP_CHANGE',
    SUCCESS: 'APP_SUCCESS',
    ERROR: 'APP_ERROR'
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

export const index = () => dispatch => {
    return HttpAuth.get('/app')
        .then(res => typeof res !== 'undefined' && dispatch(indexResponse(res.data)))
}

// UPDATE

export const update = (data) => dispatch => {
    dispatch(ChangeLoading({ open: true }))

    return HttpAuth.put('/app/'+data.id, data)
        .then(res => {
            dispatch(ChangeLoading({ open: false }))

            if(typeof res !== 'undefined') {
                if(res.data.error) {
                    dispatch(error(res.data.error))
                }

                if(res.data.status === 200) {
                    dispatch(changeNotify({
                        open: true,
                        msg: res.data.success,
                        class: 'success'
                    }))
                    dispatch(success(true))
                }
            }
        })
}

//UPLOAD LOGO

export const uploadLogo = (item) => dispatch => { 
         return HttpAuth.post('/upload/logo', item).then( res => {
              if(typeof res !== 'undefined'){
                if(res.data.logo){
                     dispatch(changeNotify({
                         open: true,
                         msg: 'Logo enviado com sucesso',
                         class: 'success'
                     }))

                     dispatch(change({ logo: res.data.logo }))
                }
              } 
         })
}

// DESTROY LOGO

export const destroyLogo = (id) => dispatch => {
      return HttpAuth.delete('/upload/logo/'+ id).then(res => {
           if(typeof res !== 'undefined'){
                 if(res.data.status === 200){
                    dispatch(changeNotify({
                        open: true,
                        msg: 'Logo apagada com sucesso',
                        class: 'success'
                    }))

                    dispatch(change({ logo: null }))
                 }
           }
      })
}

//VALIDATE SUBDOMAIN

export const validateSubdomain = (value) => dispatch => {
     value = value.toLowerCase();
     if(value.search(' ') >= 0){
         value = value.replace(" ", "")
         dispatch(changeAlert({
              open:true,
              msg: 'O endereço do seu site não pode conter espaços em branco',
              class: 'error'
         }))
     }

     if(value.search('www') >= 0){
        value = value.replace("wwww", "")
        dispatch(changeAlert({
             open:true,
             msg: 'Digite o endereço do seu site sem o www',
             class: 'error'
        }))
    }

    if(value.search('.com') >= 0){
        value = value.replace(".com", "")
        dispatch(changeAlert({
             open:true,
             msg: 'Para utilizar domínio .com clique no botão abaixo "USAR MEU DOMÍNIO"',
             class: 'error'
        }))
    }

    return value.normalize('NFD').replace(/([\u0300-\u036f]|[^0-9a-zA-Z.])/g, '');
}