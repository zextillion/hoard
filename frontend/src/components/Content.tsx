import React, { ChangeEvent } from 'react'
import { logOut } from '../redux/auth'
import store from '../redux/store'
import { GameCardTest } from './GameCard'


export default function Content() {
    function handleLogOut(event:React.MouseEvent) {
        store.dispatch(logOut())
    }

    return (
        <div>
            <GameCardTest />
            <button onClick={handleLogOut}>Log Out</button>
        </div>
    )
}