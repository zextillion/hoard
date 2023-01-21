import React, { MouseEvent } from "react";
import './Dropdown.css'
// import { ReactComponent as GreenCheckmark} from '../../assets/images/green_checkmark.svg'

export default function DropdownMenu(props:any) {
    const [value, setValue] = React.useState('')

    function handleItemSelected(item:string)
    {
        setValue(item)
        props.handleItemSelected(item)
    }

    function DropdownItem(props: any) {
        function onSelected(){
            props.onClick(props.value)
        }
        return (
            <div className="dropdown-item" onClick={onSelected}>
                { props.leftIcon && <span className="icon-button-left">{props.leftIcon}</span> }
                {props.children}
                { props.rightIcon && <span className="icon-button-right">{props.rightIcon}</span> }
            </div>
        )
    }
    return (
        <div className="dropdown">
            {/* <DropdownItem leftIcon={<GreenCheckmark />} onClick={handleItemSelected} value='notInterested'>Not interested</DropdownItem>
            <DropdownItem leftIcon={<GreenCheckmark />} onClick={handleItemSelected} value='inBacklog'>In backlog</DropdownItem>
            <DropdownItem leftIcon={<GreenCheckmark />} onClick={handleItemSelected} value='inProgress'>In progress</DropdownItem>
            <DropdownItem leftIcon={<GreenCheckmark />} onClick={handleItemSelected} value='finished'>Finished</DropdownItem>
            <DropdownItem leftIcon={<GreenCheckmark />} onClick={handleItemSelected} value='dropped'>Dropped</DropdownItem> */}
        </div>
    )
}