import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  isLoggedIn: false,
  uid: null,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoggedIn: (state, action) => {
      state.isLoggedIn = true;
      state.uid = action.payload.uid;
    },
  },
})

export const { setLoggedIn } = authSlice.actions
export default authSlice.reducer