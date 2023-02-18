import { configureStore } from '@reduxjs/toolkit'
import alertReducer from '../features/alert/AlertSlice'
import userReducer from '../features/user/userSlice'

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    user: userReducer,
  },
})