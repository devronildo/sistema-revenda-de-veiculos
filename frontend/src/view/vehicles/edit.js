import React from 'react';
import { store, show, change, cep, indexResponse, brand, model, version, uploadPhoto, update, deletePhoto, reorderPhoto} from '../../store/actions/vehicles.action';
import {CircularProgress, TextField, InputAdornment, Select, MenuItem, FormControlLabel, Checkbox, Button} from '@material-ui/core';
import {Link, Redirect} from 'react-router-dom';
import Header from '../header';
import { Confirm } from '../components';
import MaskedInput from 'react-text-mask';
import NumberFormat from 'react-number-format'
import { rootUrl } from '../../config/App';
import {SortableContainer, SortableElement} from 'react-sortable-hoc'
import ArrayMove from 'array-move';    
import { FaTrash, FaSave } from 'react-icons/fa' 

import {useDispatch, useSelector} from 'react-redux';
import './vehicle.css';



const SortableItem = SortableElement(({value}) => 
    <div className="bg-img" style={{backgroundImage: 'url('+rootUrl+'thumb/vehicles/'+value.img+'?u='+value.user_id+'&s='+value.vehicle_id+'&h=250&w=250)'}}></div>
);

const SortableList = SortableContainer(({children}) => { 
   return <div className="row">{children}</div>    
});


const TextMaskCustom = (props) => {
     const {inputRef, ...other} = props;
     let mask = [/[0-9]/, /\d/, /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/];

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



const NumberFormatCustom = (props) => {
     const { inputRef, onChange, ...other } =  props;
     return (
           <NumberFormat
               {...other}
               onValueChange={values => {
                     onChange({
                          target: {
                                value: values.value
                          }
                     })
               }}
               decimalSeparator=","
               thousandSeparator="."
               prefix={other.name}
           />
     )   
}

export default function VehicleEdit(props){

    const dispatch = useDispatch();
    const data = useSelector(state => state.vehiclesReducer)

    const [state, setState] = React.useState({
         isLoadingCep: false,
         isDeleted: null,
         redirect: false,
         tips: 0,
         confirmEl: null,
         
     })
     
     const vehicle_id = (props.match.params.id) ? props.match.params.id : null;
     const [isLoading, setLoading] = React.useState(true);

     React.useEffect(() => {
          const index = () => {
               if(vehicle_id){
                     dispatch(show(vehicle_id)).then(res => res && setLoading(false))
     
               }else{
                    dispatch(store()).then(res => res && setLoading(false))
               }
          }

         index();    
    }, [dispatch, vehicle_id])    

    React.useEffect(() => {
        return () => {
            dispatch(indexResponse({success: false}))
        }  
          
    }, [])

  

     const handleUpload = (event) => {
          [...event.target.files].map(img => {
                const body = new FormData();
                body.append('file', img);
                body.append('id', data.vehicle.id);
                return dispatch(uploadPhoto(body));
          })
          if(data.error.vehicle_photos && delete data.error.vehicle_photos);
    }
    const _deletePhoto = (id) => {
          setState({ 
               ...state,
               isDeleted: id
           })
          dispatch(deletePhoto(id)).then(res => res && setState({
                ...state,
                isDeleted: null
               }))
    }

    const handleConfirm = event => {
     setState({confirmEl: event.currentTarget });
  }
  
    const onSortEnd = ({oldIndex, newIndex}) => {
          let items = ArrayMove(data.vehicle.vehicle_photos, oldIndex, newIndex)
          let order = items.map(({id}) => id);
          dispatch(reorderPhoto({order: order}, items));
    }



     return(
          <>
              {(data.success) && <Redirect to="/vehicles" />}
                <Header title="Veiculos - gestão" button={<Button onClick={() => dispatch(update(data.vehicle)) } color="inherit" className="ml-auto">Salvar</Button>} /> 
                 <div className="container mt-4 pt-3">
                     {(isLoading) ?
                       <div className="d-flex justify-content-center mt-5 pt-5">
                            <CircularProgress/>
                       </div>
                        :
                       <div className="row">
                           <div className="col-md-7">
                               <h3 className="font-weight-normal mb-4">Localização do Veiculo</h3>
                               <div className="card card-body" onClick={() => setState({ ...state, tips: 0 })}>
                                   <div className="row">
                                       <div className="col-md-7 form-group">
                                           <label className="label-custom ">CEP</label><br/>
                                           <TextField 
                                              style={(state.isLoadingCep) ? {opacity: 0.5} : {}}
                                              error={(data.error.zipCode) && true}
                                              type="tel"
                                              variant="outlined"
                                              label="CEP"
                                            
                                              InputProps={{
                                                   inputComponent: TextMaskCustom,
                                                 
                                                   value: data.vehicle.zipCode,
                                                   onChange: text => {
                                                         dispatch(change({ zipCode: text.target.value }))
                                                         if(text.target.value.length > 8){
                                                               setState({
                                                                     ...state,
                                                                    isLoadingCep: true
                                                                 })
                                                               dispatch(cep(text.target.value)).then(res => res && setState({...state, isLoadingCep:false}))
                                                               if(data.error.zipCode){
                                                                     delete data.error.zipCode;
                                                                     delete data.error.uf;
                                                                     delete data.error.city;
                                                               }
                                                            }
                                                   },
                                                   endAdornment: (
                                                        <InputAdornment position="start">
                                                            {(state.isLoadingCep) ? <CircularProgress size={20} /> : <></>}
                                                        </InputAdornment>
                                                   ) 
                                              }}
                                           />

                                           {(data.error.zipCode) && 
                                               <strong className="text-danger">{data.error.zipCode[0]}</strong>
                                           }
                                       </div>
                                   </div>
                                   <div className="row">
                                       <div className="col-md-9 form-group">
                                         <label className="label-custom">CITY</label><br/>
                                          <TextField
                                             error={(data.error.city) && true}
                                             disabled
                                             value={data.vehicle.city || ''}                                       
                                             variant="outlined"
                                             fullWidth
                                            
                                          />
                                           {(data.error.city) && 
                                               <strong className="text-danger">{data.error.city[0]}</strong>
                                           }
                                       </div>
                                       <div className="col-md-3 form-group">
                                           <label className="label-custom">UF</label><br/>
                                             <TextField
                                                       error={(data.error.uf) && true}
                                                       disabled
                                                       value={data.vehicle.uf  || ''}
                                                       variant="outlined"
                                                      
                                                  />
                                                  {(data.error.uf) && 
                                                       <strong className="text-danger">{data.error.uf[0]}</strong>
                                                  }
                                        </div>
                                   </div>
                               </div>
                               <h3 className="font-weight-normal mt-4 mb-4">Dados do Veiculo</h3>
                                <div className="card card-body" onClick={() => setState({ ...state, tips: 1 })} >
                                <div>
                                     </div>     
                                      <div className="form-group">
                                         <label className="label-custom">CATEGORIA</label><br/>
                                         <Select
                                            error={data.error.vehicle_type && true }
                                            value={data.vehicle.vehicle_type  || ''}
                                            fullWidth
                                            variant="outlined" 
                                            onChange={event => {
                                                      dispatch(change({
                                                            vehicle_type: event.target.value,
                                                            vehicle_brand: null,
                                                            vehicle_model: null,
                                                            vehicle_version: null,
                                                            vehicle_gearbox: null,
                                                            vehicle_fuel: null,
                                                            vehicle_steering: null,
                                                            vehicle_motorpower: null,
                                                            vehicle_doors: null
                                                      }))

                                                    dispatch(brand(event.target.value)) 
                                                    if(data.error.vehicle_type){
                                                        delete data.error.vehicle_type
                                                    } 
                                            }} 

                                         >
                                              {data.vehicle_types.map(item => (
                                                    <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                              ))}
                                         </Select>
                                         {(data.error.vehicle_type) && 
                                           <strong className="text-danger">{data.error.vehicle_type[0]}</strong>
                                        }
                                      </div>

                                      <div className="form-group">
                                      <label className="label-custom">MARCAS</label><br/>
                                      <Select
                                         error={data.error.vehicle_brand && true}
                                         value={data.vehicle.vehicle_brand || ''}
                                         fullWidth
                                         variant="outlined" 
                                         onChange={event => {
                                                dispatch(change({
                                                      vehicle_brand: event.target.value,
                                                      vehicle_model: null,
                                                      vehicle_version: null
                                                }))
                                                dispatch(model(data.vehicle.vehicle_type, event.target.value))
                                                if(data.error.vehicle_brand){
                                                         delete data.error.vehicle_brand
                                                }
                                         }}
                                         
                                      >
                                         {data.vehicle_brand.map(item => (
                                               <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                         ))}
                                      </Select>
                                      {(data.error.vehicle_brand) && 
                                           <strong className="text-danger">{data.error.vehicle_brand[0]}</strong>
                                        }
                                     
                                      </div>
                                      <div className="row">
                                           <div className="col-md-6 form-group">
                                              <label className="label-custom">MODELO</label><br/>
                                              <Select
                                                 fullWidth
                                                 variant="outlined" 
                                                 error={data.error.vehicle_model && true}
                                                 value={data.vehicle.vehicle_model || ''}
                                                 onChange={event => {
                                                       dispatch(change({
                                                             vehicle_model: event.target.value,
                                                             vehicle_version: null
                                                       }))
                                                       dispatch(version(data.vehicle.vehicle_brand, event.target.value))
                                                       if(data.error.vehicle_model){
                                                            delete data.error.vehicle_model
                                                       }
                                                 }}
                                               >
                                                      {data.vehicle_model.map(item => (
                                                      <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                         ))}                                
                                              </Select>
                                              {(data.error.vehicle_model) && 
                                                 <strong className="text-danger">{data.error.vehicle_model[0]}</strong>
                                              }
                                                
                                           </div>
                                           <div className="col-md-6 form-group">
                                              <label className="label-custom">ANO MODELO</label><br/>
                                              <Select
                                                fullWidth
                                                variant="outlined" 
                                                error={data.error.vehicle_regdate && true}
                                                value={data.vehicle.vehicle_regdate || ''}
                                                onChange={event => {
                                                      dispatch(change({ vehicle_regdate: event.target.value }))
                                                      if(data.error.vehicle_regdate){
                                                           
                                                       delete data.error.vehicle_regdate
                                                      }
                                                }}
                                              >        
                                              {data.regdate.map(item => (
                                                      <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                              ))}
                                              </Select>
                                              {(data.error.vehicle_regdate) && 
                                                 <strong className="text-danger">{data.error.vehicle_regdate[0]}</strong>
                                              }
                                           </div>
                                      </div>
                                      <div className="form-group">
                                        <label className="label-custom">VERSÃO</label><br/>
                                        <Select
                                          fullWidth
                                          variant="outlined" 
                                          error={data.error.vehicle_version && true}
                                          value={data.vehicle.vehicle_version || ''}
                                          onChange={event => {
                                                dispatch(change({vehicle_version: event.target.value}))
                                                if(data.error.vehicle_version){
                                                   delete data.error.vehicle_version
                                                 }
                                          }}

                                        >
                                               {data.vehicle_version.map(item => (
                                                      <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                              ))}
                                        </Select>
                                        {(data.error.vehicle_version) && 
                                             <strong className="text-danger">{data.error.vehicle_version[0]}</strong>
                                         }
                                      </div>
                                  
                                </div>
                                <div className="card card-body mt-4 mb-4" onClick={() => setState({ ...state, tips: 1 })}>
                                   <div className="row">
                                     {/* INICIO MOSTRA SE FOR CARRO */ }    
                                    {(data.vehicle.vehicle_type === 2020) && 
                                     <>
                                        <div className="col-md-6 form-group">
                                             <label className="label-custom">CÂMBIO</label>
                                             <Select 
                                                  fullWidth
                                                  variant="outlined" 
                                                  value={data.vehicle.vehicle_gearbox || ''}
                                                  onChange={event => dispatch(change({vehicle_gearbox: event.target.value}))}
                                             
                                             >
                                                  {data.gearbox.map(item => (
                                                       <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                  ))}


                                             </Select>
                                        </div>
                                        <div className="col-md-6 form-group">
                                        <label className="label-custom">COMBUSTÍVEL</label>
                                        <Select 
                                             fullWidth
                                             variant="outlined" 
                                             value={data.vehicle.vehicle_fuel || ''}
                                             onChange={event => dispatch(change({vehicle_fuel: event.target.value}))}
                                             
                                         >
                                                  {data.fuel.map(item => (
                                                       <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                  ))}


                                        </Select>
                                        </div>
                                        <div className="col-md-6 form-group">
                                        <label className="label-custom">DIREÇÃO</label>
                                        <Select 
                                              fullWidth
                                              variant="outlined" 
                                               value={data.vehicle.vehicle_steering || ''}
                                               onChange={event => dispatch(change({vehicle_steering: event.target.value}))}
                                             
                                             >
                                               {data.car_steering.map(item => (
                                                     <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                              ))}


                                        </Select>
                                        </div>
                                        <div className="col-md-6 form-group">
                                        <label className="label-custom">POTÊNCIA DO MOTOR</label>
                                        <Select 
                                               fullWidth
                                               variant="outlined" 
                                               value={data.vehicle.vehicle_motorpower || ''}
                                               onChange={event => dispatch(change({vehicle_motorpower: event.target.value}))}
                                             
                                             >
                                                  {data.motorpower.map(item => (
                                                       <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                  ))}


                                             </Select>
                                        </div> 
                                        <div className="col-md-6 form-group">
                                        <label className="label-custom">PORTAS</label>
                                        <Select 
                                                  fullWidth
                                                  variant="outlined" 
                                                  value={data.vehicle.vehicle_doors || ''}
                                                  onChange={event => dispatch(change({vehicle_doors: event.target.value}))}
                                             
                                             >
                                                  {data.doors.map(item => (
                                                       <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                  ))}


                                             </Select>
                                        </div> 
                                   </> 
                              }
                                {/* TERMINA SE FOR CARRO */ }
                                {/* INICIO SE FOR MOTO */ }    
                                     {(data.vehicle.vehicle_type === 2060) &&
                                      <div className="col-md-6 form-group">
                                        <label className="label-custom">CILINDRADAS</label>
                                          <Select 
                                                  fullWidth
                                                  variant="outlined" 
                                                  value={data.vehicle.vehicle_cubiccms || ''}
                                                  onChange={event => dispatch(change({vehicle_cubiccms: event.target.value}))}
                                             
                                             >
                                                  {data.cubiccms.map(item => (
                                                       <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                  ))}


                                          </Select>
                                      </div> 

                                     }
                                {/* TERMINA SE FOR MOTO */ } 
                                <div className="col-md-6 form-group">
                                      <label className="label-custom">COR</label>
                                        <Select 
                                                fullWidth
                                                variant="outlined" 
                                                value={data.vehicle.vehicle_color || ''}
                                                onChange={event => dispatch(change({vehicle_color: event.target.value}))}
                                           
                                           >
                                                {data.carcolor.map(item => (
                                                     <MenuItem key={item.id} value={item.value}>{item.label}</MenuItem>
                                                ))}


                                        </Select>
                                    </div> 
                                    <div className="col-md-6 form-group">
                                      <label className="label-custom">QUILOMETRAGEM</label>
                                       <TextField 
                                           type="tel"
                                           fullWidth
                                           variant="outlined" 
                                           InputProps={{
                                                 inputComponent: NumberFormatCustom,
                                                 value: data.vehicle.vehicle_mileage || '',
                                                 onChange: text => dispatch(change({vehicle_mileage: text.target.value}))
                                           }}

                                       />

                                       
                                    </div> 
                                                
                         </div> 
                    </div>    
                      {(data.vehicle.vehicle_type) &&
                     <>
                     <h3 className="font-weight-normal mb-4">Itens e opcionais</h3>
                     <div className="card card-body" onClick={() => setState({ ...state, tips: 1 })}>
                           <div className="row">
                                {data.features.map(item => (item.vehicle_type_id === data.vehicle.vehicle_type)  && (
                                      <div key={item.id} className="col-md-6">
                                      <FormControlLabel
                                        control={
                                             <Checkbox
                                                  checked={data.vehicle.vehicle_features[item.value] ? true : false}
                                                  onChange={() => {
                                                        let checked = data.vehicle.vehicle_features[item.value] ? 
                                                         delete data.vehicle.vehicle_features[item.value] :
                                                         {[item.value] : item}
                                                         dispatch(change({vehicle_features: {
                                                               ...data.vehicle.vehicle_features,
                                                               ...checked
                                                         }}))
                                                  }}
                                                
                                             />
                                        }
                                          label={item.label}
                                        />
                                      </div>
                                  
                                ))}
                           </div>
                     </div>
                     </>
                        }
                     <h3 className="font-weight-normal mb-4">Financeiro</h3>
                     <div className="card card-body">
                          <div className="form-group">
                             <label className="label-custom">Estado Financeiro</label>
                             <div className="row">
                                {data.financial.map(item => (
                                      <div key={item.id} className="col-md-6">
                                      <FormControlLabel
                                        control={
                                             <Checkbox
                                                  checked={data.vehicle.vehicle_financial[item.value] ? true : false}
                                                  onChange={() => {
                                                        let checked = data.vehicle.vehicle_financial[item.value] ? 
                                                         delete data.vehicle.vehicle_financial[item.value] :
                                                         {[item.value] : item}
                                                         dispatch(change({vehicle_financial: {
                                                               ...data.vehicle.vehicle_financial,
                                                               ...checked
                                                         }}))
                                                  }}
                                                
                                             />
                                        }
                                          label={item.label}
                                        />
                                      </div>
                                  
                                ))}
                           </div>
                          </div>
                          <div className="row">
                               <div className="col-md-6 form-group">
                                       <label className="label-custom">PREÇO</label>
                                       <TextField 
                                          type="tel"
                                          name="R$ "
                                          fullWidth
                                          variant="outlined" 
                                          InputProps={{
                                                inputComponent: NumberFormatCustom,
                                                value: data.vehicle.vehicle_price || '',
                                                onChange: text => {
                                                      dispatch(change({ vehicle_price: text.target.value }))
                                                      if(data.error.vehicle_price){
                                                            delete data.error.vehicle_price
                                                      }
                                                }
                                          }}
                                       />

                                       {(data.error.vehicle_price) && 
                                         <strong className="text-danger">{data.error.vehicle_price[0]}</strong>
                                       }

                               </div>
                          </div>
                     </div>
                     <h3 className="font-weight-normal mb-4 mt-4">Descrição do anúncio</h3>
                     <div className="card card-body">
                          <div className="form-group">
                               <label className="label-custom">TITULO</label>
                               <TextField
                                   fullWidth
                                   variant="outlined"
                                  value={data.vehicle.title || ''}
                                  onChange={text => dispatch(change({ title: text.target.value}))}
                                  onFocus={() => setState({ ...state, tips: 2})}
                               />
                          </div>
                          <div className="form-group">
                               <label className="label-custom">DESCRIÇÃO</label>
                               <TextField
                                  
                                  rows="5"
                                  rowsMax="5"
                                  fullWidth
                                  variant="outlined"
                                  value={data.vehicle.description || ''}
                                  onChange={text => dispatch(change({ description: text.target.value}))}
                                  onFocus={() => setState({ ...state, tips: 3})}
                               />
                          </div>
                     </div>
                     <h3 className="font-weight-normal mb-4  mt-4">Fotos</h3>
                     <div className="card card-body mb-5">
                          {(data.error.vehicle_photos) && 
                             <strong className="text-danger">{data.error.vehicle_photos[0]}</strong>
                          }
                          <SortableList axis="xy" onSortEnd={onSortEnd}>
                                {data.vehicle.vehicle_photos.map((item, index) => (
                                      <div key={item.id} className="col-6 col-md-4">
                                             <div className="box-image box-upload d-flex justify-content-center align-items-center mt-3">
                                                   {(state.isDeleted === item.id) ?
                                                     <CircularProgress size="30" color="secondary" /> 
                                                     :
                                                     <>
                                                       <span id={item.id} onClick={handleConfirm} className="img-action d-flex justify-content-center align-items-center">
                                                             <div className="app-icon d-flex">
                                                                 <FaTrash color="#fff" size="1.2em"/>
                                                             </div>
                                                       </span>
                                                       <SortableItem 
                                                          key={'item-'+item.id}
                                                          index={index}
                                                          value={item}
                                                       />
                                                       {(Boolean(state.confirmEl)) && 
                                                          <Confirm
                                                              open={(item.id === parseInt(state.confirmEl.id))}
                                                              onConfirm={() => _deletePhoto(item.id)}
                                                              onClose={() => setState({...state, confirmEl: null})}
                                                          />
                                                       }
                                                     </> 
                                                  }
                                             </div>
                                      </div>
                                ))}
                                <div className="col-6 col-md-4">
                                   <div className="box-image box-upload d-flex justify-content-center align-items-center mt-3">
                                            <input onClick={() => setState({...state, tips: 4})} onChange={handleUpload} type="file" multiple name="file" className="file-input" />
                                            {(data.upload_photo) ? <CircularProgress /> : 
                                               <p className="box-text">
                                                   <span className="text-plus">+</span>
                                                   <span>Adicionar fotos</span>
                                               </p>
                                            }
                                   </div>
                                </div>
                          </SortableList>
                     </div>

               </div>
               <div className="col-md-5 d-none d-md-block">
                      <div className="tips">
                           <h3 className="font-weight-normal mb-4">Dicas</h3>
                           <div className="card card-body">
                                  {(state.tips === 0) && 
                                        <>
                                             <h5>Endereço</h5>
                                             <p>O endereço é a primeira informação que os consumidores procuram quando estão pesquisando Veiculos. <br/><br/>Anúncios com <strong>endereço</strong> terão mais oportunidades de serem exibidos nas novas formas de buscas, e receber mais contatos.</p>
                                        </>          
                                   }
                                   {(state.tips === 1) && 
                                        <>
                                             <h5>Dados verídicos</h5>
                                             <p>Informe os dados corretos <br/>(quilometragem, ano modelo, versão, etc.) <br/>para conseguir o comprador rapidamente.</p>
                                        </>
                                   }
                                   {(state.tips === 2) && 
                                        <>
                                             <h5>Título</h5>
                                             <p>Sugerimos complementar o título com caracteristicas do seu carro.<br/>Ex: Fiat Palio 2004 em perfeito estado.</p>
                                        </>
                                   }
                                   {(state.tips === 3) && 
                                        <>
                                             <h5>Descrição</h5>
                                             <p>Inclua caracteristicas do carro, como ar condicionado, vidros e travas elétricas, alarme, som, DVD, air bag duplo, IPVA pago, duvidas pendentes etc.</p>
                                        </>
                                   }
                                   {(state.tips === 4) && 
                                        <>
                                             <p>
                                                  <strong>Fotos reais:</strong> Envie fotos reais do seu carro, assim aumenta suas chances de convencer o pontencial comprador.<br/><br/>
                                                  <strong>Todos os ângulos:</strong> Além das fotos do exterior do carro, não se esqueça de mostrar o interior.
                                             </p>
                                        </>

                               }
                           </div>
                      </div>
                       <div className="d-flex btn-save">
                             <Link to="/vehicles" className="mr-2">
                                  <Button variant="contained" size="large">Voltar</Button>
                             </Link>
                             <Button onClick={() => dispatch(update(data.vehicle))} variant="contained" color="primary" size="large">
                                <FaSave size="1.5rem" className="mr-3" /> 
                                Salvar
                             </Button>

                       </div>
               </div>
                           
               </div>
                     }
               </div>    
          </>
     )
}