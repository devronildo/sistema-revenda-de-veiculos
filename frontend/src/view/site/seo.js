import React from 'react';
import { AppBar, Button, IconButton, TextField, Toolbar, Typography } from '@material-ui/core';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import { changeScreenA } from '../../store/actions/navigation.action';
import { change, update } from '../../store/actions/app.action';

import {  useDispatch, useSelector} from 'react-redux'

export default function Seo(){

    const dispatch = useDispatch();
    const app = useSelector(state => state.appReducer.app)

    const _update = () => {
           dispatch(update(app)).then(() => dispatch(changeScreenA({open: false})))
    }

     return( 
         <>
            <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenA({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">
                          Otimização Google
                     </Typography>
                     <Button onClick={() => _update()} color="inherit" className="ml-auto">
                         <FaSave className="mr-2" /> Salvar
                     </Button> 
                 </Toolbar>
              </AppBar> 

              <div className="scroll card-body">
                  <div className="form-group">
                      <label className="label-custom">TITULO DO SITE</label>
                      <TextField 
                        variant="outlined"
                        fullWidth
                        value={app.site_title || ''}
                        onChange={text => dispatch(change({ site_title: text.target.value }))}
                      />
                  </div>  

                  <div className="form-group">
                      <label className="label-custom">PALAVRAS CHAVES</label>
                      <TextField 
                        variant="outlined"
                        fullWidth
                        placeholder="Separe cada palavra por virgula"
                        value={app.site_keywords || ''}
                        onChange={text => dispatch(change({ site_keywords: text.target.value }))}
                      />
                  </div>    

                  <div className="form-group">
                      <label className="label-custom">DESCRIÇÃO DO SITE</label>
                      <TextField 
                        variant="outlined"
                        fullWidth
                        multiline
                        rows="5"
                        placeholder="Separe cada palavra por virgula"
                        value={app.site_description || ''}
                        onChange={text => dispatch(change({ site_description: text.target.value }))}
                      />
                  </div>    
              </div>
         </>
     )
}