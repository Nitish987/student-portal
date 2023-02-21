import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  data: null
}

export const bundleSlice = createSlice({
  name: 'bundle',
  initialState,
  reducers: {
    setNewData: (state, action) => {
      state.data = action.payload.data;
    }
  },
})

export const { setNewData } = bundleSlice.actions
export default bundleSlice.reducer