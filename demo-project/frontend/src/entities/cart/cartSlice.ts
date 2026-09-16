import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { CartItem } from '@/entities/cart/types'

interface CartState {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

interface AddItemPayload {
  productId: number
  name: string
  price: string
  quantity: number
  maxStock: number
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<AddItemPayload>) {
      const { productId, name, price, quantity, maxStock } = action.payload
      const existing = state.items.find((item) => item.productId === productId)

      if (existing) {
        existing.quantity = Math.min(existing.quantity + quantity, maxStock)
        existing.maxStock = maxStock
        existing.price = price
        existing.name = name
      } else {
        state.items.push({
          productId,
          name,
          price,
          quantity: Math.min(quantity, maxStock),
          maxStock,
        })
      }
    },
    updateQuantity(
      state,
      action: PayloadAction<{ productId: number; quantity: number }>,
    ) {
      const item = state.items.find(
        (i) => i.productId === action.payload.productId,
      )
      if (!item) return

      const qty = Math.max(1, Math.min(action.payload.quantity, item.maxStock))
      item.quantity = qty
    },
    removeItem(state, action: PayloadAction<number>) {
      state.items = state.items.filter(
        (item) => item.productId !== action.payload,
      )
    },
    clearCart(state) {
      state.items = []
    },
    syncStock(
      state,
      action: PayloadAction<{ productId: number; stock: number }[]>,
    ) {
      for (const { productId, stock } of action.payload) {
        const item = state.items.find((i) => i.productId === productId)
        if (item) {
          item.maxStock = stock
          if (item.quantity > stock) {
            item.quantity = Math.max(1, stock)
          }
        }
      }
    },
  },
})

export const { addItem, updateQuantity, removeItem, clearCart, syncStock } =
  cartSlice.actions

export const selectCartItems = (state: { cart: CartState }) => state.cart.items

export const selectCartItemCount = (state: { cart: CartState }) =>
  state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0,
  )

export default cartSlice.reducer
