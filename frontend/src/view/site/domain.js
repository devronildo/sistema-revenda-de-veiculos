import { AppBar, Button, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import { changeScreenA } from '../../store/actions/navigation.action';
import { useDispatch, useSelector } from 'react-redux';
import { change, success, update, validateSubdomain } from '../../store/actions/app.action';
import { subdomain, ipServer } from '../../config/App';

export default function Domain(){

     const dispatch = useDispatch();
     const app = useSelector(state => state.appReducer.app)
     const error = useSelector(state => state.appReducer.error)
     const response = useSelector(state => state.appReducer.success)

     const [tab, setTab] = React.useState((app.domain))

     React.useEffect(() => {
           (response && dispatch(changeScreenA({open: false})));
           return () => dispatch(success(false))

             //eslint-disable-next-line react-hooks/exhaustive-deps
     }, [response])

      
    return (
        <>
           <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenA({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">
                          Domínio
                     </Typography>
                     <Button onClick={() => dispatch(update(app)) } color="inherit" className="ml-auto">
                         <FaSave className="mr-2" /> Salvar
                     </Button> 
                 </Toolbar>
              </AppBar> 
              <div className="card-body scroll">
                   <h6 className="text-center mb-4 mt-4">Vamos escolhe um endereço para seu site</h6>

                   {(!tab) && 
                      <>
                         <div className="form-group">
                              <h3 className="text-center mb-4 mt-4">{ (app.subdomain) || 'seusite'}.{subdomain}</h3>
                              <label className="label-custom">Domínio Grátis</label>
                              <TextField
                                placeholder="seusite"
                                fullWidth
                                variant="outlined"
                                value={app.subdomain || ''}
                                onChange={text => {
                                     dispatch(change({ subdomain: dispatch(validateSubdomain(text.target.value)) }))
                                     if(error.subdomain && delete error.subdomain);
                                }} 
                                InputProps={{
                                   endAdornment: (
                                    <InputAdornment position="end"><strong>.{subdomain}</strong></InputAdornment>
                                   )
                                      
                                }}
                              />
                              {(error.subdomain) && 
                                 <strong className="text-danger">{error.subdomain[0]}</strong>
                              }
                         </div>
                         <div className="form-group d-flex justify-content-center mt-5">
                             <Button
                               variant="contained"
                               color="secondary"
                               onClick={() => setTab(true)}
                             >
                                 Usar meu domínio
                             </Button>
                         </div>
                      </>
                   }
                   {(tab) && 
                      <>
                        <div className="form-group">
                           <Typography className="text-center mt-4 mt-4" component="p">
                               Necessário ter um domínio resgistrado para utilizar. <br/>
                               Para registrar um domínio acesse
                               <Button color="primary" onClick={() => window.open('https://registro.br' , '_blank')}>https://registro.br</Button>
                           </Typography>
                           <label className="label-custom">Domínio</label>
                           <TextField 
                               placeholder="ex: seusite.com.br"
                               fullWidth
                               variant="outlined"
                               value={app.domain || ''}
                               onChange={ text => {
                                   dispatch(change({ domain: text.target.value }))
                                   if(error.domain && delete error.domain);
                               }}
                           />
                           {(error.domain) && 
                               <strong className="text-danger">{ error.domain[0]}</strong>
                           }
                        </div>
                        <div className="form-group d-flex justify-content-center mt-5">
                                 <Button
                                   variant="contained"
                                   onClick={() => setTab(false)}
                                 >
                                     Usar um domínio grátis
                                 </Button>      
                        </div>   
                        <div className="form-group mt-5">
                            <label className="label-custom">Configure essas 2 entradas DNS no seu domínio</label>
                            <table className="table mt-2">
                                 <tbody>
                                     <tr>
                                         <th className="border-0">Nome</th>
                                         <td className="border-0">@</td>
                                     </tr>
                                     <tr>
                                         <th>Tipo</th>
                                         <td>A</td>
                                     </tr>
                                     <tr>
                                         <th>Dados: </th>
                                         <td>{ipServer}</td>
                                     </tr>
                                 </tbody>  
                            </table>
                            <table className="table mt-5">
                                 <tbody>
                                     <tr>
                                         <th className="border-0">Nome</th>
                                         <td className="border-0">WWW</td>
                                     </tr>
                                     <tr>
                                         <th>Tipo</th>
                                         <td>A</td>
                                     </tr>
                                     <tr>
                                         <th>Dados: </th>
                                         <td>{ipServer}</td>
                                     </tr>
                                 </tbody>  
                            </table>
                        </div>  
                   
                      </>
                   }
              </div> 
        </>    
    )
}