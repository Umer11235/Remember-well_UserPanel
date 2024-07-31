import Button from "@/components/button";
import TopNav from "@/components/topNav";
import React from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { checkPurchasedOrNot, handleVerifyCode } from "@/API";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GetAlertMessage } from "@/utils";
import Tab from "@/components/tabs";
import QrReader from "@/components/qr/QrReader";
 
const Page = () => {
  //store when it is verified by backend
  const [qr, setQr] = React.useState<any>(undefined);
  const [showQr, setshowQR] = React.useState(false);
  const [loading, setloading] = React.useState(false);

  const handleScan = (data: any) => {
    if (data) {
       // Extract code from the URL
      const codeIndex = data.indexOf('?code=');
      if (codeIndex !== -1) {
        const code = data.substring(codeIndex + 6); // 6 is the length of '?code='
        setQr(code);
        setshowQR(false);
        // setQr(code);
        // history.push(`/profile?code=${code}`);
      }
    }
  };
  const router = useRouter();
  const CheckStar = (_data: string) => {
    try {

      setloading(true);
      (async () => {
        //@ts-ignore
        await checkPurchasedOrNot(_data).then(x => {

          if (x && x?.isSuccess == true) {
            router.push("success?code=" + _data);
          }
          else {
            GetAlertMessage("Error", "Star not found please purchase new one", setloading)
            setQr(undefined);
          }

          setloading(false);
        }).catch(e => {
          setloading(false);
        })
      })()
    } catch (error) {
      setloading(false);
      // setloading(false);
    } finally {
      // setloading(false);
    }
  }
  
  React.useEffect(() => {
    if (qr != undefined) {
      CheckStar(qr);
    }
  }, [qr]);


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
      {showQr == true ? <>
       <QrReader setQr={handleScan}/>

      </> : <>
        <div className="LoginCard1 mb-100">
          <p className="f-b">Your Unfading Star has</p>
          <p >not been linked yet.</p>
          <p>Please scan the QR-Code to link your account to the Unfading Star.</p>
          <Button
            title="Connect Now"
            customClass="btn btn-active btn-txt mx-151"
            onClick={() => {
              const _token = Cookies.get("code");
              if (_token != undefined) {
                setshowQR(true);
              }

            }}
            isLoading={loading}
            icon="camera"
          />
          <div className="mt-7 mb-6 line-between text-appGray relative w-100">
            <p>or</p>
          </div>
          <div className="LoginCard1">
            <p className="f-b">Don't have a</p>
            <p>Unfading Star yet?</p>
            <p >Order now and link it to your account to create a memorial page.</p>

            <Button
              title="Buy Now"
              isLoading={loading}
              customClass="btn btn-active btn-txt mx-151"
              onClick={() => {
                window.open("https://03a1df-fa.myshopify.com/", '_blank');

              }}

            />
          </div>

        </div>
      </>}
      <Tab />
    </>
  );
};

export default Page;
