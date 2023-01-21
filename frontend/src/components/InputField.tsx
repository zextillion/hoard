export interface InputFieldProperties {
    name: string
    label: string
    placeholder: string
    errorMessage: string
    type: string
    required: boolean
    onChange: React.ChangeEventHandler
    value: string
}

export default function InputField(props: InputFieldProperties) {
    const inputField = props.required ? 
        <input 
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            required onChange={props.onChange }
            value={props.value}
            className="inputField"/>
        : <input 
            type={props.type}
            name={props.name}
            placeholder={props.placeholder}
            onChange={props.onChange }
            value={props.value}
            className="inputField"/>

    return (
        <div className="flex flex-col gap-1">
            <div className="flex content-between justify-between">
                <label className="inputField--label">{props.label}</label>
                { props.required ? <label className="inputField--requiredLabel">*Required</label> : ""}
            </div>
            <label className="inputField--requiredLabel">{props.errorMessage}</label>
            {inputField}
        </div>
    )
}