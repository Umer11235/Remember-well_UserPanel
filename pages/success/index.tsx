import Button from "@/components/button";
import Checkbox from "@/components/inputs/checkbox";
import Tab from "@/components/tabs";
import TopNav from "@/components/topNav";
import { jwtDecode } from "jwt-decode";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React from "react";
import Cookies from 'js-cookie';

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [select, setSelect] = React.useState(0);
  let code = searchParams.get("code");
  React.useEffect(()=>{
    const _token = Cookies.get("code");
    if (_token != undefined) {

      const decoded = jwtDecode(_token);
     
      //@ts-ignore
      if(!(decoded&&decoded?.userId))
        {
             
          router.replace('/login');

        }
        
    }
    else
    {
        router.replace('/login');
    }
  },[]);
  return (
    <>
      <TopNav />
      <div className="LoginCard mb-100">
        <p className="f-b">Success!</p>
        <p>Choose how you'd like to proceed</p>


        <div className="mt-5">
          <div onClick={() => {
            setSelect(0)
          }} className="form-check">
            <input onChange={(e) => {
              setSelect(0)
            }} className="form-check-input" type="radio" name="flexRadioDefault" checked={select==0?true:false} />
            <label className="form-check-label" >
              Create a New Tribute Page
            </label>
          </div>
          <div onClick={() => {
            setSelect(1)
          }} className="form-check">
            <input onChange={(e) => {
              setSelect(1)
            }} className="form-check-input" type="radio" name="flexRadioDefault"

              checked={select==1?true:false} />
            <label className="form-check-label" >
              Manage Existing Tributes
            </label>
          </div>

        </div>
        <Button
          title="Save"
          customClass="btn btn-active btn-txt mx-151 mt-3"
          onClick={() => {
            if(select==0)
              {
                router.push("tribute?code="+code);
              }
              else
              {
                router.push("manage-account?type=stars");
              }
            
          }}

        />
 

      </div>
      <Tab/>
    </>
  );
};

export default Page;
