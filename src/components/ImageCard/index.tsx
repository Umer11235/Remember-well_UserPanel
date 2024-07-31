import Image from "next/image";
import Icons from "../customIcons";
import { Iimagecard } from "./interface";
import { ChangeEvent, useState } from "react";


function ImageCard(props:Iimagecard) {

    const [selectedImage, setSelectedImage] = useState<string>("");

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = () => {
            setSelectedImage(reader.result as string);
          };
          reader.readAsDataURL(file);
        }
       
      };

    return ( 

        <div className="profile_media_img">

        <Icons icon={props.icon}/>
        {/* <Image src={""} alt=""/> */}
        {/* <input type="file"  name="22" id="fileInput" accept="image/*" onChange={handleFileChange} />
 <img id="displayImage" src={selectedImage} style={{width:"170px" ,height:"170px"}} alt="Selected" /> */}

         </div>
     );
}

export default ImageCard;