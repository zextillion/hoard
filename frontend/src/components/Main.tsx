import { useAppSelector } from '../redux/hooks';
import LoggedOutScreen from "./LoggedOutScreen";
import Content from "./Content";
import { getCookie } from 'typescript-cookie';
import store from '../redux/store';
import { logIn } from '../redux/auth';
import React from 'react';

export default function Main() {
    const session = useAppSelector(state => state.authState.session)
    React.useEffect(() => {
        const sessionCookie = getCookie('session')
        if (sessionCookie) {
            store.dispatch(logIn(sessionCookie))
        }
    }, [session]);
    
    return (
        <main className={`flex h-full flex-col justify-center items-center bg-slate-400`}>
            <div className={`w-5/6`}>
                {/* <section className="flex flex-col items-center w-10/12">
                    <h1 className="font-bold text-6xl">Your Backlog</h1>
                    <Database />
                </section> */}

                { session != '' ? <Content /> : <LoggedOutScreen /> }
            </div>
        </main>
    )
}