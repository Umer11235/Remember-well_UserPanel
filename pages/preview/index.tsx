import { addtribute, checkPublicProfile, checkPurchasedOrNot2, get_medias, get_profile, get_start, get_start_public, gettribute, uploadBannerProfileForStar } from "@/API";
import ImageCard from "@/components/ImageCard";
import Button from "@/components/button";
import Icons from "@/components/customIcons";
import ImageUpload from "@/components/imageUpload";
import Dropdown from "@/components/inputs/dropdown";
import TextInput from "@/components/inputs/textbox";
import Tab from "@/components/tabs";
import TopNav from "@/components/topNav";
import { GetAlertMessage } from "@/utils";
import { AddTributeSchema } from "@/utils/schema";
import { ErrorMessage, Field, Form, Formik } from "formik";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useState } from "react";

const Page = () => {

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

  const [initialValues, setinitialValues] = React.useState({
    title: '',
    firstName: '',
    middleName: '',
    lastName: '',
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
  
  const CheckStar = (_data: string) => {
    try {

      setloading(true);
      (async () => {

        await checkPublicProfile(_data).then(x => {

          if (x && x?.isSuccess == true) {

            (async () => {
              await get_start_public(_data).then(x => {
                if (x && x?.isSuccess == true) {

                  setinitialValues({
                    title: x?.data?.title,
                    firstName: x?.data?.first_Name,
                    middleName: x?.data?.middle_Name,
                    lastName: x?.data?.last_Name,
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
  React.useEffect(() => {
    if (code != undefined) {
      (async () => {
        CheckStar(code)
      })()
    }


  }, [code])


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
    
      await gettribute(id).then(x => {
    
      
       
       setTributes(x.data);
       
       console.log(tributes)
      }).catch(ex => {
    
      });
    };
    
    useEffect(() => {
      gettingTribute(initialValues.id); // Fetch tributes when the component mounts
    }, [initialValues.id]); 

  return (
    <>
      <TopNav />
      <div className="ProfileContainer mb-100">


        <div className="profileCard">


          <div className="banner-btx">
            {selectedBanner != null || (initialValues.banner != null && initialValues.banner != '') ? <>
              <img alt="" src={selectedBanner != null ? URL.createObjectURL(selectedBanner) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + initialValues?.banner} />
            </> : <> </>}

       

          </div>

          <div className="pos-abs-1">
            <div className="ManageCard_profile profile-card__img" >
              {selectedImage != null || (initialValues.profile != null && initialValues.profile != '') ? <>
                <img alt="" src={selectedImage != null ? URL.createObjectURL(selectedImage) : process.env.NEXT_PUBLIC_BASE_IMAGE_URL + "/" + initialValues?.profile} />
              </> : <><p>A</p></>}


              

            </div>
          </div>

        </div>





        <div className="profileDetails">

          <p>In memory of</p>
          <p className="upper-case">{`${initialValues?.firstName ? initialValues?.firstName + " " + initialValues?.middleName + " " + initialValues?.lastName : "Anonymous"}`}</p>
          <p>{initialValues?.contact}</p>
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
                          {media.map(x=><ImageUpload hide={true} currentFile={x} _files={_files} _setFiles={_setFiles} code={
                            //@ts-ignore
                            x?.soul_Star_Id} setmedia={setmedia} media={media}/>)}
                         

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

      {/* <Tab/> */}
    </>
  );
};

export default Page;
