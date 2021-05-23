import React from 'react';
import {Provider} from 'react-redux';
import { store } from './store/store';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { blue } from '@material-ui/core/colors';
import 'bootstrap/dist/css/bootstrap.min.css'
import './global.css';
import Routes from './Routes'
import {Loading, Notify, Alert, Confirm} from './view/components';
import Navigation from './view/navigation';


const theme = createMuiTheme({
   palette: {
      primary: {
          main: blue[500]
      }
   }
});

const App = () => (
  <Provider store={store}>
    <ThemeProvider theme={theme}>
       
         <Alert />
         <Notify />     
         <Loading />
         <Navigation />
        <Routes />
   </ThemeProvider>
  </Provider>
  
)

export default App;