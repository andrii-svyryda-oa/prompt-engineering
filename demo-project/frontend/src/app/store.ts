import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/app/api'
import '@/entities/product/api'
import '@/entities/order/api'
import cartReducer from '@/entities/cart/cartSlice'

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
