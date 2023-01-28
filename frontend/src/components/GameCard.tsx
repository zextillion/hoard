import React, { ChangeEvent } from 'react'
import { igdbApi } from '../redux/igdb'
import DropdownMenu from './Dropdown/DropdownMenu'

export interface GameProperties {
    id: number,
    cover: number,
    genres: Array<number>,
    name: string,
    release_dates: Array<number>,
    summary: string,
    similar_games: Array<number>
}

export interface GameData {
    data: GameProperties
}

export default function GameCard({data}:GameData) {
    const [progress, setProgress] = React.useState('')
    function onProgressSelected(value:string) {
        setProgress(value)
    }

    const coverUrl = igdbApi.useCoversQuery([data.cover])?.data?.[0]?.url
    const releaseDate = new Date(igdbApi.useReleaseDatesQuery(data.release_dates)?.data?.[0]?.date * 1000)
    let backgroundColor = ''
    let progressText = ""
    switch (progress) {
        case 'notInterested':
            backgroundColor = 'bg-gray-200';
            progressText = 'Not interested';
            break;
        case 'inBacklog':
            backgroundColor = 'bg-yellow-200';
            progressText = 'In backlog';
            break;
        case 'inProgress':
            backgroundColor = 'bg-blue-200';
            progressText = 'In progress';
            break;
        case 'finished':
            backgroundColor = 'bg-green-300';
            progressText = 'Finished';
            break;
        case 'dropped':
            backgroundColor = 'bg-red-300';
            progressText = 'Dropped';
            break;
        default:
            backgroundColor = 'bg-gray-600';
            progressText = 'Not interested';
            break;
    }

    function ProgressSelectButton(props:any) {
        const [open, setOpen] = React.useState(false)

        return (
            <div>
                <a href="#" className="ProgressSelectButton" onClick={() => setOpen(!open)}>
                    {props.icon}
                    <h3>{progressText}</h3>
                    { open && <DropdownMenu handleItemSelected={onProgressSelected} />}
                </a>
            </div>
        )
    }

    return (
        <div className={`flex p-4 gap-4 ${backgroundColor} rounded-3xl`}>
            <div className="w-24">
                { coverUrl && <img src={coverUrl} className="w-24" />}
            </div>
            <div className="flex flex-col w-full">
                <div className="flex justify-between items-center">
                    <h3 className="text-4xl font-bold">{data.name}</h3>
                    <ProgressSelectButton />
                </div>
                { !isNaN(releaseDate.getTime()) && <p className="italic text-xs">{releaseDate.toLocaleDateString()}</p>}
                { data.summary && <p className="my-3">{data.summary}</p> }
            </div>
        </div>
    )
}

export function GameCardTest() {
    const data = { id: 86463, cover: 169899, genres: [ 10, 14, 31, 32 ], name: 'Choo-Choo! Train Rides!', release_dates: [ 288953 ], similar_games: [ 25311, 25646, 80916, 96217, 105269, 106987, 111130, 113360, 113895, 118871 ], summary: 'Understand that your old world is no longer exists. You have only a locomotive, a pair of companions and tail of mutated wild animals that are hungry as never before. There are only a couple of ways to survive. Which one is better - it\'s up to you.' }
    
    return <GameCard data={data} />
}