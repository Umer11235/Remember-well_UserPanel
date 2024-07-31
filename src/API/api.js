import axios from "axios";
import Cookies from 'js-cookie';

export const baseURL = process.env.NEXT_PUBLIC_BASE_URL + '/api';
 export const baseURLImage = process.env.NEXT_PUBLIC_BASE_URL + '/';

const instance = axios.create({
  baseURL,
  headers:{ 
    'ngrok-skip-browser-warning': 'true' 
 }
});

instance.interceptors.request.use(
  (config) => {
    // Get the token from local storage
    
    
    if (typeof window !== "undefined") {
      const _token = Cookies.get("code");
      if (_token != undefined) {
        config.headers.Authorization = `Bearer ${_token}`;

      }
       
       
    }
    

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
