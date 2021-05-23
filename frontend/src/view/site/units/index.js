import React from 'react';
import { destroy, index } from '../../../store/actions/units.action'
import {  useDispatch, useSelector }  from 'react-redux';
import { changeScreenA, changeScreenB } from '../../../store/actions/navigation.action';
import { AppBar, Avatar, CircularProgress, Divider, Fab, Fade, IconButton, List, ListItem, ListItemAvatar, ListItemText, Menu, MenuItem, Slide, Toolbar, Typography } from '@material-ui/core';
import { MdKeyboardBackspace, MdLocationOn, MdMoreHoriz } from 'react-icons/md';
import { FcOpenedFolder } from 'react-icons/fc';
import { FaPencilAlt, FaPlus, FaTrash } from 'react-icons/fa';
import { Confirm } from '../../components';


export default function Units(){

     const dispatch = useDispatch();
     const units = useSelector(state => state.unitsReducer.units);

     const [ isLoading, setLoading ] = React.useState(true)
     const [ state, setState ] = React.useState({
          isDeleted: null,
          menuEl: null,
          confirmEl: null
      })

      React.useEffect(() => {
          dispatch(index()).then(res => res && setLoading(false))

          //eslint-disable-next-line react-hooks/exhaustive-deps
   }, [])

     const _create = () => {
          dispatch(changeScreenB({
          open: true,
          type: 'unit-edit',
          props: {}
          }));
     }


     const _edit = (id) => {
          setState({ menuEl: null })
          dispatch(changeScreenB({
               open: true,
               type: 'unit-edit',
               props: {
                    uid: id
               }
          }))
     }

     const _destroy = (id) => {
          setState({ isDeleted: id, menuEl: null})
          dispatch(destroy(id)).then(res => res && setState({isDelete: null}))
     }

     const _handleMenu = (event) => {
          setState({ menuEl: event.currentTarget })
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
                         <Typography variant="h6" color="inherit">Unidades e telefone</Typography>
                    </Toolbar>
                 </AppBar> 
                 <div className="scroll">
                    {(isLoading) ? <div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div> :
                         <> 
                              {(units.length > 0 ) &&
                              <div className="card-body">
                                   <h6 className="m-0">{units.length} {(units.length > 1) ? 'unidade encontradas': 'unidade encontrado'}</h6>
                              </div>               
                                   }

                              {(units.length < 1) &&
                                   <div className="text-center mt-5 mb-5 pt-5 pb-5">
                                             <FcOpenedFolder size="70" />
                                        <h6 className="mt-4 text-muted">Nenhuma unidade encontrada</h6>
                                   </div>
                              }
                       <List>
                              {units.map((item, index) => (
                                   <React.Fragment key={index}> 
                                        <ListItem button selected={state.isDeleted === item.id}>
                                        <ListItemAvatar>
                                             <Avatar>
                                                  <MdLocationOn />
                                             </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText className="pb-3 pt-3" primary={item.neighborhood} />
                                        {(state.isDeleted === item.id) && 
                                             <CircularProgress className="mr-2"  color="secondary" />
                                        }
 
                                        {
                                             (!state.isDeleted) &&
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
                          <Fab onClick={() => _create()} className="fab-bottom-right mr-3 mb-3" color="primary">
                              <FaPlus  />
                         </Fab>
                       </>
                     } 
                    </div>
                </>   
          )
}