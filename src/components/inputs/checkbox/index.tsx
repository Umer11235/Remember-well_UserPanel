import { Icheckbox } from "./interface";



function Checkbox(props: Icheckbox) {
  return (

    <div className="form-check">
      <input onChange={(e)=>{
       }} className="form-check-input" type="radio" name="flexRadioDefault" checked={props.checked} />
      <label className="form-check-label" >
        {props.label}
      </label>
    </div>
  );
}

export default Checkbox;