import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { ErrorType } from "constants/enum"

export interface AppState {
  size: {
    width: number
    height: number
  }
  errorType: ErrorType | null
  loading?: boolean
  modalOpened?: boolean
}

const initialState: AppState = {
  size: {
    width: 0,
    height: 0,
  },
  errorType: null,
  loading: false,
}

export const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setAppSize: (
      state,
      action: PayloadAction<{ width: number; height: number }>,
    ) => {
      state.size = action.payload
    },
    setError: (state, action: PayloadAction<ErrorType | null>) => {
      state.errorType = action.payload
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setOpenModal: (state, action: PayloadAction<boolean | undefined>) => {
      state.modalOpened = action.payload
    },
  },
})

export const { setAppSize, setError, setOpenModal, setLoading } =
  appSlice.actions

export default appSlice.reducer
