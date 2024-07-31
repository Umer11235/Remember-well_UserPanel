import { Itxtbox } from "./interface";


function Txtbox(props: Itxtbox) {
    return (
        props?.getFieldProps ? <input
            placeholder={props.placeHolder}
            className={props.class}
            {...props?.getFieldProps(props?.name)}
            onChange={props.onChange}
            value={props.value} />
        
            : <></>

    );
}

export default Txtbox;