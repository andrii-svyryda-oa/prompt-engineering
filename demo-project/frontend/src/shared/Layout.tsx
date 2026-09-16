import { Link, Outlet } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { Badge } from '@/shared/components/ui/badge'
import { useAppSelector } from '@/app/hooks'
import { selectCartItemCount } from '@/entities/cart/cartSlice'

export function Layout() {
  const cartCount = useAppSelector(selectCartItemCount)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            MiniShop
          </Link>
          <nav className="flex items-center gap-6">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Catalog
            </Link>
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Cart
              {cartCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 min-w-5 justify-center px-1.5">
                  {cartCount}
                </Badge>
              )}
            </Link>
          </nav>
        </div>
      </header>
      <main className="container mx-auto flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        MiniShop demo — browse, cart, checkout
      </footer>
    </div>
  )
}
