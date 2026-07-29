import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { useProducts } from '../context/ProductsContext'

export default function Catalog() {
  const { products, categories, loading, error } = useProducts()
  const [searchParams] = useSearchParams()
  const initialCategory = searchParams.get('category') || 'all'
  const [activeCategory, setActiveCategory] = useState(initialCategory)

  // Keep in sync if the user arrives via a fresh link (e.g. "Custom Order" nav item)
  useEffect(() => {
    const fromUrl = searchParams.get('category')
    if (fromUrl && categories.some((c) => c.key === fromUrl)) {
      setActiveCategory(fromUrl)
    }
  }, [searchParams, categories])

  const filteredProducts =
    activeCategory === 'all'
      ? products
      : products.filter((p) => p.category === activeCategory)

  return (
    <div className="max-w-[1200px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
      <h1 className="font-cinzel font-bold text-[34px] mb-7 text-cp-cream-bright">
        Catalog
      </h1>

      <div className="flex gap-3 flex-wrap mb-10">
        {categories.map((c) => {
          const active = c.key === activeCategory
          return (
            <button
              key={c.key}
              onClick={() => setActiveCategory(c.key)}
              className={`px-5 py-2.5 rounded font-cinzel text-xs tracking-wide uppercase font-semibold cursor-pointer transition-colors ${
                active
                  ? 'bg-cp-crimson text-cp-cream-bright border border-cp-crimson-bright'
                  : 'bg-transparent text-cp-muted border border-cp-border hover:border-cp-gold-dim'
              }`}
            >
              {c.label}
            </button>
          )
        })}
      </div>

      {error ? (
        <p className="text-cp-muted-2 text-center py-16">
          Could not load the catalog. Please try again shortly.
        </p>
      ) : loading ? (
        <p className="text-cp-muted-2 text-center py-16">Loading products…</p>
      ) : filteredProducts.length === 0 ? (
        <p className="text-cp-muted-2 text-center py-16">
          No products found in this category.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} showDesc imgHeight="h-[190px]" />
          ))}
        </div>
      )}
    </div>
  )
}
