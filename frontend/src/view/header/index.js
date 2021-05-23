import React from 'react';
import {Link} from 'react-router-dom'
import { index } from '../../store/actions/app.action';
import { MenuList, MenuItem, AppBar, Toolbar, IconButton, Typography, Drawer, Divider, List, ListItem, ListItemIcon, ListItemText, Collapse } from '@material-ui/core';
import { FaCar, FaUsers, FaLaptop, FaCreditCard, FaWhatsapp, FaSignOutAlt, FaAngleUp, FaAngleDown } from 'react-icons/fa';
import { MdMenu } from 'react-icons/md';
import { useDispatch } from 'react-redux'
import { changeScreenA } from '../../store/actions/navigation.action';

export default function Header(props){
  
      const dispatch = useDispatch()


      const[mobile, setMobile] = React.useState(window.innerWidth < 577 ? true : false)

     const [state, setState] = React.useState({
          open: false
     }) 
     
     const [ collapse, setCollapse] = React.useState({
           site: false,
           financeiro: false
     }) 

     React.useEffect(() => {
          dispatch(index())
          window.addEventListener('resize', _resize)  
          //eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])

     const _resize = () => {
           setMobile(window.innerWidth < 577 ? true : false)
     }

     const handlePage = (page) => {
           dispatch(changeScreenA({
                 open: true,
                 type: page,
                 props: {}
           }))

           setState({open: false})
     }

     return (
         <>
             {(mobile) ? 
               <AppBar position="fixed">
                    <Toolbar variant="dense">
                      <IconButton edge="start"  color="inherit" aria-label="menu" onClick={() => setState({ open: true})}>
                      <MdMenu />
                    </IconButton>
                     <Typography variant="h6" >
                          {props.title}
                     </Typography>
                     {props.button}
                    </Toolbar>
             </AppBar>
                 :
                 <nav className="header navbar navbar-expand-lg navbar-light bg-white p-0">
                     <div className="container">
                          <Link className="navbar-brand" to="/">
                                <img src="/logo.png" alt="CAR CRM" height="40" />
                          </Link>
                          <ul className="navbar-nav">
                              <li className="nav-item">
                                   <Link className="nav-link" to="/vehicles">
                                     <FaCar className="icon-lg mr-2" /> Veiculos
                                   </Link> 
                              </li>     
                              <li className="nav-item">
                                   <button onClick={() => handlePage('owners')} className="nav-link bg-white" to="/vehicles">
                                     <FaUsers className="icon-lg mr-2" /> Proprietários
                                   </button> 
                              </li>  

                               <li className="nav-item dropdown">
                                   <Link className="nav-link dropdown-toggle" to="#"  data-toggle="dropdown">
                                     <FaLaptop className="icon-lg mr-2" /> Site
                                   </Link> 
                                   <MenuList className="dropdown-menu">
                                         <MenuItem onClick={() => handlePage('seo')} className="dropdown-item">
                                              Otimização para o Google
                                         </MenuItem>
                                         <MenuItem onClick={() => handlePage('units')}  className="dropdown-item">
                                             Unidades e Telefone
                                         </MenuItem>
                                         <MenuItem onClick={() => handlePage('logo')} className="dropdown-item">
                                            Minha Logo
                                         </MenuItem>
                                         <MenuItem onClick={() => handlePage('domain')} className="dropdown-item">
                                            Dominio
                                         </MenuItem>
                                         <MenuItem onClick={() => handlePage('settings')} className="dropdown-item">
                                            Configurações
                                         </MenuItem>
                                   </MenuList>  
                              </li>    

                               <li className="nav-item dropdown">
                                   <Link className="nav-link dropdown-toggle" to="#"  data-toggle="dropdown">
                                     <FaCreditCard className="icon-lg mr-2" /> Financeiro
                                   </Link> 
                                   <MenuList className="dropdown-menu">
                                         <MenuItem 
                                           component={Link}
                                           to="/pay"
                                           className="dropdown-item"
                                         >
                                              Meu Plano
                                         </MenuItem>
                                         <MenuItem className="dropdown-item">
                                            Minhas Transações
                                         </MenuItem>
                                   </MenuList>  
                              </li> 
                              <li className="nav-item">
                                   <Link className="nav-link" to="/">
                                     <FaWhatsapp className="icon-lg mr-2" /> Ajuda
                                   </Link> 
                              </li>    
                              <li className="nav-item">
                                   <Link className="nav-link" to="/">
                                     <FaSignOutAlt className="icon-lg mr-2" /> Sair
                                   </Link> 
                              </li>                                    
                          </ul>
                     </div>
                 </nav> 
            }
            <Drawer anchor="left" open={state.open} onClose={() => setState({open: false})}>
                   <div style={{ width: 320, maxWidth: window.innerWidth - 70 }}>
                         <List component="nav" className="menu-mobile">
                              <ListItem>
                                   <img className="img-fluid logo-mobile" src="/logo.png" alt="CAR CRM"  />
                              </ListItem>
                              <ListItem>
                                   teste@hotmail.com
                              </ListItem>
                              <Divider className="mt-2 mb-3" />
                              <ListItem
                                component={Link}
                                to="/vehicles"
                                onClick={() => setState({ open: false})}
                              >
                                   <ListItemIcon>
                                       <FaCar  />
                                   </ListItemIcon>
                                   <ListItemText primary="Veiculos" />
                              </ListItem>     
                              <ListItem onClick={() => handlePage('owners')}>
                                   <ListItemIcon>
                                       <FaUsers />
                                   </ListItemIcon>
                                   <ListItemText primary="Proprietários" />
                              </ListItem>   
                               <ListItem button onClick={() => setCollapse({site: (collapse.site) ? false : true})}>
                                   <ListItemIcon>
                                       <FaLaptop />
                                   </ListItemIcon>
                                   <ListItemText primary="Site" />
                                   {(collapse.site) ? <FaAngleUp  /> : <FaAngleDown />}
                              </ListItem>    
                              <Collapse in={collapse.site} timeout="auto" unmountOnExit>
                                   <Link component="div" disablePadding>
                                        <ListItem onClick={() => handlePage('seo')}>
                                             <ListItemText className="pl-5" primary="Otimização para o Google" />
                                        </ListItem>
                                        <ListItem onClick={() => handlePage('units')}>
                                             <ListItemText className="pl-5" primary="Unidades e Telefones" />
                                        </ListItem>
                                        <ListItem onClick={() => handlePage('logo')}>
                                             <ListItemText className="pl-5" primary="Minha Logo" />
                                        </ListItem>
                                        <ListItem>
                                             <ListItemText onClick={() => handlePage('domain')} className="pl-5" primary="Dominio" />
                                        </ListItem>
                                        <ListItem>
                                             <ListItemText onClick={() => handlePage('settings')} className="pl-5" primary="Configurações" />
                                        </ListItem>
                                   </Link>
                              </Collapse>
                              <Divider className="mt-2 mb-2" />
                              <ListItem button onClick={() => setCollapse({financeiro: (collapse.financeiro) ? false : true})}>
                                   <ListItemIcon>
                                       <FaCreditCard />
                                   </ListItemIcon>
                                   <ListItemText primary="Financeiro" />
                                   {(collapse.site) ? <FaAngleUp  /> : <FaAngleDown />}
                              </ListItem>  
                              <Collapse in={collapse.financeiro} timeout="auto" unmountOnExit>
                                   <Link component="div" disablePadding>
                                        <ListItem
                                           component={Link}
                                           to="/pay"
                                           onClick={() => setState({ open: false})}
                                        >
                                             <ListItemText className="pl-5" primary="Meu Plano" />
                                        </ListItem>
                                        <ListItem>
                                             <ListItemText className="pl-5" primary="Minhas Transações" />
                                        </ListItem>
                                   </Link>
                              </Collapse> 
                              <ListItem>
                                   <ListItemIcon>
                                       <FaWhatsapp  />
                                   </ListItemIcon>
                                   <ListItemText primary="Ajuda" />
                              </ListItem>      
                              <Divider className="mt-2 mb-2" />  
                              <ListItem>
                                   <ListItemIcon>
                                       <FaSignOutAlt  />
                                   </ListItemIcon>
                                   <ListItemText primary="Sair" />
                              </ListItem>    
                         </List>
                   </div>
            </Drawer>
         </>
     )
     
}