import TopNav from "@/components/topNav";
import Button from "@/components/button";
import { useState } from "react";
import Icons from "@/components/customIcons";
import { Form, Formik } from "formik";
import React from "react";
import { ManageSchema } from "@/utils/schema";
import { GetAlertMessage } from "@/utils";
import { get_profile, get_starts, handleManage } from "@/API";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Tab from "@/components/tabs";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";



const ProgressBar = ({ progress }:{progress:any}) => (
  <div className="progress-circle img-svg">
    <svg viewBox="0 0 36 36">
      <path
        className="circle-bg"
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
      <path
        className="circle"
        strokeDasharray={`${progress}, 100`}
        d="M18 2.0845
        a 15.9155 15.9155 0 0 1 0 31.831
        a 15.9155 15.9155 0 0 1 0 -31.831"
      />
    </svg>
    <p>{progress} %</p>
  </div>
);


const Page = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  let _type = searchParams.get("type");

  const [activeSection, setActiveSection] = useState<string|undefined>();
  const onItemClick = (activeState: string) => {
    setActiveSection(activeState);
  };
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [selectedImage, setSelectedImage] = useState(null);
  const [stars, setstars] = React.useState([]);
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
  const [initialValues, setinitialValues] = React.useState({
    firstName: '',
    middleName:'',
    lastName: '',
    city: '',
    country: '',
    zip: '',
    language: 'en',
    profile: ''
    });

  const handleImageUpload = (event: any) => {

    const file = event.target.files[0];
    if (file) {
  

      setSelectedImage(file)

      return true;
    }
  };

  React.useEffect(() => {
    (async () => {
      await get_profile().then(x => {
        if (x && x?.isSuccess == true) {
          setinitialValues({
            firstName: x?.data?.first_Name,
            middleName:x?.data?.middle_Name,
            lastName: x?.data?.last_Name,
            city: x?.data?.city,
            country: x?.data?.country,
            zip: x?.data?.zip,
            language: x?.data?.language != null ? x?.data?.language : "en",
            profile: x?.data?.profile
          });
        }
      }).catch(ex => {

      });
    })()
  }, [])

  React.useEffect(() => {
    (async () => {
      setloading1(true);
      await get_starts().then(x => {
        if (x && x?.isSuccess == true) {
          setstars(x?.data);

        }
        setloading1(false);
      }).catch(ex => {
        setloading1(false);
      });
    })()
  }, [])
  React.useEffect(()=>{
      if(_type)
        {
        
          if(_type=="stars")
            {
               onItemClick("SoulStars")

            }
            else
            {
              onItemClick("Settings")
            }
            
        }
        else
        {
         
          onItemClick("Settings")

        }
  },[_type])



  return <>
    <TopNav />
    
    <div className="ManageCard container mb-100">
      <p className="m-0 f-b">Manage</p>
      <p className="m-0">Set up your account and manage your information.</p>
      <div className="ManageCardbtn w-100">
        <Button
          title="Settings"
          customClass={
            activeSection == "Settings"
              ? "btn btn-active btn-txt  w-100 mx-1"
              : "btn btn-bord txt-cst-1   w-100 mx-1 "
          }
          onClick={() => {
            onItemClick("Settings");
          }}
        />
        <Button
          title="Unfading Heart"
          customClass={
            activeSection == "SoulStars"
              ? "btn btn-active btn-txt w-100 mx-1"
              : "btn btn-bord txt-cst-1 w-100  mx-1"
          }
          onClick={() => {
            onItemClick("SoulStars");
          }}
        />

      </div>
      <div className="d-cst-flex">
        <div className="w-100">
          {
            activeSection == "Settings" ? <>
              <Formik validationSchema={ManageSchema}
                initialValues={initialValues}
                enableReinitialize
                onSubmit={async (values, { setErrors, setFieldTouched }) => {

                  try {
                    setloading(true);
                    (async () => {
                      const formdata = new FormData();
                      console.log(values)
                      formdata.append("firstName", values.firstName);
                      formdata.append("middlename", values.middleName);

                      formdata.append("lastName", values.lastName);
                      formdata.append("city", values.city);
                      formdata.append("country", values.country);
                      formdata.append("zip", values.zip);
                      formdata.append("language", values.language);
                      if (selectedImage != null) {
                        //@ts-ignore
                        formdata.append("profile", selectedImage);

                      }



                      await handleManage(formdata).then(x => {
                        alert("check")
                        if (x && x?.isSuccess == true) {
                          setloading(false);
                          GetAlertMessage("Success", "Profile Updated Successfully", setloading)

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

                      <Form className=" ">
                        <>

                          <div className="ManageCard_profile profile-card__img" >

                            {selectedImage != null || (values.profile != null && values.profile != '') ?
                             <>
                           {/* {loading?
                            <h5>loading..</h5>:
                            
                            <img alt="" src={selectedImage != null ? URL.createObjectURL(selectedImage) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + values?.profile} />}
                              */}
                                {uploading ? (
                                  <ProgressBar progress={uploadProgress} />
                                ) : (
                                  <img alt="" src={selectedImage != null ? URL.createObjectURL(selectedImage) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + values?.profile} />
                                )}


                            </> 
                            :
                             <><p>A</p></>}


                            <button type="button" className="choose_file">
                              <span>
                                <Icons icon="pen" />
                              </span>
                              <input type="file" accept="image/*" onChange={(e) => {
                              setloading(true);
                              
                          
                              const d = handleImageUpload(e);
                                if (d == true) {
                                  setFieldValue("profile", "file");
                                }
                                setloading(false);
                              
                              
                              }} />

                            </button>

                          </div>
                          {
                            ((touched.profile && errors.profile)) && (
                              <p className="text-center red-text">
                                {errors.profile}
                              </p>
                            ) || <></>
                          }

{/* #UmerUpdates
there is add middle name colum and update css like first lst midle name in one row */}

<div className="rowgroup">

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
                              {
                                ((touched.middleName && errors.middleName)) && (
                                  <p className="red-text">
                                    {errors.middleName}
                                  </p>
                                ) || <></>
                              }
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

                          </div>


                          <div className="manageForm w-100 ">
                            <div className="form-group txt-input">
                              <label>City</label>
                              <input
                                className="w-100 form-control"
                                {...getFieldProps("city")}
                                name={`city`}
                                value={values.city}

                                placeholder='City'

                              />
                              {
                                ((touched.city && errors.city)) && (
                                  <p className="red-text">
                                    {errors.city}
                                  </p>
                                ) || <></>
                              }
                            </div>

                          </div>
                          
                          <div className="manageForm w-100 ">
                            <div className="form-group txt-input">
                              <label>Country</label>
                              <input
                                className="w-100 form-control"
                                {...getFieldProps("country")}
                                name={`country`}
                                value={values.country}

                                placeholder='Country'

                              />
                              {
                                ((touched.country && errors.country)) && (
                                  <p className="red-text">
                                    {errors.country}
                                  </p>
                                ) || <></>
                              }
                            </div>

                          </div>
                          
                          <div className="manageForm w-100 ">
                            <div className="form-group txt-input">
                              <label>Zip/Postal Code</label>
                              <input
                                className="w-100 form-control"
                                {...getFieldProps("zip")}
                                name={`zip`}
                                value={values.zip}

                                placeholder='Zip / Postal Code'

                              />
                              {
                                ((touched.zip && errors.zip)) && (
                                  <p className="red-text">
                                    {errors.zip}
                                  </p>
                                ) || <></>
                              }
                            </div>

                          </div>
                  
                          <div className="manageForm w-100 ">
                            <div className="form-group txt-input">
                              <label>Language</label>
                              <select
                                className="w-100 form-control"
                                {...getFieldProps("language")}
                                name={`language`}
                                value={values.language}


                              >
                                <option value={"en"}>English</option>
                              </select>
                              {
                                ((touched.language && errors.language)) && (
                                  <p className="red-text">
                                    {errors.language}
                                  </p>
                                ) || <></>
                              }
                            </div>

                          </div>
                          <div className="w-100 my-3">
                            <Button
                              title="Save"
                              isLoading={loading}
                              customClass="btn w-100 btn-active btn-txt"
                              onClick={
                                () => {
                                  submitForm();
                                }
                              
                              }
                              
                            />
                          {loading && <ProgressBar progress={uploadProgress} />}
                          </div>
                        </>
                      </Form>

                    </>

                  )
                }}

              </Formik>


            </> : <div className="">
              <div className=" dd-fx">
                {
                  stars?.length > 0 ? <>
                    {stars.map((x, i) => {
                      return <div key={x} className="wrapper">
                        <div className="profile-card js-profile-card">
                          <div className="profile-card__img">
                            <img
                              src={
                                //@ts-ignore
                                x?.profile!=null?process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + x?.profile:"no-image.png"}
                              alt="profile card"
                            />
                          </div>
                          <div className="profile-card__cnt js-profile-cnt mx-2">
                            <div className="profile-card__name ">{
                              //@ts-ignore
                              x?.title}</div>
                                  <div className="profile-card__txt my-0">
                              
                                {
                                //@ts-ignore
                                x?.first_Name} {
                                  //@ts-ignore
                                  x?.middle_Name} {
                                    //@ts-ignore
                                    x?.last_Name}
                            </div>
                            <div className="profile-card__txt my-0">
                              
                              <strong>
                                {
                                  //@ts-ignore
                                  x?.introductory_Note
                                } </strong>
                            </div>


                            <Button
                      title="Manage Tribute"
                      isLoading={loading1}
                      customClass={"btn btn-active btn-txt mx-151 my-4 mx-100"}
                      onClick={() => {
                        //@ts-ignore
                        router.push("tribute?code="+x?.id);
                      }}
                    />

                          </div>

                        </div>
                      </div>
                    })}

                  </> : <div className="block">
                    <p >No Unfading Heart</p>
                    <p>created</p>
                  
                  </div>
                }
              
              </div>
              <Button
                      title="Create New"
                      isLoading={loading1}
                      customClass={"btn btn-active btn-txt mx-151 my-4 mx-100"}
                      onClick={() => {
                        router.push("qr-link");
                      }}
                    />
            </div>
          }
        </div>
      </div>
    </div>
    <Tab/>
  </>
}

export default Page;
