import type { CreateOrderRequest, Order } from '@/entities/order/types'
import { api } from '@/app/api'

export const ordersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (body) => ({
        url: '/orders',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Product', id: 'LIST' }, 'Product'],
    }),
    getOrder: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Order', id }],
    }),
  }),
})

export const { useCreateOrderMutation, useGetOrderQuery } = ordersApi
