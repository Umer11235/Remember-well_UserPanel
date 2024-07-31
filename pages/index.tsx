import { cookies } from 'next/headers'
import React from 'react';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { useRouter } from 'next/router';

const Page=()=>{
    const router = useRouter();

    React.useEffect(()=>{
        const _token = Cookies.get("code");
        if (_token != undefined) {

          const decoded = jwtDecode(_token);
          //check is purchased or not
          //@ts-ignore
          if(decoded&&decoded?.userId)
            {
                 
                router.replace('/manage-account');

            }
            else
            {
                router.replace('/login');
            }
        }
        else
        {
            router.replace('/login');
        }
    },[]);
    return <></>
}

export default Page;

 