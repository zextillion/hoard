import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import {  User } from 'firebase/auth';

export const authSlice = createSlice({
  name: 'authState',
  initialState: {
    user: {} as User,
    token: ""
  },
  reducers: {
    logIn: (state, action: PayloadAction<{user: User, token: string}>) => {
      state.user = action.payload.user
      state.token = action.payload.token
    },
    logOut: (state) => {
      state.user = {} as User
      state.token = ""
    }
  },
})

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer