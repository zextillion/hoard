import { useAppSelector } from '../middleware/hooks';
import LoggedOutScreen from "./LoggedOutScreen";
import Content from "./Content";

export default function Main() {
    const sessionId = useAppSelector(state => state.authState.sessionId)
    
    return (
        <main className={`flex h-full flex-col justify-center items-center bg-slate-400`}>
            <div className={`w-5/6`}>
                { sessionId ? <Content /> : <LoggedOutScreen /> }
            </div>
        </main>
    )
}