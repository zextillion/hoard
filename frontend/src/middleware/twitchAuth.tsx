import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Authentication {
    access_token: string,
    expires_in: number,
    token_type: string
  }
  
  export const twitchApi = createApi({
    reducerPath: 'twitchApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://id.twitch.tv' }),
    endpoints: (builder) => ({
      twitchAuth: builder.query<Authentication, { client_id: string, client_secret: string}> ({
        query: ({client_id, client_secret}) => ({
          url: '/oauth2/token',
          method: 'POST',
          params: { 
            client_id: client_id,
            client_secret: client_secret,
            grant_type: "client_credentials"
          }
        })
      })
    })
  })

  export const { useTwitchAuthQuery } = twitchApi