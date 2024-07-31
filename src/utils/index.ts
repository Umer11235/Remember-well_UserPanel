import { confirmAlert } from 'react-confirm-alert'; // Import

export const GetAlertMessage=(title:string,message:string,setloading:any)=>{
    return  confirmAlert({
      title: title,
      message:message,
      buttons: [
        {
          label: 'Close',
          onClick: () => {
            setloading(false)
          }
        }
      ]
    });
}