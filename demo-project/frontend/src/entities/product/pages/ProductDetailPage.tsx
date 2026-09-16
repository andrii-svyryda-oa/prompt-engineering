import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { useGetProductQuery } from '@/entities/product/api'
import { useAppDispatch } from '@/app/hooks'
import { addItem } from '@/entities/cart/cartSlice'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'
import { Label } from '@/shared/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>()
  const productId = Number(id)
  const dispatch = useAppDispatch()
  const [quantity, setQuantity] = useState(1)

  const { data: product, isLoading, isError } = useGetProductQuery(productId, {
    skip: Number.isNaN(productId),
  })

  if (Number.isNaN(productId)) {
    return (
      <div className="text-center py-24">
        <p className="text-destructive">Invalid product id.</p>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading product…</p>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="text-center py-24">
        <h2 className="text-lg font-semibold">Product not found</h2>
        <Button asChild variant="link" className="mt-4">
          <Link to="/">Back to catalog</Link>
        </Button>
      </div>
    )
  }

  const outOfStock = product.stock === 0

  function handleAddToCart() {
    const qty = Math.max(1, Math.min(quantity, product!.stock))
    dispatch(
      addItem({
        productId: product!.id,
        name: product!.name,
        price: product!.price,
        quantity: qty,
        maxStock: product!.stock,
      }),
    )
    toast.success(`Added ${qty} × ${product!.name} to cart`)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button asChild variant="ghost" className="mb-6 -ml-2">
        <Link to="/">
          <ArrowLeft className="h-4 w-4" />
          Back to catalog
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{product.name}</CardTitle>
              <CardDescription className="mt-2 text-base">
                {product.description ?? 'No description available.'}
              </CardDescription>
            </div>
            <Badge variant={outOfStock ? 'destructive' : 'secondary'}>
              {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-3xl font-bold">{formatPrice(product.price)}</p>

          {!outOfStock && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  max={product.stock}
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      Math.max(
                        1,
                        Math.min(
                          parseInt(e.target.value, 10) || 1,
                          product.stock,
                        ),
                      ),
                    )
                  }
                  className="w-24"
                />
              </div>
              <Button onClick={handleAddToCart} className="sm:flex-1">
                Add to cart
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
