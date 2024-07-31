import React from 'react';
import {ColorRing} from 'react-loader-spinner';
import '../../../node_modules/react-js-loader/Box/Box1/style.css';

const CustomLoader: React.FC = () => {
    return (

        <ColorRing  visible={true}
        height="30"
        width="30"
        ariaLabel="color-ring-loading"
        wrapperStyle={{}}
        wrapperClass="color-ring-wrapper"
        colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']} />

    );
};

export default CustomLoader;