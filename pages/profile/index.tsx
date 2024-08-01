import { addtribute, checkPurchasedOrNot2, get_medias, get_profile, get_start, gettribute, uploadBannerProfileForStar, uploadBannerProfileForStarv2 } from "@/API";
import ImageCard from "@/components/ImageCard";
import Button from "@/components/button";
import Icons from "@/components/customIcons";
import ImageUpload from "@/components/imageUpload";
import Dropdown from "@/components/inputs/dropdown";
import TextInput from "@/components/inputs/textbox";
import Tab from "@/components/tabs";
import TopNav from "@/components/topNav";
import { GetAlertMessage } from "@/utils";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import Txtbox from "@/components/inputs/txtbox";
import { ErrorMessage, Field, Form, Formik } from "formik";
import { AddTributeSchema } from "@/utils/schema";

const Page = ({hide}:{hide:boolean}) => {

  const router = useRouter();
  const searchParams = useSearchParams();

  let code = searchParams.get("code");
  const [loading, setloading] = useState(false);
  const [loading1, setloading1] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedBanner, setSelectedBanner] = useState(null);
  const [_files,_setFiles]=React.useState(1);
  const [media,setmedia]=React.useState([]);
  const [tributes,setTributes]=React.useState<string[]>([]);
  const [tribute, setTribute] = useState<string>('');
  const [uploadError, setUploadError] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);

  const [uploadProgress, setUploadProgress] = useState<number>(0);


  React.useEffect(()=>{
    const _token = Cookies.get("code");
    if (_token != undefined) {

      const decoded = jwtDecode(_token);
     
      //@ts-ignore
      if(!(decoded&&decoded?.userId))
        {
             
          if(code)
            {
              router.replace("preview?code="+code)
            }
            else
            {
              router.replace("login")
            }

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
       //redirect to public 

       if(code)
        {
          router.replace("preview?code="+code)
        }
        else
        {
          router.replace("login")
        }
    }
  },[code]);
  
  const [initialValues, setinitialValues] = React.useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
    Nick_Name:'',
    introductoryNote: '',
    dateofBirth: '',
    dateofPassing: '',
    type: '0',
    contact: '',
    note:'',
    profile: '',
    banner: '',
    id:'',
  });

  const [activeSection, setActiveSection] = useState<string>("About");
 


  const handleImageUpload = (event: any) => {

    const file = event.target.files[0];
    if (file) {
      setSelectedImage(file)

      handleUpload(0,file)

      return true;
    }
  };


  const handleBannerImageUpload = (event: any) => {

    const file = event.target.files[0];
    if (file) {
      setSelectedBanner(file)
      handleUpload(1,file)
      return true;
    }
  };


  const handleUpload = (type: number,_file:any) => {
    if (code != null) {
      try {

        setloading(true);
        (async () => {
          const formdata = new FormData();

          if (type == 0) {
             //@ts-ignore
            formdata.append("profile", _file);
          }

          if (type == 1) {
            //@ts-ignore
            formdata.append("banner", _file);
          }

          formdata.append("code", code);




          await uploadBannerProfileForStarv2(formdata,setUploadProgress,setUploading,setUploadError).then(x => {
            if (x && x?.isSuccess == true) {
              setloading(false);
              
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
    }
  }

  const CheckStar = (_data: string) => {
    try {

      setloading(true);
      (async () => {

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
                    Nick_Name: x?.data?.nick_Name,
                    introductoryNote: x?.data?.introductory_Note,
                    dateofBirth: x?.data?.date_of_Birth,
                    dateofPassing: x?.data?.date_of_Passing,
                    type: x?.data?.type,
                    contact: x?.data?.contact,
                    profile: x?.data?.profile,
                    note:x?.data?.note,
                    banner: x?.data?.banner,
                    id:x?.data.id,
                  });
                }
              }).catch(ex => {

              });
            })();

            (async ()=>{
              await get_medias(_data).then(x => {
                if (x && x?.isSuccess == true) {
                  console.log(x?.data)
                  setmedia(x?.data);
                }
              }).catch(ex => {

              });
            })()
          }
          else { 
             router.push("preview?code=" + _data); 
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
 


// const posttribute=(id:string)=>{
  const posttribute = async (id:string, values: {tribute: string }) => {


  addtribute(id,values.tribute).then(x=>{
    if (values.tribute) {
      setTributes((prevTributes) => [...prevTributes, values.tribute]);
      setTribute(''); // Clear the input field after submission
    }
  })

}

//
const gettingTribute=async(id:string) => {
  setloading(true)
  await gettribute(id).then(x => {

  setloading(false);
   
   setTributes(x.data);
   
   console.log(tributes)
  }).catch(ex => {
    setloading(false);
  });
};

useEffect(() => {
  gettingTribute(initialValues.id); // Fetch tributes when the component mounts
}, [initialValues.id]); 
//
// const gettingTribute=(id:string)=>{
//   gettribute(id)
// }

  return (
    <>
      <TopNav />
      <div className="ProfileContainer mb-100">




{/* <h1>{uploadProgress}</h1>
  
   { uploading && (
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
                    strokeDasharray={`${uploadProgress}, 100`}
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <p>{uploadProgress} %</p>
              </div>
            )} */}

  
        <div className="profileCard">


          <div className="banner-btx">
            {selectedBanner != null || (initialValues.banner != null && initialValues.banner != '') ? <>
              <img alt="" src={selectedBanner != null ? URL.createObjectURL(selectedBanner) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + initialValues?.banner} />
            </> : <> </>}

            {loading == true ? <></> : <>
              <button type="button" className="choose_file">
                <span>
                  <Icons icon="pen" />
                </span>
                <input type="file" accept="image/*" onChange={(e) => {
                  const d = handleBannerImageUpload(e);
                  if (d == true) {
                    setinitialValues({
                      ...initialValues,
                      banner: 'file'
                    });
                  }
                }} />

              </button>
            </>}

          </div>

          <div className="pos-abs-1">
            <div className="ManageCard_profile profile-card__img" >
              {selectedImage != null || (initialValues.profile != null && initialValues.profile != '') ? <>
                <img alt="" src={selectedImage != null ? URL.createObjectURL(selectedImage) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + initialValues?.profile} />
              </> : <><p>A</p></>}


              {
                loading == true ? <>
                  { uploading && (
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
                    strokeDasharray={`${uploadProgress}, 100`}
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <p>{uploadProgress} %</p>
              </div>
            )}
                </> : <>   <button type="button" className="choose_file">
                  <span>
                    <Icons icon="pen" />
                  </span>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const d = handleImageUpload(e);
                    if (d == true) {
                      setinitialValues({
                        ...initialValues,
                        profile: 'file'
                      });
                    }
                  }} />

                </button></>
              }

            </div>
          </div>

        </div>





        <div className="profileDetails">

          <p>In memory of</p>
          <p className="upper-case">{`${initialValues?.firstName ? initialValues?.firstName + " " + initialValues?.middleName + " " + initialValues?.lastName: "Anonymous"}`}<span className="nickname p-2">({initialValues?.title  })</span></p>
          <p>{initialValues?.contact}</p>
        </div>



        <div className="ManageCardbtn">



          <Button
            title="Page Setting"
            customClass="profileBtn"
            onClick={() => {
                router.push("tribute?code="+code)
            }}
          />
          <Button
            title="Preview profile"
            customClass="profileBtn"
            onClick={() => { 
              router.push("preview?code="+code)
            }}
          />
        </div>

        <div className="d-cst-flex">

          <div className="w-100">
            <>
              <div className="manageForm w-100">

                <div className="ProfileNav">
                  <ul>
                    <li className={activeSection == "About" ? "ProfileNav_Active" : ""} onClick={() => { setActiveSection("About") }}>About me</li>
                    <li className={activeSection == "Media" ? "ProfileNav_Active" : ""} onClick={() => { setActiveSection("Media") }}>Media</li>
                    <li className={activeSection == "Tributes" ? "ProfileNav_Active" : ""} onClick={() => { setActiveSection("Tributes") }}>Tributes</li>
                  </ul>
                </div>


                <div className="profile_Setting">
                  {

                    activeSection == "About" ? (<>

                      <div className="profile_about">
                        <div>
                          <p>{initialValues?.introductoryNote}</p>
                        </div>

                        <div>
                          <p>{initialValues?.note}</p>
                        </div>
                      </div>

                    </>)
                      : activeSection == "Media" ? (<>
                        <div className="profile_media">
                          {media.map(x=><ImageUpload currentFile={x} _files={_files} _setFiles={_setFiles} hide={false} code={
                            //@ts-ignore
                            x?.soul_Star_Id} setmedia={setmedia} media={media}/>)}
                          {
                            Array.from({length:_files},()=><> <ImageUpload hide={false} _files={_files} _setFiles={_setFiles} code={code}/></>)
                          }


                        </div>

                      </>)
                        : activeSection == "Tributes" ? (<>
                          <div className="profile_Tributes">

                            <div className="tributeMemory">
                              <Icons icon="chat" />
                        
      <div className="tributelist">

  {tributes.length>0 ?
  (<ul>

    {tributes.map((tribute, index) => (
            <li key={index}>{tribute}</li>
          ))}
  </ul>):
  (    <p>No tributes found.</p>
  )}


        </div>             
                         
                          

                              {/* umertri */}
                            </div>

<div className="addtribute">


<Formik
        initialValues={{ tribute: '' }}
        validationSchema={AddTributeSchema}
        onSubmit={ async ( values, { resetForm }) => {
          
          setloading(true)
try{
if(values!==null){
 
  await posttribute(initialValues.id,values).then(x => {
  
      setloading(false); 
      resetForm();
    

  })
}

} catch (error) {
  GetAlertMessage("Error","we are currently unable to process your request please contact support",setloading)
  setloading(false);

}
        }}
      >
        {({ isSubmitting,submitForm  }) => (
          <Form>

            <div className="addtributegroup">

            <Field
              type="text"
              id="tribute"
              name="tribute"
              className="w-100 form-control tributeinput"
              placeholder="Write a tribute to remember your loved one..."
            />
            
            <ErrorMessage name="tribute" component="div" className="red-text" />

            </div>

            {/* <button type="submit" className="tributebtn" disabled={isSubmitting}>
              Submit
            </button> */}

            <Button
              title="Post"
              isLoading={loading}
              customClass="tributebtn"
              onClick={submitForm}
            />

          </Form>
        )}
      </Formik>



   {/* <input
   type="text"
   id="tribute"
   name="tribute"
   value={tribute}
    className="w-100 form-control tributeinput"
    onChange={(e: any) => {
      setTribute(e.target.value)}}
  
      placeholder='Write a tribute to remember your loved one...'
  required     />
                 
                            <Button
            title="post"
            customClass="tributebtn"
            onClick={()=>
              posttribute(initialValues.id)
            }
          /> */}

</div>

{/* <Txtbox
                        name="email"
                        value="value"
                        class="w-100 form-control"
                        onChange={(e: any) => {
                           setFieldValue(e.target.value)
                        }}
                        placeHolder='jhondoe@mail.com'
                     
                      /> */}


                          </div>

                        </>) : null

                  }
                </div>



              </div>
            </>
          </div>
        </div>



      </div>

      <Tab/>
    </>
  );
};

export default Page;
