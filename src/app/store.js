import { configureStore } from '@reduxjs/toolkit'
import alertReducer from '../features/alert/AlertSlice'
import userReducer from '../features/user/userSlice'
import bundleReducer from '../features/bundle/bundleSlice'

export const store = configureStore({
  reducer: {
    alert: alertReducer,
    user: userReducer,
    bundle: bundleReducer
  },
})