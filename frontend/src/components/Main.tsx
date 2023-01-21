import CreateAccount from "./CreateAccount";
import Database from "./Database";
import GameCard, { GameCardTest } from "./GameCard";

export default function Main() {
    return (
        <main className={`flex h-full flex-col justify-center items-center bg-slate-400`}>
            <div className={`w-5/6`}>
                {/* <section className="flex flex-col items-center w-10/12">
                    <h1 className="font-bold text-6xl">Your Backlog</h1>
                    <Database />
                </section> */}

                {/* <GameCardTest /> */}
                <CreateAccount />
            </div>
        </main>
    )
}