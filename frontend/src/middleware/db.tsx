import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const authToken = "PLEASE LET ME IN" // Update every now and then
export const baseServerUrl = "https://hoard-api.onrender.com"

export const dbSlice = createSlice({
  name: 'db',
  initialState: {
  },
  reducers: {
  },
})

export const dbApi = createApi({
  reducerPath: 'dbApi',
  baseQuery: fetchBaseQuery({ baseUrl: `${baseServerUrl}/db` }),
  endpoints: (builder) => ({

    createUser: builder.query<any, object> ({
      query: (body) => ({
        url: '/createUser',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authToken,
          'Origin': "https://hoard.fyi"
        },
        body: body
      })
    }),
    
    login: builder.query<any, object> ({
      query: (body) => ({
        url: '/login',
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': authToken,
          'Origin': "https://hoard.fyi"
        },
        body: body
      })
    }),
    
  })
})


export const { } = dbSlice.actions
export const { useCreateUserQuery, useLoginQuery } = dbApi

export default dbSlice.reducer