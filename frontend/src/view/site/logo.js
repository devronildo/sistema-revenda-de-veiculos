import { AppBar, Button, CircularProgress, IconButton, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { MdCloudUpload, MdDelete, MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { rootUrl } from '../../config/App';
import { destroyLogo, uploadLogo } from '../../store/actions/app.action';
import { changeScreenA } from '../../store/actions/navigation.action';
import { Confirm } from '../components';


export default function Logo(){
    const dispatch = useDispatch();
    const app = useSelector(state => state.appReducer.app)

    const [ state, setState] = React.useState({
         isUpload: null,
         isDeleted: null,
         confirmEl: false 
    })

    const _handleUpload = (event) => {
          setState({ isUpload: true })
          const body = new FormData();
          body.append('file', event.target.files[0])

          dispatch(uploadLogo(body)).then(res => res && setState({ isUpload: null}))
    }

    const _destroy = (id) => {
          setState({ isDeleted: id})

          dispatch(destroyLogo(id)).then(res => res && setState({ isDeleted: null }))
    }

     return (
          <>
              <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenA({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">
                          Minha logo
                     </Typography>
                 </Toolbar>
              </AppBar> 
              <div className="card-body scroll">
                     <div className="d-flex flex-column align-items-center mt-5">
                          {(app.logo) ? 
                             <>
                               <img alt="" style={(state.isDeleted) ? {opacity: 0.5} : {}} className="img-fluid" src={rootUrl+'thumb/logo/'+app.logo+'?u='+app.id+'&h=150'} />
                               <div className="mt-4">
                                   {(state.isDeleted) ? <CircularProgress color="secondary" /> : 
                                       <Button 
                                         color="secondary"
                                         startIcon={<MdDelete />}
                                         onClick={() => setState({ confirmEl: true})}
                                       >
                                            Remover

                                       </Button>
                                   }
                                   {( state.confirmEl)  &&
                                             <Confirm
                                                  open={(state.confirmEl)}
                                                  onConfirm={() => _destroy(app.id)}
                                                  onClose={() => setState({confirmEl: null })}
                                             />
                                             
                                   }  
                               </div>
                             </>
                              :
                              <>
                                <h5 className="mt-4 mb-4">Já tem uma logo?</h5>
                                <input onChange={_handleUpload} id="button-upload-logo" type="file" hidden  />
                                 {(state.isUpload) ? <CircularProgress /> : 
                                   <label htmlFor="button-upload-logo">
                                         <Button
                                          variant="contained"
                                          color="secondary"
                                          component="span"
                                          startIcon={<MdCloudUpload />}
                                         >
                                             upload
                                            
                                         </Button>
                                   </label>
                                 }
                              </>                            
                          }
                     </div>
              </div>
         </>
     )
}