import React, {Suspense, lazy}  from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {CircularProgress} from '@material-ui/core';

const Auth = lazy(() => import('./view/auth'));
const Register = lazy(() => import('./view/register'));
const Vehicles = lazy(() => import('./view/vehicles'));
const VehicleEdit = lazy(() => import('./view/vehicles/edit'));
const Pay = lazy(() => import('./view/pay'))

const Routes = () => (
    <Router>
        <Suspense fallback={<div className="d-flex justify-content-center mt-5 pt-5"> <CircularProgress /> </div>}>
         <Switch>
               <Route exact path="/vehicles/:id/edit" component={VehicleEdit} />
               <Route exact path="/vehicles/create" component={VehicleEdit} />
               <Route exact path="/vehicles" component={Vehicles} />
               <Route exact path="/pay" component={Pay} />
               <Route path="/register" component={Register} />
               <Route path="/login" component={Auth} />
            
               <Route path="/" component={Auth} />
             
         </Switch>
        </Suspense>
    </Router>
)

export default Routes