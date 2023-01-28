import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export const authSlice = createSlice({
  name: 'authState',
  initialState: {
    session: ''
  },
  reducers: {
    logIn: (state, action: PayloadAction<string>) => {
      console.log("We are logging in!")
      state.session = action.payload
    },
    logOut: (state) => {
      state.session = ''
    }
  },
})

// Action creators are generated for each case reducer function
export const { logIn, logOut } = authSlice.actions

export default authSlice.reducer