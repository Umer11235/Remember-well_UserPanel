import Button from "@/components/button";
import TopNav from "@/components/topNav";
import { Form, Formik } from "formik";
import {  MakeQRSchema } from "@/utils/schema";
import {  makeQR } from "@/API";
import React from "react";
import { GetAlertMessage } from "@/utils";
//@ts-ignore
import { saveAs } from 'file-saver';

 


const Page = () => {


  const [loading, setloading] = React.useState(false);
  const [linkGet,setlinkGet]=React.useState(undefined);
  const [initialValues, setinitialValues] = React.useState({
    email: ''
  });
  const handleDownload = () => {
    const imageUrl = process.env.NEXT_PUBLIC_BASE_URL+'/uploads/qr/'+linkGet; // replace with your image URL
   // Use fetch to get the image blob
   fetch(imageUrl)
   .then(response => response.blob())
   .then(blob => {
     // Use FileSaver to save the blob
     saveAs(blob, linkGet); // specify the filename
   })
   .catch(error => console.error('Error downloading image:', error));
  };

  return (
    <>
      <TopNav />
      <Formik validationSchema={MakeQRSchema}
        initialValues={initialValues}
        enableReinitialize
        onSubmit={async (values, { setErrors, setFieldTouched }) => {
          try {
            setlinkGet(undefined);
            setloading(true);
            (async () => {
              await makeQR(values?.email).then(x => {
                if (x && x?.isSuccess == true) {
                
                  setlinkGet(x?.data?.qr);
                  setloading(false);
                }
                else {
                  GetAlertMessage("Error", x?.message, setloading)

                  setloading(false);

                }
              }).catch(e => {
                GetAlertMessage("Error", "we are currently unable to process your request please contact support", setloading)

                setloading(false);
              })
            })()
          } catch (error) {
            GetAlertMessage("Error", "we are currently unable to process your request please contact support", setloading)

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
                      <p className="logincard_ci_P f-b">Make QR</p>
                      <p>
                        Add an Email to generate a QR Code
                      </p>

                      <div className="OtpCard w-100">

                        <input
                          className="form-control w-100"
                          {...getFieldProps(`email`)}

                          value={values.email}
                          onChange={(e: any) => {
                            setFieldValue(`email`, e.target.value)
                          }}
                          placeholder='user@mail.com'

                        />


                      </div>

                      {touched.email && errors.email && (
                        <p className="red-text">{errors.email}</p>
                      )}
                      <Button
                        title="Create QR"
                        isLoading={loading}
                        customClass="btn btn-active btn-txt mx-468"
                        onClick={
                          () => {

                            submitForm();
                          }
                        }
                      />
                      {
                        linkGet!=undefined?<><Button
                        title="Download"
                        isLoading={loading}
                        
                        customClass="btn btn-active btn-txt mx-468 my-5"
                        onClick={
                          () => {

                            handleDownload();
                          }
                        }
                      /></>:<></>
                      }

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
