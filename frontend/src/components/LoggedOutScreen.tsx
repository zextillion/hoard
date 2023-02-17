import React, { ChangeEvent, FormEvent, MouseEventHandler } from "react"
import { getCookie } from "typescript-cookie"
import { logIn } from "../middleware/auth"
import store from "../middleware/store"
import CreateAccount from "./CreateAccount"
import InputField from "./InputField"
import LogInScreen from "./LogInScreen"

export enum Screens {
    LOG_IN,
    CREATE_ACCOUNT,
    FORGOT_PASSWORD
}

export default function LoggedOutScreen() {
    const [screen, setScreen] = React.useState(Screens.LOG_IN)


    switch (screen) {
        case Screens.LOG_IN:
            return <LogInScreen setScreen={setScreen} />
        case Screens.CREATE_ACCOUNT:
            return <CreateAccount setScreen={setScreen} />
        default:
            return <LogInScreen setScreen={setScreen} />
    }
}