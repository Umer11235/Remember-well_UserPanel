import { ItextBox } from "./interface";

const TextInput = ({label,placeholder,customClass,onchange,name}:ItextBox) => {
  return (
    <>
      <div className={`${customClass || ""} form-group`}>
        <label>{label}</label>
        <input type="text" name={name} className="form-control" onChange={onchange} placeholder={placeholder} />
    
      </div>
    </>
  );
};

export default TextInput
