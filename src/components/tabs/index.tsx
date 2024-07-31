import { useRouter } from "next/router";
import { FaHome, FaShopify } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const Tab = () => {
    const router = useRouter();
    return <>
    <div className="tab-bottom">
        <button onClick={() => {
            router.push("manage-account?type=stars");
        }}>
            <FaHome color="white" size={25} />
        </button>
        <button onClick={() => {
            window.open("https://03a1df-fa.myshopify.com/", '_blank');

           
        }}>
            <FaShopify color="white"  size={25}/>
        </button>
        <button onClick={() => {
            router.push("manage-account?type=setting");
        }}>
            <IoIosSettings color="white" size={25} />
        </button>
    </div>
    </>
    
}
export default Tab;