import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { baseServerUrl } from './db'


export const authSlice = createSlice({
  name: 'authState',
  initialState: {
    sessionId: ''
  },
  reducers: {
    logIn: (state, action: PayloadAction<string>) => {
      console.log("We are logging in!")
      state.sessionId = action.payload
    },
    logOut: (state) => {
      console.log("We are logging out!")
      handleLogOut()
      state.sessionId = ''
    },
  },
})

const handleLogOut = async () => {
  fetch(`${baseServerUrl}/db/logout?_method=DELETE`, {
      method: 'POST', 
      mode: 'cors',
      headers: {
          'Content-Type': 'application/json',
          'Origin': "https://hoard.fyi"
        },
      credentials: 'include',
  })
  .then(response => response.json())
  .then(data => {
      console.log(data)
  })
}

export const getIsLoggedIn = 
  fetch(`${baseServerUrl}/db/isLoggedIn`, {
    method: 'GET', 
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
        'Origin': "https://hoard.fyi"
      },
    credentials: 'include',
  })
  .then(response => response.json())
  .then(data => data.isLoggedIn)

// Action creators are generated for each case reducer function
export const { logIn, logOut, } = authSlice.actions

export default authSlice.reducer