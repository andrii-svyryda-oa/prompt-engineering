import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  clearCart,
  selectCartItems,
  selectCartTotal,
  syncStock,
} from '@/entities/cart/cartSlice'
import { useCreateOrderMutation } from '@/entities/order/api'
import { useGetProductsQuery } from '@/entities/product/api'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

function getStockErrorMessage(error: unknown): string {
  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    error.status === 409
  ) {
    const data = 'data' in error ? error.data : null
    if (typeof data === 'string') return data
    if (data && typeof data === 'object' && 'detail' in data) {
      const detail = (data as { detail: unknown }).detail
      if (typeof detail === 'string') return detail
      if (Array.isArray(detail)) {
        return detail.map((d) => String(d)).join(', ')
      }
    }
    return 'Insufficient stock for one or more items. Please update your cart.'
  }
  return 'Something went wrong. Please try again.'
}

export function CheckoutPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)
  const [createOrder, { isLoading }] = useCreateOrderMutation()
  const { refetch: refetchProducts } = useGetProductsQuery()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [stockError, setStockError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Your cart is empty. Add items before checking out.
        </p>
        <Button asChild>
          <Link to="/">Browse catalog</Link>
        </Button>
      </div>
    )
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStockError(null)
    setValidationError(null)

    const trimmedName = name.trim()
    if (trimmedName.length < 1 || trimmedName.length > 100) {
      setValidationError('Name must be between 1 and 100 characters.')
      return
    }
    if (!isValidEmail(email.trim())) {
      setValidationError('Please enter a valid email address.')
      return
    }

    try {
      const order = await createOrder({
        customer_name: trimmedName,
        customer_email: email.trim(),
        items: items.map((item) => ({
          product_id: item.productId,
          quantity: item.quantity,
        })),
      }).unwrap()

      dispatch(clearCart())
      toast.success('Order placed successfully!')
      navigate(`/orders/${order.id}`)
    } catch (err) {
      if (
        err &&
        typeof err === 'object' &&
        'status' in err &&
        err.status === 409
      ) {
        const message = getStockErrorMessage(err)
        setStockError(message)
        toast.error(message)

        const { data: products } = await refetchProducts()
        if (products) {
          dispatch(
            syncStock(
              products.map((p) => ({ productId: p.id, stock: p.stock })),
            ),
          )
        }
      } else {
        const message = getStockErrorMessage(err)
        setValidationError(message)
        toast.error(message)
      }
    }
  }

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>

      <Card>
        <CardHeader>
          <CardTitle>Contact information</CardTitle>
          <CardDescription>
            Enter your name and email to place the order.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {stockError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
              >
                <p className="font-medium">Stock unavailable</p>
                <p className="mt-1">{stockError}</p>
                <p className="mt-2 text-muted-foreground">
                  Product stock has been refreshed. Please review your cart.
                </p>
              </div>
            )}
            {validationError && !stockError && (
              <div
                role="alert"
                className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive"
              >
                {validationError}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ada Lovelace"
                maxLength={100}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ada@example.com"
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <p className="text-sm font-medium">Order summary</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {items.map((item) => (
                  <li key={item.productId} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>
                      {formatPrice(parseFloat(item.price) * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between font-semibold pt-2">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 sm:flex-row">
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link to="/cart">Back to cart</Link>
            </Button>
            <Button type="submit" className="w-full sm:flex-1" disabled={isLoading}>
              {isLoading ? 'Placing order…' : 'Place order'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
