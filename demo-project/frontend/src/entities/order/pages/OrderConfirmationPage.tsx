import { Link, useParams } from 'react-router-dom'
import { useGetOrderQuery } from '@/entities/order/api'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export function OrderConfirmationPage() {
  const { id } = useParams<{ id: string }>()
  const orderId = Number(id)

  const { data: order, isLoading, isError } = useGetOrderQuery(orderId, {
    skip: Number.isNaN(orderId),
  })

  if (Number.isNaN(orderId)) {
    return (
      <div className="text-center py-24">
        <p className="text-destructive">Invalid order id.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading order…</p>
      </div>
    )
  }

  if (isError || !order) {
    return (
      <div className="text-center py-24">
        <h2 className="text-lg font-semibold">Order not found</h2>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  const orderDate = new Date(order.created_at).toLocaleString()

  return (
    <div className="max-w-lg mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Order confirmed</h1>
        <p className="text-muted-foreground mt-2">
          Thank you, {order.customer_name}! Your order has been placed.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order #{order.id}</CardTitle>
          <CardDescription>Placed on {orderDate}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm space-y-1">
            <p>
              <span className="text-muted-foreground">Email:</span>{' '}
              {order.customer_email}
            </p>
          </div>

          <Separator />

          <ul className="space-y-3">
            {order.items.map((item) => (
              <li
                key={`${item.product_id}-${item.quantity}`}
                className="flex justify-between text-sm"
              >
                <span>
                  {item.product_name} × {item.quantity}
                </span>
                <span>
                  {formatPrice(parseFloat(item.unit_price) * item.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <Separator />

          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link to="/">Continue shopping</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
