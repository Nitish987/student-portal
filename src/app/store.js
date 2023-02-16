import { configureStore } from '@reduxjs/toolkit'
import alertReducer from '../features/alert/AlertSlice'

export const store = configureStore({
  reducer: {
    alert: alertReducer,
  },
})