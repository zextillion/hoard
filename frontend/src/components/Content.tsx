import React, { ChangeEvent } from 'react'
import { logOut } from '../middleware/auth'
import store from '../middleware/store'
import Database from './Database'
import { GameBannerTest } from './GameBanner'


export default function Content() {
    function handleLogOut(event:React.MouseEvent) {
        store.dispatch(logOut())
    }

    return (
        <div>
            <h1 className="flex bg-orange-400 justify-center text-6xl">Hoard</h1>                
            <section className="flex flex-col items-center w-10/12">
                <h1 className="font-bold text-6xl">Your Backlog</h1>
                <Database />
            </section>

            <button onClick={handleLogOut}>Log Out</button>
        </div>
    )
}