import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  profile: null
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserProfileData: (state, action) => {
      state.profile = action.payload.profile;
    }
  },
})

export const { setUserProfileData } = userSlice.actions
export default userSlice.reducer