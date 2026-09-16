import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Toaster } from 'sonner'
import { Layout } from '@/shared/Layout'
import { CatalogPage } from '@/entities/product/pages/CatalogPage'
import { ProductDetailPage } from '@/entities/product/pages/ProductDetailPage'
import { CartPage } from '@/entities/cart/pages/CartPage'
import { CheckoutPage } from '@/entities/order/pages/CheckoutPage'
import { OrderConfirmationPage } from '@/entities/order/pages/OrderConfirmationPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<CatalogPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders/:id" element={<OrderConfirmationPage />} />
        </Route>
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}
