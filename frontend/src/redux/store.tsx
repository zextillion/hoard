import { configureStore } from "@reduxjs/toolkit";
import authReducer from './auth'
import { igdbApi } from './igdb'
import igdbReducer from './igdb'
import { dbApi } from './db'
import dbReducer from './db'
import { twitchApi, useTwitchAuthQuery } from "./twitchAuth";
import { setupListeners } from "@reduxjs/toolkit/dist/query";

export const store = configureStore({
    reducer: {
        authState: authReducer,
        igdb: igdbReducer,
        db: dbReducer,
        [twitchApi.reducerPath]: twitchApi.reducer,
        [igdbApi.reducerPath]: igdbApi.reducer,
        [dbApi.reducerPath]: dbApi.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(
        twitchApi.middleware,
        igdbApi.middleware,
        dbApi.middleware)
})

// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export default store