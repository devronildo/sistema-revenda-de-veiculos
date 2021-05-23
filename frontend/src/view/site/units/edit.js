import { AppBar, Button, CircularProgress, IconButton, InputAdornment, TextField, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { FaSave } from 'react-icons/fa';
import { MdKeyboardBackspace } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux'
import MaskedInput from 'react-text-mask';
import { changeScreenB } from '../../../store/actions/navigation.action';
import { cep, change, show, store, success, update } from '../../../store/actions/units.action';

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
 

export default function UnitEdit(props) { 
   
     const dispatch = useDispatch()
     const unit = useSelector(state => state.unitsReducer.unit)

     const error = useSelector(state => state.unitsReducer.error)
     const response = useSelector(state => state.unitsReducer.success)
     const unit_id = (props.uid) ? props.uid : null
 
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
           if(unit_id){
                dispatch(show(unit_id)).then(res => res && setLoading(false))
           }else{
                dispatch(change('clear'))
                setLoading(false)
           }
      }
 
 
 
     return (
          <>
             <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenB({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">
                         {(unit_id) ? 'Editar unidade' : 'Nova unidade'}
                     </Typography>
                     <Button onClick={() => unit_id ? dispatch(update(unit)) : dispatch(store(unit))} color="inherit" className="ml-auto">
                         <FaSave className="mr-2" /> Salvar
                     </Button> 
                 </Toolbar>
              </AppBar> 

              <div className="card-body scroll">
                    {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
                         <>
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
                                        value: unit.phone,
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
                              {(unit.phone) &&
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
                                        value: unit.phone2,
                                        onChange: text => {dispatch(change({phone2: text.target.value}))}
                                   }}
                                   />
                              </div>
                              }   
                              {(unit.phone2) &&
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
                                        value: unit.phone3,
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
                                        value: unit.zipCode,
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
                                        value={unit.city || ''}
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
                                        value={unit.uf || ''}
                                   />
                              </div> 
                              </div>
                         </div>

                         <div className="form-group">
                              <label className="label-custom ">BAIRRO</label>
                              <TextField
                                   variant="outlined"
                                   fullWidth
                                   value={unit.neighborhood || ''}
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
                                        value={unit.street || ''}
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
                                        value={unit.streetNumber || ''}
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