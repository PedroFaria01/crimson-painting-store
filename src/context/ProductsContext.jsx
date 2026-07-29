import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { fetchActiveProducts, fetchCategories } from '../services/products'

const ProductsContext = createContext(null)

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([{ key: 'all', label: 'All' }])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const reload = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [cats, prods] = await Promise.all([fetchCategories(), fetchActiveProducts()])
      setCategories(cats)
      setProducts(prods)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    reload()
  }, [reload])

  const value = useMemo(
    () => ({
      products,
      categories,
      loading,
      error,
      reload,
      getProductById: (id) => products.find((p) => p.id === id),
      getProductBySlug: (slug) => products.find((p) => p.slug === slug),
    }),
    [products, categories, loading, error, reload]
  )

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>
}

export function useProducts() {
  const ctx = useContext(ProductsContext)
  if (!ctx) throw new Error('useProducts must be used within a ProductsProvider')
  return ctx
}
