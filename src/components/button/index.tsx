import { useRouter } from "next/navigation";
import Icons from "../customIcons";
import { IButton } from "./interface";
import CustomLoader from '@/components/loader';

const Button = ({ title, onClick, customClass,icon,isLoading }: IButton) => {
  
  
  
  return (
    <button  disabled={isLoading} type="button" className={`${customClass || ""}`} onClick={onClick}  name="onSubmit" >

      {
        isLoading==true?<>
        <CustomLoader/>
       {/* {alert(isLoading)} */}
        </>:<>
       
        {

      
icon?<span className="mx-1">
<Icons icon={icon}/>
</span>:<></>
}
{title}
      
        </>
      
      }
      
    </button>
  
);
alert(isLoading);
};

export default Button;
