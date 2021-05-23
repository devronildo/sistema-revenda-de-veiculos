import React from 'react';
import { index, destroy } from '../../store/actions/owners.action'
import { AppBar, Fab, IconButton, Toolbar, Typography, Slide, Fade, CircularProgress, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Menu, MenuItem } from '@material-ui/core';
import { MdKeyboardBackspace, MdMoreHoriz, MdPersonAdd } from 'react-icons/md';
import { changeScreenA, changeScreenB, changeScreenC } from '../../store/actions/navigation.action';
import { useDispatch, useSelector} from 'react-redux';
import { SCROLL } from '../../config/App';
import { FaCar, FaClipboard, FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { FcOpenedFolder } from 'react-icons/fc';
import { Confirm } from '../components';

export default function Owners(props){
    const dispatch = useDispatch()
    const owners = useSelector(state => state.ownersReducer.owners)
    const vehicle_id = props.props.vehicle_id || null 

    const [ isLoading, setLoading ] = React.useState(true)
    const [ isLoadMore, setLoadMore ] = React.useState(false)
    const [ query, setQuery ] =  React.useState({
        page: 1, 
    })

    const [ state, setState ] = React.useState({
        isDeleted: null,
        menuEl: null,
        confirmEl: null,
        confirmOwnerEl: null
    })

   /* React.useEffect(() => {
        document.getElementById('scroll').addEventListener('scroll', _handleScroll)
        return () => document.getElementById('scroll').removeEventListener('scroll', _handleScroll)
        //eslint-disable-next-line react-hooks/exhaustive-deps
    })*/

   

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
        let scrollTop = event.srcElement.scrollHeight - (event.srcElement.offsetHeight + event.srcElement.scrollTop)
        if(scrollTop < SCROLL) {
            if(!isLoadMore && _handleLoadMore());
        }
    }

    const _handleLoadMore = () => {
         if(owners.current_page < owners.last_page){
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
  

    const _create = () => {
        dispatch(changeScreenB({
            open: true,
            type: 'owner-edit',
            props: {}
        }));
    }

    const _show = (item) => {
        setState({ menuEl: null })
        dispatch(changeScreenB({
            open: true,
            type: 'owner-show',
            props: {
                item: item
            }
        }))
    }

    const _edit = (id) => {
         setState({ menuEl: null })
         dispatch(changeScreenB({
              open: true,
              type: 'owner-edit',
              props: {
                  uid: id
              }
         }))
    }

    const _destroy = (id) => {
          setState({ isDeleted: id, menuEl: null})
          dispatch(destroy(id)).then(res => res && setState({isDelete: null}))
    }

    const _notes = (id) => {
        setState({ menuEl: null })
        dispatch(changeScreenC({
            open: true,
            type: 'notes',
            props: {
                 type: 'owners',
                 uid: id
            }
        }))
    }

    const _vehicles = (owner_id) => {
        setState({ menuEl: null})
        dispatch(changeScreenB({
            open: true,
            type: 'owner-vehicles',
            props: {
                 uid: owner_id
            }
        }))
    }

    const Transition = React.forwardRef((props, ref) => {
        return <Slide direction="up" ref={ref} {...props} />
     })

    return (
        <>
         <AppBar position="absolute">
                 <Toolbar>
                     <IconButton onClick={() => dispatch(changeScreenA({open: false}))} edge="start" color="inherit">
                        <MdKeyboardBackspace />
                     </IconButton>
                     <Typography variant="h6" color="inherit">Proprietários</Typography>
                 </Toolbar>
         </AppBar> 

         <div id="scroll" className="scroll">
                {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress/> </div> :
                    <> 
                        {(owners.data.length > 0 ) &&
                        <div className="card-body">
                            <h6 className="m-0">{owners.total} {(owners.total > 1) ? 'proprietários encontradas': 'proprietário encontrado'}</h6>
                        </div>               
                            }

                        {(owners.data.length < 1) &&
                            <div className="text-center mt-5 mb-5 pt-5 pb-5">
                                    <FcOpenedFolder size="70" />
                                <h6 className="mt-4 text-muted">Nenhuma proprietário encontrada</h6>
                            </div>
                        } 

                        <List>
                          {owners.data.map((item, index) => (
                              <React.Fragment key={index}> 
                                   <ListItem button selected={state.isDeleted === item.id}>
                                      <ListItemAvatar onClick={() => _show(item)}>
                                          <Avatar className="bg-primary">
                                             {item.name.slice(0,1)}
                                          </Avatar>
                                      </ListItemAvatar>
                                      <ListItemText onClick={() => _show(item)}  className="pb-3 pt-3" primary={item.name} />
                                      {(state.isDeleted === item.id) && 
                                         <CircularProgress className="mr-2"  color="secondary" />
                                      }
                                      {(vehicle_id) && 
                                        <IconButton onClick={() => setState({confirmOwnerEl: item.id})}><MdPersonAdd /></IconButton>
                                      }
                                        {( state.confirmOwnerEl)  &&
                                            <Confirm
                                               open={(item.id === state.confirmOwnerEl)}
                                               onConfirm={() => {
                                                   props.props.onSelected(item)
                                                   dispatch(changeScreenA({open: false}))
                                               }}
                                               onClose={() => setState({confirmOwnerEl: null })}
                                               title="Deseja adicionar esse proprietário ao veiculo ?"
                                            /> 
                                         }
                                      {
                                         (!state.isDeleted && !vehicle_id) &&
                                         <div>
                                         <IconButton id={index} onClick={_handleMenu}>
                                             <MdMoreHoriz />
                                         </IconButton>
                                         {(Boolean(state.menuEl)) && 
                                             <Menu
                                               anchorEl={state.menuEl}
                                               transformOrigin={{ vertical: 'top', horizontal: 'right'}}
                                               TransitionComponent={window.innerWidth <  577 ? Transition : Fade}
                                               open={(index === parseInt(state.menuEl.id))}
                                               onClose={() => setState({menuEl: null})}
                                            >
                                                <MenuItem onClick={() => _notes(item.id)}> 
                                                   <FaClipboard size="1.2em" className="mr-4"/> Notas
                                               </MenuItem>
                                               <MenuItem onClick={() => _vehicles(item.id)}> 
                                                   <FaCar size="1.2em" className="mr-4"/> Veiculos
                                               </MenuItem>
                                                <Divider />
                                               <MenuItem onClick={() => _edit(item.id)}> 
                                                   <FaPencilAlt size="1.2em" className="mr-4"/> Editar
                                               </MenuItem>
                                               <MenuItem onClick={() => setState({ confirmEl: item.id }) }> 
                                                   <FaTrash size="1.2em" className="mr-4"/> Apagar
                                               </MenuItem>
                                             </Menu>
                                         }
                                         {( state.confirmEl)  &&
                                            <Confirm
                                               open={(item.id === state.confirmEl)}
                                               onConfirm={() => _destroy(item.id)}
                                               onClose={() => setState({confirmEl: null })}
                                            /> 
                                         }
                                         </div>
                                          
                                      }
                                   </ListItem>
                                   <Divider />
                              </React.Fragment>
                          ))}
                        </List>
                        {(isLoadMore) && <div className="text-center card-body"><CircularProgress /></div>}
                    </>
                }     
             <Fab onClick={() => _create()} className="fab-bottom-right mr-3 mb-3" color="primary">
                  <FaPlus  />
             </Fab>
         </div>
              
        </>
    )
}