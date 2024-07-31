 import '../src/style/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import React from 'react';
 function MyApp({ Component, pageProps }) {
   
  return (
    <>
    
              <ChildWrapper Component={Component} pageProps={pageProps} />

    </>
  );
}

function ChildWrapper({ Component, pageProps }) {

   
  return <>
    <Component {...pageProps} />
  </>
}

export default MyApp;


