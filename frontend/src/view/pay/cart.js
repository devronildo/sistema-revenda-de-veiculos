import { Button, Divider } from '@material-ui/core';
import React from 'react';
import { useDispatch, useSelector} from 'react-redux'
import { change } from '../../store/actions/pay.action';
import { MdAccountBalance, MdCreditCard, MdViewWeek } from 'react-icons/md'
import Payment from './payment';

export default function Cart(){

     const dispatch = useDispatch();
     const plan = useSelector(state => state.payReducer.plan)
     const pay_type =  useSelector(state => state.payReducer.pay_type)

     return ( 
          <div className="container mt-4 pt-3">
                 <h3 className="font-weight-normal mb-4">Pagamento</h3>

                 <div className="row">
                      <div className="col-md-4 mb-4">
                        <div className="card">
                              <div className="card-body text-center">
                                   <h4 className="text-uppercase font-weight-bold mt-2 mb-0">{plan.title}</h4>
                              </div>
                              <Divider />
                              <div className="card-body text-center">
                                   <h5>
                                        {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(plan.price)}
                                        <span className="badge badge-success ml-2">{plan.discount}</span>
                                   </h5>
                                   <label>Equivalente a</label>
                                   <h3 className="mt-2 mb-4 h1">
                                        {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(plan.equivalent)}
                                        <span className="btn-sm p-0">/mês</span>
                                   </h3>
                               </div> 
                                <Divider />
                              <div className="card-body text-center">
                                   <h5 className="mb-3">Total de  {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(plan.price)} </h5>
                                        <Button
                                        fullWidth
                                        variant="contained"
                                        className="mt-2 mb-4"
                                        onClick={() => dispatch(change({ plan: {}}))}
                                        >
                                             Trocar plano
                                        </Button>
                              </div>   

                          </div>
                     </div>
                     <div className="col-md-5">
                        <div className="card card-body">
                             {(!pay_type) && 
                                <>
                                   <div className="form-group">
                                        <label className="label-custom">Como você prefere pagar?</label>
                                   </div>
                                   <div className="d-flex pointer" onClick={() => dispatch(change({pay_type: 'card'}))}>
                                         <MdCreditCard className="display-4" />
                                         <div className="ml-4 d-flex flex-column align-items-center">
                                               <label className="h5 mb-1 mr-auto">Cartão</label>
                                               <label className="text-muted mr-auto">Crédito</label>
                                         </div>
                                   </div>  
                                   <hr />   
                                   <div className="d-flex pointer" onClick={() => dispatch(change({pay_type: 'pec'}))}>
                                         <MdAccountBalance className="display-4" />
                                         <div className="ml-4 d-flex flex-column align-items-center">
                                               <label className="h5 mb-1 mr-auto">Pagamento na lotérica</label>
                                               <label className="text-muted mr-auto">O seu pagamento será aprovado em até 1 hora</label>
                                         </div>
                                   </div>
                                   <hr /> 
                                   <div className="d-flex pointer" onClick={() => dispatch(change({pay_type: 'bolbradesco'}))}>
                                         <MdViewWeek className="display-4" />
                                         <div className="ml-4 d-flex flex-column align-items-center">
                                               <label className="h5 mb-1 mr-auto">Boleto Bancário</label>
                                               <label className="text-muted mr-auto">O seu pagamento será aprovado em até 1 ou 3 dias uteis</label>
                                         </div>
                                   </div> 
                                </>
                             }
                             {(pay_type) && <Payment />}
                        </div>
                     </div>
                 </div>
          </div>
          
     )
}