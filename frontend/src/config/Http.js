import Axios from 'axios';
import { rootUrl, apiUrl } from './App';

export const Http = Axios.create({
     baseURL: rootUrl
})

export const HttpAuth = Axios.create({
     baseURL: apiUrl
})

HttpAuth.interceptors.request.use(
     async (config) => {
           config.headers.authorization = 'Bearer ' + await localStorage.getItem('access_token')
           return config;
     }
)

HttpAuth.interceptors.response.use(response => {
      return response
}, error => {
      if(error.response){
            if(error.response.status === 401){
                  localStorage.removeItem('access_token')
                  window.location.replace('login');
            }
      }
})

export const HttpUpload = Axios.create({
      baseURL: apiUrl
 })
 
HttpUpload.interceptors.request.use(
      async (config) => {
            config.headers.authorization = 'Bearer ' + await localStorage.getItem('access_token')
            config.headers["Content-Type"] = "multipart/form-data"
            return config;
      }
 )