import React from 'react';

import { store, show, update, cep, change, success} from '../../store/actions/owners.action';
import { AppBar, Button, CircularProgress, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import { MdKeyboardBackspace } from 'react-icons/md';

import { useDispatch, useSelector} from 'react-redux';
import { changeScreenA, changeScreenB } from '../../store/actions/navigation.action';
import { FaSave } from 'react-icons/fa';
import MaskedInput from 'react-text-mask';

import DateFnsUtils from '@date-io/date-fns';
import { pt } from 'date-fns/locale'
import {MuiPickersUtilsProvider, KeyboardDatePicker} from '@material-ui/pickers';



 const TextMaskCustom = (props) => {
    const { inputRef, ...other } = props;
    let mask = [];

        if(props.name === 'cpf') {
            mask = [/[0-9]/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '.', /\d/, /\d/, /\d/, '-', /\d/, /\d/]
        }
        if(props.name === 'phone') {
            mask = ['(', /[0-9]/, /\d/ , ')', ' ', /\d/,  /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
            if(other.value){
                 if(other.value.length === 15){
                    mask = ['(', /[0-9]/, /\d/ , ')', ' ', /\d/,  /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/, /\d/]
                 }
            }
        }
        if(props.name === 'cep'){
             mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];
        }
   
        return (
            <MaskedInput
              {...other} 
              ref={ref => {
                   inputRef(ref ? ref.inputElement : null)
              }}
              mask={mask}
              guide={false}
           />
        )
   }

export default function OwnerEdit(props){

   
    
     const dispatch = useDispatch()
     const owner = useSelector(state => state.ownersReducer.owner)
     const error = useSelector(state => state.ownersReducer.error)
     const response = useSelector(state => state.ownersReducer.success)
     const owner_id = (props.uid) ? props.uid : null
 
     const [isLoading, setLoading] = React.useState(true);
     const [isLoadingCep, setLoadingCep] = React.useState(false);

     React.useEffect(() => {
         if(response && dispatch(changeScreenB({ open: false})));

         //eslint-disable-next-line react-hooks/exhaustive-deps
     }, [response])

     React.useEffect(() => {
        _index()
        return () => {
             dispatch(success(false))
        }
        //eslint-disable-next-line react-hooks/exhaustive-deps
     },[])

     const _index = () => {
          if(owner_id){
               dispatch(show(owner_id)).then(res => res && setLoading(false))
          }else{
               dispatch(change('clear'))
               setLoading(false)
          }
     }


      return(
          <>
               <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenB({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">
                         {(owner_id) ? 'Editar proprietário' : 'Novo proprietário'}
                     </Typography>
                     <Button onClick={() => owner_id ? dispatch(update(owner)) : dispatch(store(owner))} color="inherit" className="ml-auto">
                         <FaSave className="mr-2" /> Salvar
                     </Button> 
                 </Toolbar>
              </AppBar> 
            
            <div className="scroll card-body">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
                    <>
                        <h6 className="mb-4 text-secondary">Dados pessoais</h6>
                        <div className="form-group"> 
                             <label className="label-custom">NOME</label>
                             <TextField
                                error={(error.name) && true}
                                variant="outlined"
                                fullWidth
                                value={owner.name || ''}
                                onChange={text => {
                                   dispatch(change({ name: text.target.value}))
                                   if(error.name && delete error.name);
                                }}
                             />
                             {(error.name) && 
                               <strong className="text-danger">{error.name[0]}</strong>
                             }
                        </div>
                        <div className="form-group">
                          <h6 className="mb-4 text-secondary">TIPO DE PESSOA</h6><br/>
                          <div className="btn-group option-group" role="group">
                              <button onClick={() => dispatch(change({ type: 0 }))} className={!owner.type ? 'btn btn-primary' : 'btn btn-light'}>PESSOA FISICA</button>
                              <button onClick={() => dispatch(change({ type: 1 }))} className={owner.type ? 'btn btn-primary' : 'btn btn-light'}>PESSOA JURIDICA</button>
                          </div> 
                        </div>

                        {(!owner.type) && 
                          <div className="row">
                              <div className="col-md-6">
                                   <div className="form-group">
                                     <label className="label-custom">CPF</label>
                                     <TextField
                                        variant="outlined"
                                        fullWidth
                                        name="cpf"
                                        type="tel"
                                        autoComplete="off"
                                        InputProps={{
                                            inputComponent: TextMaskCustom,
                                            value: owner.cpf || '',
                                            onChange: text => dispatch(change({ cpf: text.target.value }))
                                        }}
                                      

                                     />
                                   </div>
                              </div> 

                              <div className="col-md-6">
                                <label className="label-custom">RG</label>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            type="tel"
                                            value={owner.rg || ''}
                                            onChange={text => dispatch(change({ rg: text.target.value}))}
                                      />
                                           
                                    </div>
                                </div>
                          
                        }

                        {(owner.type === 1) && 
                          <div className="row">
                              <div className="col-md-6">
                                   <div className="form-group">
                                     <label className="label-custom">CNPJ</label>
                                     <TextField
                                            variant="outlined"
                                            fullWidth
                                            type="tel"
                                            value={owner.cnpj || ''}
                                            onChange={text => dispatch(change({ cnpj: text.target.value}))}
                                      />
                                   </div>
                              </div> 

                              <div className="col-md-6">
                                <label className="label-custom">INSC. ESTADUAL</label>
                                        <TextField
                                            variant="outlined"
                                            fullWidth
                                            type="tel"
                                            value={owner.ie || ''}
                                            onChange={text => dispatch(change({ ie: text.target.value}))}
                                      />
                                           
                                    </div>
                                </div>                         
                        }  
                        <div className="form-group">
                          <label className="label-custom">NASCIMENTO</label>
                          <MuiPickersUtilsProvider locale={pt} utils={DateFnsUtils}>
                              <KeyboardDatePicker
                                inputVariant="outlined"
                                fullWidth
                                 format="dd/MM/yyyy"
                                 value={owner.birth ? owner.birth : null}
                                 onChange={(date => dispatch(change({birth: date})))}
                              />
                          </MuiPickersUtilsProvider>
                        </div>
                        <h6 className="mb-4 mt-4 text-secondary">Dados de contato</h6>

                        <div className="form-group">
                            <label className="label-custom">EMAIL</label>
                            <TextField
                                variant="outlined"
                                fullWidth
                                type="email"
                                value={owner.email || ''}
                                onChange={text => dispatch(change({ email: text.target.value}))}
                            />
                       </div>
                       
                       <div className="form-group">
                          <label className="label-custom">TELEFONE</label>
                          <TextField 
                            variant="outlined"
                            fullWidth
                            error={error.phone && true}
                            name="phone"
                            type="tel"
                            autocomplete="off"
                            InputProps={{
                                inputComponent: TextMaskCustom,
                                value: owner.phone,
                                onChange: text => {
                                    dispatch(change({phone: text.target.value}))
                                    if(error.phone && delete error.phone);
                                }
                            }}
                          />
                          {(error.phone) && 
                             <strong className="text-danger">{error.phone[0]}</strong>
                          }
                       </div>
                       {(owner.phone) &&
                           <div className="form-group">
                           <label className="label-custom">TELEFONE 2</label>
                           <TextField 
                             variant="outlined"
                             fullWidth
                             name="phone"
                             type="tel"
                             autocomplete="off"
                             InputProps={{
                                 inputComponent: TextMaskCustom,
                                 value: owner.phone2,
                                 onChange: text => {dispatch(change({phone2: text.target.value}))}
                             }}
                           />
                        </div>
                       }   
                       {(owner.phone2) &&
                           <div className="form-group">
                           <label className="label-custom">TELEFONE 3</label>
                           <TextField 
                             variant="outlined"
                             fullWidth
                             name="phone"
                             type="tel"
                             autocomplete="off"
                             InputProps={{
                                 inputComponent: TextMaskCustom,
                                 value: owner.phone3,
                                 onChange: text => {dispatch(change({phone3: text.target.value}))}
                             }}
                           />
                        </div>
                       }   

                    <h6 className="mb-4 mt-4 text-secondary">Endereço</h6>

                    <div className="form-group">
                        <label className="label-custom ">CEP</label>
                        <TextField 
                            style={(isLoadingCep) ? {opacity: 0.5} : {}}
                            type="tel"
                            name="cep"
                            fullWidth
                            variant="outlined"
                            label="CEP"
                        
                            InputProps={{
                                inputComponent: TextMaskCustom,                               
                                value: owner.zipCode,
                                onChange: text => {
                                        dispatch(change({ zipCode: text.target.value }))
                                        if(text.target.value.length > 8){
                                            setLoadingCep(true)
                                            dispatch(cep(text.target.value)).then(res => setLoadingCep(false))
                                         
                                        }
                                },
                                endAdornment: (
                                    <InputAdornment position="start">
                                        {(isLoadingCep) ? <CircularProgress size={20} /> : <></>}
                                    </InputAdornment>
                                ) 
                            }}
                        />
                  </div>
                   <div className="row">
                       <div className="col-md-9">
                         <div className="form-group">
                           <label className="label-custom ">CIDADE</label>
                           <TextField
                                variant="outlined"
                                fullWidth
                                disabled
                                value={owner.city || ''}
                            />
                         </div> 
                       </div>
                       <div className="col-md-3">
                       <div className="form-group">
                           <label className="label-custom ">UF</label>
                           <TextField
                                variant="outlined"
                                fullWidth
                                disabled
                                value={owner.uf || ''}
                            />
                         </div> 
                       </div>
                   </div>

                   <div className="form-group">
                        <label className="label-custom ">BAIRRO</label>
                        <TextField
                            variant="outlined"
                            fullWidth
                            value={owner.neighborhood || ''}
                            onChange={text => dispatch(change({ neighborhood: text.target.value }))}
                        />
                 </div> 
                 <div className="row">
                       <div className="col-md-9">
                         <div className="form-group">
                           <label className="label-custom ">RUA</label>
                           <TextField
                                variant="outlined"
                                fullWidth
                                value={owner.street || ''}
                                onChange={text => dispatch(change({ street: text.target.value }))}
                            />
                         </div> 
                       </div>
                       <div className="col-md-3">
                       <div className="form-group">
                           <label className="label-custom ">N°</label>
                           <TextField
                                variant="outlined"
                                fullWidth
                                value={owner.streetNumber || ''}
                                onChange={text => dispatch(change({ streetNumber: text.target.value }))}
                            />
                         </div> 
                       </div>
                   </div>

                </> 
                }
             </div>
             
          </>    
      )
}