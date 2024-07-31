import { Idropdown } from "./interface";

function Dropdown(props:Idropdown) {
    return ( 

<>
<label>Language</label>
        <select className="form-select mt-3" aria-label="Default select example" onChange={props.onchange} name={props.name}>
  <option selected>{props.select}</option>
{props.options.map((option,i)=>{
return(
    <option value={option.value} key={i} >{option.label}</option>
)
})}
 
</select>

</>

     );
}

export default Dropdown;