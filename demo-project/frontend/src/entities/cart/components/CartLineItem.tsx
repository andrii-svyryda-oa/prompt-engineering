import { Trash2 } from 'lucide-react'
import type { CartItem } from '@/entities/cart/types'
import { formatPrice, lineTotal } from '@/lib/utils'
import { Button } from '@/shared/components/ui/button'
import { Input } from '@/shared/components/ui/input'

interface CartLineItemProps {
  item: CartItem
  onQuantityChange: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export function CartLineItem({
  item,
  onQuantityChange,
  onRemove,
}: CartLineItemProps) {
  return (
    <div className="flex flex-col gap-3 border-b py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1">
        <h3 className="font-medium">{item.name}</h3>
        <p className="text-sm text-muted-foreground">
          {formatPrice(item.price)} each · max {item.maxStock}
        </p>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor={`qty-${item.productId}`} className="sr-only">
            Quantity for {item.name}
          </label>
          <Input
            id={`qty-${item.productId}`}
            type="number"
            min={1}
            max={item.maxStock}
            value={item.quantity}
            onChange={(e) =>
              onQuantityChange(item.productId, parseInt(e.target.value, 10) || 1)
            }
            className="w-20"
          />
        </div>
        <p className="w-24 text-right font-medium">
          {formatPrice(lineTotal(item.price, item.quantity))}
        </p>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(item.productId)}
          aria-label={`Remove ${item.name} from cart`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
