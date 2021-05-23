import React from 'react'
import { index, destroy } from '../../store/actions/vehicles.action'
import { changeScreenC } from '../../store/actions/navigation.action';
import { Link } from 'react-router-dom'
import { Button, CircularProgress, IconButton, Menu, MenuItem, Slide, Fade, Dialog } from '@material-ui/core'
import { FaPlus, FaEllipsisV, FaClipboard, FaUser, FaLink, FaPencilAlt, FaTrash, FaShare } from 'react-icons/fa'
import { FcOpenedFolder } from 'react-icons/fc';
import { SCROLL, rootUrl } from '../../config/App'
import { Confirm } from '../components/';
import Header from '../header'
import { useDispatch, useSelector } from 'react-redux'
import Owner from './owner';

export default function Vehicles() {
    const dispatch = useDispatch()
    const vehicles = useSelector(state => state.vehiclesReducer.vehicles)
    const [ isLoading, setLoading ] = React.useState(true)
    const [ isLoadMore, setLoadMore ] = React.useState(false)
    const [ query, setQuery ] =  React.useState({ page: 1 })
    const [ state, setState ] = React.useState({
        isDeleted: null,
        menuEl: null,
        confirmEl: null,
        ownerEl: null
    })

   /* React.useEffect(() => {
        document.addEventListener('scroll', _handleScroll)
        return () => document.removeEventListener('scroll', _handleScroll)
     //eslint-disable-next-line react-hooks/exhaustive-deps
   })
   */

   React.useEffect(() => {
          _index(isLoadMore)

          //eslint-disable-next-line react-hooks/exhaustive-deps
   }, [query])

   React.useEffect(() => {
          if(isLoadMore){
             setQuery({
                 ...query,
                 page: query.page + 1
             })
          }
            //eslint-disable-next-line react-hooks/exhaustive-deps
   }, [isLoadMore])

   const _handleScroll = (event) => {
        const { scrollTop, scrollHeight, clientHeight} = event.srcElement.documentElement
        let scroll = scrollHeight - (clientHeight + scrollTop)
        if(scroll < SCROLL){ 
              if(!isLoadMore && _handleLoadMore());
        }
   }

   const _handleLoadMore = () => {
        if(vehicles.current_page < vehicles.last_page){
             setLoadMore(true);
        }
   }

   const _handleMenu = (event) => {
       setState({ menuEl: event.currentTarget })
  }

   const _index = (loadMore) => {
       dispatch(index(query, loadMore)).then(res => {
            setLoading(false)
            setLoadMore(false)
       })
   }
 

  
    const _destroy = (id) => {
        setState({ isDeleted: id })
        dispatch(destroy(id)).then(res => res && setState({isDeleted: null}))
    }

    const notes = (id) => {
           setState({menuEl: null})
           dispatch(changeScreenC({
               open: true,
               type: 'notes',
               props: {
                    uid: id,
                    type: 'vehicles'
               }
           }))
    }

    const Transition = React.forwardRef((props, ref) => {
        return <Slide direction="up" ref={ref} {...props} />
    })

    return (
        <>
            <Header title="Veiculos" />
            <div className="container mt-4 pt-3">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress/> </div> :
                    <>
                        <div className="d-flex mb-4">
                            <h3 className="font-weight-normal">Veiculos</h3>
                            <Link to="/vehicles/create" className="ml-auto">
                                <Button variant="contained" color="primary" size="large">
                                    <FaPlus size="1.5em" className="mr-2" />
                                    Cadastrar
                                </Button>
                            </Link>
                        </div>

                        <div className="card mb-5">
                            {(vehicles.data.length > 0) && 
                                <div className="card-header">
                                    <h6 className="m-0">Veiculos {vehicles.total}</h6>
                                </div>
                            }
                            {(vehicles.data.length < 1) && 
                                <div className="card-header text-center mt-5 pt-5 mb-5 pb-5">
                                     <FcOpenedFolder size="70"  />
                                     <h6 className="mt-4 text-muted">Nenhum veiculo encontrado</h6>
                                </div>
                            }

                            <div className="p-2 p-md-3">
                                {vehicles.data.map((item, index) => (
                                    <React.Fragment key={index}>
                                        <div className="d-flex">
                                            <div className="vehicle-img d-flex justify-content-center align-items-center">
                                                {(state.isDeleted === item.id) ? 
                                                    <CircularProgress color="secondary" /> :
                                                    (item.cover && <img alt="" className="shadow rounded" src={rootUrl + 'thumb/vehicles/'+item.cover.img+'?u='+item.cover.user_id+'&s='+item.cover.vehicle_id+'&w=180&h=135'} />)
                                                }
                                            </div>
                                            <div className="vehicle-detail pl-3 pl-md-4">
                                                <h6>{item.vehicle_brand.label} {item.vehicle_model.label}</h6>
                                                <strong className="d-block">{item.vehicle_version.label}</strong>
                                                {(item.vehicle_price) && 
                                                    <strong className="text-danger h5 d-block">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(item.vehicle_price)}</strong>
                                                }
                                            </div>

                                            <div className="ml-auto">
                                                <IconButton id={index} onClick={_handleMenu}>
                                                    <FaEllipsisV />
                                                </IconButton>

                                                {(Boolean(state.menuEl)) && 
                                                    <Menu
                                                        anchorEl={state.menuEl}
                                                        getContentAnchorEl={null}
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'left'
                                                        }}
                                                        transformOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right'
                                                        }}
                                                        TransitionComponent={window.innerWidth < 577 ? Transition : Fade}
                                                        open={(index === parseInt(state.menuEl.id))}
                                                        onClose={() => setState({ menuEl: null })}
                                                       
                                                    >
                                                        <MenuItem onClick={() => notes(item.id)}>
                                                            <FaClipboard size="1.2em" className="mr-4" /> Notas
                                                        </MenuItem>
                                                        <MenuItem onClick={() => setState({ownerEl: item.id})}>
                                                            <FaUser size="1.2em" className="mr-4" /> Proprietário
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <FaLink size="1.2em" className="mr-4" /> Visualizar
                                                        </MenuItem>

                                                        <div className="dropdown-divider" />

                                                        <MenuItem>
                                                            <Link to={'/vehicles/'+item.id+'/edit'}>
                                                            <FaPencilAlt size="1.2em" className="mr-4" />
                                                              Editar
                                                            </Link>
                                                          
                                                        </MenuItem>
                                                        <MenuItem onClick={() => setState({ confirmEl: item.id })}>
                                                            <FaTrash size="1.2em" className="mr-4" /> Apagar
                                                        </MenuItem>
                                                        <MenuItem>
                                                            <FaShare size="1.2em" className="mr-4" /> Compartilhar
                                                        </MenuItem>
                                                    </Menu>
                                                }
                                                {(state.confirmEl) && 
                                                   <Confirm  
                                                      open={(item.id === state.confirmEl)}
                                                      onConfirm={() => _destroy(item.id)}
                                                      onClose={() => setState({ confirmEl: null})}
                                                   />
                                                }
                                                {(state.ownerEl) &&                                                
                                                   <Dialog
                                                    open={(item.id === state.ownerEl)}
                                                    onClose={() => setState({ ownerEl: null})}
                                                   >
                                                      <Owner 
                                                         item={item}
                                                         onClose={() => setState({ ownerEl: null})}
                                                      />
                                                   </Dialog>  
                                                
                                                }
                                            </div>
                                        </div>
                                        <hr />
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>

                        {(isLoadMore) && <div className="text-center card-body"><CircularProgress /></div>}
                    </>
                }
            </div>
        </>
    )
}
