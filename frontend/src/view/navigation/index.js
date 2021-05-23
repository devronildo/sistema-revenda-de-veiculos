import React from 'react';
import { changeScreenA, changeScreenB, changeScreenC} from '../../store/actions/navigation.action';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer } from '@material-ui/core';
import Notes from '../notes';
import Owners from '../owners';
import OwnerEdit from '../owners/edit'
import OwnerShow from '../owners/show'
import OwnerVehicles from '../owners/vehicles'
import Seo from '../site/seo';
import Units from '../site/units';
import UnitEdit from '../site/units/edit';
import Logo from '../site/logo';
import Domain from '../site/domain';
import Settings from '../site/settings';

const style = {
     width: '680px',
     maxWidth: window.innerWidth
}

export default function Navigation(){
    const dispatch = useDispatch();
    const nav = useSelector(state => state.navigationReducer)
     return (
         <div>
             <Drawer
               anchor="right"
               open={nav.screenA.open}
               onClose={() => dispatch(changeScreenA({ open: false}))}
             >
                   <div style={style}>
                      {(nav.screenA.type === 'owners') &&
                          <Owners 
                             type={nav.screenA.type}
                             props={nav.screenA.props}
                          />
                      }
                      {
                         (nav.screenA.type === 'seo') &&
                           <Seo />
                      }
                      {(nav.screenA.type === 'units') && 
                         <Units />
                      }
                       {(nav.screenA.type === 'logo') && 
                          <Logo />
                       }
                       {(nav.screenA.type === 'domain') && 
                          <Domain />
                       }
                       {(nav.screenA.type === 'settings') && 
                          <Settings />
                       }
                   </div>
             </Drawer>
             <Drawer
               anchor="right"
               open={nav.screenB.open}
               onClose={() => dispatch(changeScreenB({ open: false}))}
             >
                   <div style={style}>
                        {(nav.screenB.type === 'owner-edit') &&
                           <OwnerEdit 
                              uid={nav.screenB.props.uid}
                              props={nav.screenB.props}
                           />
                        }  
                      
                        {(nav.screenB.type === 'owner-show') &&
                           <OwnerShow
                             item={nav.screenB.props.item}
                           />
                       }
                        {(nav.screenB.type === 'owner-vehicles') &&
                           <OwnerVehicles
                             uid={nav.screenB.props.uid}
                           /> 
                        }
                          {(nav.screenB.type === 'unit-edit') &&
                           <UnitEdit
                             uid={nav.screenB.props.uid}
                           />
                           
                        }
                   </div>
             </Drawer>
             <Drawer
               anchor="right"
               open={nav.screenC.open}
               onClose={() => dispatch(changeScreenC({ open: false}))}
             >
                   <div style={style}>
                       {(nav.screenC.type === 'notes') &&                      
                          <Notes 
                              uid={nav.screenC.props.uid}
                              type={nav.screenC.props.type}
                              props={nav.screenC.props}
                          />
                       }
                   </div>
             </Drawer>
         </div>
     )

}