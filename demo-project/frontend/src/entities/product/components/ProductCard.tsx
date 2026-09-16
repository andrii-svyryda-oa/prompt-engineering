import { Link } from 'react-router-dom'
import type { Product } from '@/entities/product/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/shared/components/ui/badge'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card'
import { Button } from '@/shared/components/ui/button'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const outOfStock = product.stock === 0

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          <Badge variant={outOfStock ? 'destructive' : 'secondary'}>
            {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
          </Badge>
        </div>
        {product.description && (
          <CardDescription className="line-clamp-2">
            {product.description}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-2xl font-semibold">{formatPrice(product.price)}</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" variant="outline" disabled={outOfStock}>
          <Link to={`/products/${product.id}`}>
            {outOfStock ? 'Unavailable' : 'View details'}
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
