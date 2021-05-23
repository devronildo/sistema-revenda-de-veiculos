import React from 'react';
import { Avatar, Button, CircularProgress, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemAvatar, ListItemText } from '@material-ui/core';
import { MdAdd, MdDelete, MdPerson } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { Confirm } from '../components';
import { changeScreenA, changeScreenB } from '../../store/actions/navigation.action';
import {indexResponse, update, updateResponse} from '../../store/actions/vehicles.action';

export default function Owner(props){
    const dispatch = useDispatch();
    const item = props.item || '';
   
    const [ state, setState] = React.useState({
       isDeleted: null,
       confirmEl: null
    });

    React.useEffect(() => {
        return () => {
            dispatch(indexResponse({success: false}))
        }  
          
    }, [])

    const _owners = (vehicle_id) => {
           dispatch(changeScreenA({
               open: true,
               type: 'owners',
               props: {
                    vehicle_id: vehicle_id,
                    onSelected: owner => {
                        _update(owner, owner.id)
                    } 
               }
           }))
    }

    const _show = (item) => {
          dispatch(changeScreenB({
              open: true,
              type: 'owner-show',
              props:  {
                   item: item
              }
          }))
    }

    const _update = (owner, id) => {
       dispatch(updateResponse({...item, vehicle_owner: owner}))
       dispatch(update({
            id: item.id,
            vehicle_owner: id,
            update_owner: true
       }))
    }

     return (
          <div className="dialog">
               <DialogTitle>Proprietário</DialogTitle>
               <List className="pb-3">
                {(item.vehicle_owner) && 
                   <ListItem button>
                        <ListItemAvatar onClick={() => _show(item.vehicle_owner)}>
                            <Avatar className="account-avatar">
                              <MdPerson />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText onClick={() => _show(item.vehicle_owner)} className="pb-3 pt-3 m-0" primary={item.vehicle_owner.name} />
                        {(state.isDeleted === item.vehicle_owner.id) ? 
                           <CircularProgress className="mr-2" color="secondary" />
                             :
                             <IconButton onClick={() => setState({confirmEl: item.vehicle_owner.id})} className="ml-auto">
                                     <MdDelete />                                                    
                             </IconButton> 
                         }
                         {(state.confirmEl) && 
                            <Confirm 
                                open={(item.vehicle_owner.id === state.confirmEl)}
                                onConfirm={() => _update(null, null)}
                                onClose={() => setState({ confirmEl: null})}
                            />
                        }

                   </ListItem>    
                }
                    <ListItem button onClick={() => _owners(item.id)}>
                          <ListItemAvatar>
                               <Avatar><MdAdd /></Avatar>
                          </ListItemAvatar> 
                          <ListItemText primary="Adicionar proprietário" />  
                    </ListItem>    
                </List>
                <DialogActions>
                   <Button onClick={() => props.onClose()} color="primary">Fechar</Button>
                </DialogActions>    
          </div>
     )
}