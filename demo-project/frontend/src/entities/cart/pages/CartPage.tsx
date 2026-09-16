import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import {
  removeItem,
  selectCartItems,
  selectCartTotal,
  updateQuantity,
} from '@/entities/cart/cartSlice'
import { CartLineItem } from '@/entities/cart/components/CartLineItem'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Separator } from '@/shared/components/ui/separator'

export function CartPage() {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectCartItems)
  const total = useAppSelector(selectCartTotal)

  if (items.length === 0) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-3xl font-bold tracking-tight mb-2">Your cart</h1>
        <p className="text-muted-foreground mb-8">Your cart is empty.</p>
        <Button asChild>
          <Link to="/">Browse catalog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Your cart</h1>

      <Card>
        <CardHeader>
          <CardTitle>{items.length} item{items.length !== 1 ? 's' : ''}</CardTitle>
        </CardHeader>
        <CardContent>
          {items.map((item) => (
            <CartLineItem
              key={item.productId}
              item={item}
              onQuantityChange={(productId, quantity) =>
                dispatch(updateQuantity({ productId, quantity }))
              }
              onRemove={(productId) => dispatch(removeItem(productId))}
            />
          ))}
          <Separator className="my-4" />
          <div className="flex justify-between text-lg font-semibold">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link to="/">Continue shopping</Link>
          </Button>
          <Button asChild className="w-full sm:flex-1">
            <Link to="/checkout">Proceed to checkout</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
