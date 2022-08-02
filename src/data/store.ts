import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user'
import operationsReducer from './slices/operations'
import saleDataReducer from './slices/saleData'

export const store = configureStore({
  reducer: {
    user: userReducer,
    OPPool: operationsReducer,
    saleData: saleDataReducer,
  },
  devTools: process.env.NODE_ENV != 'production',
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
