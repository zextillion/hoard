import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authToken = "PLEASE LET ME IN" // Update every now and then
const baseServerUrl = "https://hoard-api.onrender.com"

export const igdbSlice = createSlice({
  name: 'igdb',
  initialState: {
    accessToken: "",
    games: {}
  },
  reducers: {
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload.valueOf()
    },
    setGames: (state, action: PayloadAction<object>) => {
      state.games = action.payload
    }
  },
})

export const igdbApi = createApi({
  reducerPath: 'igdbApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseServerUrl}/igdb` }),
  endpoints: (builder) => ({

    games: builder.query<any, Array<string> > ({
      query: (fields) => ({
        url: '/games',
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Authorization': authToken,
          'Origin': "https://hoard.fyi"
        },
        body: `${fields.toString()}`
      })
    }),

    covers: builder.query<any, Array<number>> ({
      query: (coverIds) => ({
        url: '/covers',
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Authorization': authToken,
          'Origin': "https://hoard.fyi"
        },
        body: coverIds.toString()
      })
    }),
    
    releaseDates: builder.query<any, Array<number>> ({
      query: (coverIds) => ({
        url: '/releaseDates',
        method: 'POST',
        headers: {
          'Accept': 'text/plain',
          'Authorization': authToken,
          'Origin': "https://hoard.fyi"
        },
        body: coverIds.toString()
      })
    }),
    
  })
})


export const { setAccessToken, setGames } = igdbSlice.actions
export const { useGamesQuery, useCoversQuery, useReleaseDatesQuery } = igdbApi

export default igdbSlice.reducer