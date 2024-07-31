import React from 'react';
import Button from "@/components/button";
import Txtbox from "@/components/inputs/txtbox";
import TopNav from "@/components/topNav";
import { useEffect, useState } from "react";
import axios from 'axios';
import createAxiosInstance from "@/components/FetchApi";
import { useRouter } from "next/navigation";
import { Form, Formik } from 'formik';
import { LoginSchema } from '@/utils/schema';
import {handleLogin} from '@/API/index'
import { GetAlertMessage } from '@/utils';

const Page = () => {
  const router = useRouter();
  const [loading, setloading] = useState(false);
  const [initialValues, setinitialValues] = React.useState({
    email: ''
  });


  return (
    <>
      <TopNav />
      <Formik validationSchema={LoginSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setErrors, setFieldTouched }) => {
           try {
              setloading(true);
              (async ()=>{
                await handleLogin(values).then(x=>{
                    if(x&&x?.isSuccess==true)
                      {
                        router.push("otp?email="+values?.email);
                        setloading(false);

                      }
                      else
                      {
                        GetAlertMessage("Error",x?.message,setloading)
                        setloading(false);

                      }
                }).catch(e=>{
                  setloading(false);
                  GetAlertMessage("Error","we are currently unable to process your request please contact support",setloading)

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
                      <p className='f-b'>Login</p>
                      <p>For login, no registration is necessary.</p>
                      {/* <input type="text" className="LoginCardtext" /> */}
                      <Txtbox
                        name="email"
                        value={values.email}
                        class="LoginCardtext"
                        getFieldProps={getFieldProps}
                        onChange={(e: any) => {
                           setFieldValue("email",e.target.value)
                        }}
                        placeHolder='jhondoe@mail.com'
                        onKeyDown={() => {

                        }}
                      />
                      {
                        ((touched.email && errors.email)) && (
                          <p className="red-text">
                            {errors.email}
                          </p>
                        ) || <></>
                      }
                      <Button
                        title="Sign in"
                        isLoading={loading}
                        customClass="btn btn-active btn-txt mx-468"
                        onClick={
                          () => {
                            submitForm();
                          }
                        }
                      />
              
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
