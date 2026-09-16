import { useGetProductsQuery } from '@/entities/product/api'
import { ProductCard } from '@/entities/product/components/ProductCard'

export function CatalogPage() {
  const { data: products, isLoading, isError, error } = useGetProductsQuery()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Loading products…</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-center">
        <h2 className="text-lg font-semibold text-destructive">
          Failed to load catalog
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Make sure the backend is running at http://localhost:8000
        </p>
        {'status' in (error as object) && (
          <p className="mt-1 text-xs text-muted-foreground">
            Error status: {(error as { status: number }).status}
          </p>
        )}
      </div>
    )
  }

  if (!products?.length) {
    return (
      <div className="text-center py-24">
        <h2 className="text-lg font-semibold">No products available</h2>
        <p className="mt-2 text-muted-foreground">
          Check back later or seed the database.
        </p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-2">Catalog</h1>
      <p className="text-muted-foreground mb-8">
        Browse our products and add items to your cart.
      </p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
