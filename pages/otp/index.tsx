import Button from "@/components/button";
import Txtbox from "@/components/inputs/txtbox";
import CustomLoader from "@/components/loader";
import TopNav from "@/components/topNav";
import { useParams, useRouter,useSearchParams } from "next/navigation";
import { useState } from "react";
import Cookies from 'js-cookie';
import { Form, Formik } from "formik";
import { LoginCodeSchema } from "@/utils/schema";
import { handleVerifyCode } from "@/API";
import React from "react";
import { GetAlertMessage } from "@/utils";
 
import OtpInput from 'react-otp-input';


const Page = () => {


  const [loading, setloading] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  let email = searchParams.get("email");
  const [_email,setEmail]=React.useState<any>(null);
  
  const [initialValues, setinitialValues] = React.useState({
    // code: ['', '', '', '', '', ''],
    code: '',
    email:email
  });


  React.useEffect(()=>{
    setEmail(email);
      
  },[email])

  



  return (
    <>
      <TopNav />
      <Formik validationSchema={LoginCodeSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setErrors, setFieldTouched }) => {
          try {
            setloading(true);
            (async () => {
              await handleVerifyCode({
                // code:values.code.join(""),
                code:values.code,
                email:email,
              }).then(x => {
                if (x && x?.isSuccess == true) {
                  Cookies.set('code',x?.data?.code);
                  router.push("manage-account"); 
                  setloading(false); 
                }
                else {
                  GetAlertMessage("Error",x?.message,setloading)

                  setloading(false);

                }
              }).catch(e => {
                GetAlertMessage("Error","we are currently unable to process your request please contact support",setloading)

                setloading(false);
              })
            })()
          } catch (error) {
            GetAlertMessage("Error","we are currently unable to process your request please contact support",setloading)

            // setloading(false);
          } finally {
            // setloading(false);
          }
        }}>
        {({ values, getFieldProps, setFieldValue, touched, errors, submitForm }) => {
          return (
            <>

              <Form className=" ">

                {

                  <>
                    <div className="LoginCard">
                      <p className="logincard_ci_P f-b">Check Inbox</p>
                      <p>
                        We have sent you an email with your access link. Open the link or type
                        in the Code.
                      </p>

                      <div className="OtpCard">
                   
                      <OtpInput
      value={values.code}
      onChange={(e)=>{
        setFieldValue("code",e);
      }}
      numInputs={6}
      renderSeparator={<span className="mx-2"></span>}
      renderInput={(props) => <input  {...props} className="Otp" />}
    />
                        {/* {Array.from({ length: 6 }, (_, index) => (
                          <input
                          key={index}
                          className="Otp"
                          {...getFieldProps(`code[${index}]`)}
                          name={`code[${index}]`}
                          value={values.code[index]}
                          onChange={(e: any) => {
                            setFieldValue(`code[${index}]`, e.target.value) 
                            
                          }}
                          placeholder='0'
                          min={1}
                        />
                        ))} */}


                      </div>

                      {touched.code && errors.code && (
                        <p className="red-text">{"Code is Required"}</p>
                      )}
                      <Button
                        title="Comfirm with captcha"
                        isLoading={loading}
                        customClass="btn btn-active btn-txt mx-468"
                        onClick={
                          () => {

                            submitForm();
                           }
                        }
                      />

                      <div className="my-5 w-100">
                        <Button
                          title="Resend email"
                          isLoading={loading}
                          customClass="btn btn-active btn-txt mx-468 my-3"
                          onClick={() => { 
                            
                          }}
                        />

                        {/* <Button
                          isLoading={loading}
                          title="Confirm with a different Email"
                          customClass="btn btn-active btn-txt mx-468"
                          onClick={() => {

                          }}
                        /> */}
                      </div>
                    </div>
                  </>

                }

              </Form>
            </>
          )
        }}
      </Formik>



    </>
  );
};

export default Page;
