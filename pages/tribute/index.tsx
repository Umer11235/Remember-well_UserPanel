import TopNav from "@/components/topNav";
import Button from "@/components/button";
import { useState } from "react";
import Icons from "@/components/customIcons";
import { Form, Formik } from "formik";
import React from "react";
import { ManageSchema, TributeSchema } from "@/utils/schema";
import { GetAlertMessage } from "@/utils";
import { checkPurchasedOrNot2, get_profile, get_start, handleManage, handleTribute } from "@/API";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Tab from "@/components/tabs";
import Switch from "react-switch";
import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';
import { boolean } from "yup";

const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  let code = searchParams.get("code");
  const [loading, setloading] = useState(false);

  const [initialValues, setinitialValues] = React.useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    // nick_Name:'',
    introductoryNote: '',
    note: '',
    dateofBirth: '',
    contact:'',
    dateofPassing: '',
    type: '0',
    isPublic:false

  });
  const CheckStar = (_data: string) => {
    try {

      setloading(true);
      (async () => {
        //@ts-ignore
        await checkPurchasedOrNot2(_data).then(x => {

          if (x && x?.isSuccess == true) {

            (async () => {
              await get_start(_data).then(x => {
                if (x && x?.isSuccess == true) {

                  setinitialValues({
                    title: x?.data?.title,
                    firstName: x?.data?.first_Name,
                    middleName: x?.data?.middle_Name,
                    lastName: x?.data?.last_Name,
                    // nick_Name: x?.data?.nick_Name,
                    introductoryNote: x?.data?.introductory_Note,
                    note: x?.data?.note,
                    contact: x?.data?.contact,
                    dateofBirth: x?.data?.date_of_Birth,
                    dateofPassing: x?.data?.date_of_Passing,
                    type: x?.data?.type != null ? x?.data?.type : "0",
                    isPublic:x?.data?.isPublic

                  });
                }
              }).catch(ex => {

              });
            })()
          }
          else {

            GetAlertMessage("Error", "Star not found please purchase new one", setloading)
            router.push("qr-link?code=" + _data);

          }

          setloading(false);
        }).catch((e: any) => {
          GetAlertMessage("Error", "Star not found please purchase new one", setloading)
          router.push("qr-link?code=" + _data);
          setloading(false);
        })
      })()
    } catch (error) {
      setloading(false);

    } finally {

    }
  }
  React.useEffect(()=>{
    const _token = Cookies.get("code");
    if (_token != undefined) {

      const decoded = jwtDecode(_token);
     
      //@ts-ignore
      if(!(decoded&&decoded?.userId))
        {
             
          router.replace('/login');

        }else
        {
          if (code != undefined) {
            (async () => {
              CheckStar(code)
            })()
          }
        }
        
    }
    else
    {
        router.replace('/login');
    }
  },[code]);

  return <>
    <TopNav />
    <div className="ManageCard container mb-100">
      <p className="m-0 f-b">Tribute Pag setup</p>
      <p className="m-0 mx-90">Start by setting up information about your loved one. Choose carefully as you can only select between Human or Animal once.</p>

      <div className="d-cst-flex">
        <div className="w-100">
          {
            <Formik validationSchema={TributeSchema}
              initialValues={initialValues}
              enableReinitialize
              onSubmit={async (values, { setErrors, setFieldTouched }) => {

                try {
                  setloading(true);
                  (async () => {
                    const formdata = new FormData();
                    console.log(values)
                    formdata.append("title", values.title);
                    formdata.append("firstName", values.firstName);
                    formdata.append("middleName", values.middleName);
                    formdata.append("lastName", values.lastName);
                    // formdata.append("nick_Name", values.nick_Name);
                    formdata.append("introductoryNote", values.introductoryNote);
                    formdata.append("note", values.note);
                    formdata.append("contact", values.contact);
                    formdata.append("dateofBirth", values.dateofBirth);
                    formdata.append("dateofPassing", values.dateofPassing);
                    formdata.append("type", values.type);
                    formdata.append("isPublic", values.isPublic.toString());

                    
                    //@ts-ignore
                    formdata.append("starId", code);


                    await handleTribute(formdata).then(x => {
                      if (x && x?.isSuccess == true) {
                        setloading(false);
                        console.log(formdata);
                      const isPublic=  formdata.get("isPublic")
                      isPublic=="true"?router.push("preview?code=" + code)
                      :router.push("profile?code=" + code);
                        // GetAlertMessage("Success", "Profile Updated Successfully", setloading)

                      }
                      else {
                        GetAlertMessage("Error", x?.message, setloading)
                        setloading(false);

                      }
                    }).catch((e: any) => {
                      setloading(false);
                      GetAlertMessage("Error", "we are currently unable to process your request please contact support", setloading)

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
                    <div className="ManageCardbtn w-100 my-4">
                      <Button
                        title="Human"
                        customClass={
                          values?.type == "0"
                            ? "btn btn-active btn-txt  w-100 mx-1"
                            : "btn btn-bord txt-cst-1   w-100 mx-1 "
                        }
                        onClick={() => {
                          setFieldValue("type", "0");
                        }}
                      />
                      <Button
                        title="Animal"
                        customClass={
                          values?.type == "1"
                            ? "btn btn-active btn-txt w-100 mx-1"
                            : "btn btn-bord txt-cst-1 w-100  mx-1"
                        }
                        onClick={() => {
                          setFieldValue("type", "1");
                        }}
                      />

                    </div>
                    <Form className=" ">
                      <>


                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Title</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("title")}
                              name={`title`}
                              value={values.title}

                              placeholder='Title'

                            />
                            {
                              ((touched.title && errors.title)) && (
                                <p className="red-text">
                                  {errors.title}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>
                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>First Name</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("firstName")}
                              name={`firstName`}
                              value={values.firstName}

                              placeholder='First Name'

                            />
                            {
                              ((touched.firstName && errors.firstName)) && (
                                <p className="red-text">
                                  {errors.firstName}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>

                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Middle Name</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("middleName")}
                              name={`middleName`}
                              value={values.middleName}

                              placeholder='Middle Name'

                            />
                            {/* {
                              ((touched.middleName && errors.middleName)) && (
                                <p className="red-text">
                                  {errors.middleName}
                                </p>
                              ) || <></>
                            } */}
                          </div>

                        </div>
                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Last Name</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("lastName")}
                              name={`lastName`}
                              value={values.lastName}

                              placeholder='Last Name'

                            />
                            {
                              ((touched.lastName && errors.lastName)) && (
                                <p className="red-text">
                                  {errors.lastName}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>



{/*     
                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label></label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("nick_Name")}
                              name={`nick_Name`}
                              value={values.nick_Name}

                              placeholder='Nick Name'

                            />
                            {
                              ((touched.nick_Name && errors.nick_Name)) && (
                                <p className="red-text">
                                  {errors.nick_Name}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div> */}



                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Contact</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("contact")}
                              name={`contact`}
                              value={values.contact}

                              placeholder='Contact'

                            />
                            {
                              ((touched.contact && errors.contact)) && (
                                <p className="red-text">
                                  {errors.contact}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>

                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Introductory Note</label>
                            <input
                              className="w-100 form-control"
                              {...getFieldProps("introductoryNote")}
                              name={`introductoryNote`}
                              value={values.introductoryNote}

                              placeholder='Introductory Note'

                            />
                            {/* {
                              ((touched.introductoryNote && errors.introductoryNote)) && (
                                <p className="red-text">
                                  {errors.introductoryNote}
                                </p>
                              ) || <></>
                            } */}
                          </div>

                        </div>




                        <div className="manageForm w-100 my-3">
                          <div className="form-group txt-input">
                            <label>Note</label>
                            <textarea
                              className="w-100 form-control"
                              {...getFieldProps("note")}
                              name={`note`}
                              value={values.note}

                              placeholder='Note'

                            />
                            {
                              ((touched.note && errors.note)) && (
                                <p className="red-text">
                                  {errors.note}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>
                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Date Of Birth</label>
                            <input
                              className="w-100 form-control mx-180"
                              {...getFieldProps("dateofBirth")}
                              name={`dateofBirth`}
                              type="date"
                              value={values.dateofBirth}

                              placeholder='dateofBirth'

                            />
                            {/* {
                              ((touched.dateofBirth && errors.dateofBirth)) && (
                                <p className="red-text">
                                  {errors.dateofBirth}
                                </p>
                              ) || <></>
                            } */}
                          </div>

                        </div>
                        <div className="manageForm w-100 ">
                          <div className="form-group txt-input">
                            <label>Date Of Passing</label>
                            <input
                              className="w-100 form-control mx-180"
                              {...getFieldProps("dateofPassing")}
                              name={`dateofPassing`}
                              value={values.dateofPassing}
                              type="date"
                              placeholder='dateofPassing'

                            />
                            {
                              ((touched.dateofPassing && errors.dateofPassing)) && (
                                <p className="red-text">
                                  {errors.dateofPassing}
                                </p>
                              ) || <></>
                            }
                          </div>

                        </div>
                        <div className="manageForm w-100 ">
                            <div className="form-group txt-input">
                              <label>Profile Public Setting</label>
                              <Switch onChange={()=>{
                                setFieldValue("isPublic",!values?.isPublic)
                              }} checked={values?.isPublic} />

                             
                            </div>

                          </div>
                        <div className="w-100 my-3">
                          <Button
                            title="Save Changes And Proceed"
                            isLoading={loading}
                            customClass="btn w-100 btn-active btn-txt"
                            onClick={
                              () => {
                                submitForm();
                              }
                            }
                          />
                        </div>
                      </>
                    </Form>

                  </>

                )
              }}

            </Formik>
          }
        </div>
      </div>
    </div>
    <Tab/>
  </>
}

export default Page;
