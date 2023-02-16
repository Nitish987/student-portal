import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  visible: false,
  message: "No message.",
  type: "primary"
}

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    showAlert: (state, action) => {
      state.visible = true;
      state.message = action.payload.message
    },
    dismissAlert: (state) => {
      state.visible = false;
      state.message = "";
    },
  },
})

export const { showAlert, dismissAlert } = alertSlice.actions
export default alertSlice.reducer