export interface OrderItem {
  product_id: number
  product_name: string
  unit_price: string
  quantity: number
}

export interface Order {
  id: number
  customer_name: string
  customer_email: string
  total: string
  created_at: string
  items: OrderItem[]
}

export interface CreateOrderRequest {
  customer_name: string
  customer_email: string
  items: { product_id: number; quantity: number }[]
}
