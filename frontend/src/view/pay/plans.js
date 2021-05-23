import React from 'react';
import { change, plans } from '../../store/actions/pay.action';
import { useDispatch, useSelector} from 'react-redux';
import { Button, CircularProgress, Divider } from '@material-ui/core';

export default function Plans(){

     const dispatch = useDispatch()
     const data = useSelector(state => state.payReducer.plans);

     const [isLoading, setLoading] = React.useState(true)

     React.useEffect(() => {
          dispatch(plans()).then(res => res && setLoading(false))  
     }, [])

     return ( 
          <div className="container mt-4 pt-3">
             {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress/> </div> :
                 <>
                     <h3 className="font-weight-normal mb-4">Nossos Planos</h3>

                     <div className="row">
                          {data.map((item, index) => (
                               <div key={index} className="col-md-4 mb-4">
                                  <div className="card">
                                        <div className="card-body text-center">
                                             <h4 className="text-uppercase font-weight-bold mt-2 mb-0">{item.title}</h4>
                                        </div>
                                        <Divider />
                                        <div className="card-body text-center">
                                           <h5>
                                                {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.price)}
                                                <span className="badge badge-success ml-2">{item.discount}</span>
                                           </h5>
                                          <label>Equivalente a</label>
                                          <h3 className="mt-2 mb-4 h1">
                                                {new Intl.NumberFormat('pt-BR', {style: 'currency', currency: 'BRL'}).format(item.equivalent)}
                                                <span className="btn-sm p-0">/mês</span>
                                           </h3>
                                        </div> 
                                        <div className="card-body">
                                               <Button
                                                fullWidth
                                                variant="contained"
                                                color="primary"
                                                size="large"
                                                className="mt-2 mb-4"
                                                onClick={() => dispatch(change({ plan: item}))}
                                               >
                                                     Contratar
                                               </Button>
                                        </div>   

                                  </div>
                               </div>
                          ))}
                     </div>
                 </>
               }   
          </div>
          
     )
}