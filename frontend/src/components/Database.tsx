import axios from "axios"
import { useAppDispatch, useAppSelector } from "../redux/hooks"
import igdb, { igdbApi, setGames } from "../redux/igdb"
import GameCard, { GameData, GameProperties } from "./GameCard"

export default function Database() {
    const dispatch = useAppDispatch()

    const gameFields = [
        "cover",
        "genres",
        "name",
        "rating",
        "rating_count",
        "release_dates",
        "similar_games",
        "storyline",
        "summary"]
    const res = igdbApi.useGamesQuery(gameFields)
    const games = res.data
    games && dispatch(setGames(games.data))
    const element = games && games.map((game:GameProperties) => {
        return <GameCard data={game} />
    })

    return (
        <div className="flex flex-col gap-4">
            {element}
        </div>
    )
}
