// prettier-ignore
import { RootState } from '@data/store'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

type SaleDataResponse = {
  pillPrice: string
  pharmacyIsOpen: boolean
  nftPrice: string
  soldOut: boolean
  pillSoldOut: boolean
  totalSupply: number
  error: string | undefined
}

interface SaleDataSate {
  loading: boolean
  nftPrice: string | undefined
  totalSupply: number
  pillPrice: string | undefined
  pharmacyIsOpen: boolean
  soldOut: boolean
  pillSoldOut: boolean
  error: string | undefined
  initialized: boolean
}

// Define the initial state using that type
const initialState: SaleDataSate = {
  loading: false,
  nftPrice: undefined,
  totalSupply: 0,
  pillPrice: undefined,
  pharmacyIsOpen: false,
  soldOut: false,
  pillSoldOut: false,
  error: undefined,
  initialized: false,
}

// eslint-disable-next-line no-unused-vars
const initSaleData = createAsyncThunk('saleData/init', async (_, thunkAPI) => {
  try {
    const { saleData } = thunkAPI.getState() as RootState

    if (!saleData.initialized) {
      const response = await fetch('/api/distributorStats', { method: 'GET' })
      const data = (await response.json()) as SaleDataResponse
      return data
    }

    return
  } catch (e) {
    throw new Error(`saleData/init\n\n${e}`)
  }
})

export const contractSlice = createSlice({
  name: 'saleData',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(initSaleData.fulfilled, (state, action) => {
      if (action.payload) {
        const {
          error,
          pharmacyIsOpen,
          nftPrice,
          pillPrice,
          soldOut,
          pillSoldOut,
          totalSupply,
        } = action.payload

        state.error = error
        state.pharmacyIsOpen = pharmacyIsOpen
        state.nftPrice = nftPrice
        state.totalSupply = totalSupply
        state.pillPrice = pillPrice
        state.soldOut = soldOut
        state.pillSoldOut = pillSoldOut
        state.initialized = true
      }

      state.loading = false
    })
    builder.addCase(initSaleData.pending, (state) => {
      state.loading = true
    })
    builder.addCase(initSaleData.rejected, (state) => {
      state.error = 'Initializing General Data failed. Please try again later.'
      state.loading = false
    })
  },
})

export { initSaleData }
export default contractSlice.reducer
