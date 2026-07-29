import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { formatEUR } from '../lib/format'
import { useProducts } from './ProductsContext'

const CartContext = createContext(null)
const STORAGE_KEY = 'crimson-painting-cart'
const FREE_SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 5

function readInitialCart() {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const { getProductById } = useProducts()
  const [cart, setCart] = useState(readInitialCart)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // localStorage unavailable (e.g. private browsing) — fail silently
    }
  }, [cart])

  function addToCart(productId, qty = 1) {
    setCart((prev) => {
      const existing = prev.find((c) => c.productId === productId)
      if (existing) {
        return prev.map((c) =>
          c.productId === productId ? { ...c, qty: c.qty + qty } : c
        )
      }
      return [...prev, { productId, qty }]
    })
  }

  function changeQty(productId, delta) {
    setCart((prev) =>
      prev
        .map((c) => (c.productId === productId ? { ...c, qty: c.qty + delta } : c))
        .filter((c) => c.qty > 0)
    )
  }

  function removeFromCart(productId) {
    setCart((prev) => prev.filter((c) => c.productId !== productId))
  }

  function clearCart() {
    setCart([])
  }

  // Cart entries reference product ids only; the product catalog (fetched
  // once via ProductsProvider) is joined in here so stale/removed products
  // drop out of the cart automatically instead of crashing the UI.
  const cartItems = useMemo(
    () =>
      cart
        .map((c) => {
          const product = getProductById(c.productId)
          if (!product) return null
          return { ...c, product }
        })
        .filter(Boolean),
    [cart, getProductById]
  )

  const cartCount = useMemo(() => cart.reduce((sum, c) => sum + c.qty, 0), [cart])

  const subtotal = useMemo(
    () =>
      cartItems.reduce((sum, item) => sum + item.product.priceNum * item.qty, 0),
    [cartItems]
  )

  const shipping = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const total = subtotal + shipping

  const value = {
    cart,
    cartItems,
    cartCount,
    subtotal,
    shipping,
    total,
    subtotalDisplay: formatEUR(subtotal),
    shippingDisplay: shipping === 0 ? 'Free' : formatEUR(shipping),
    totalDisplay: formatEUR(total),
    addToCart,
    changeQty,
    removeFromCart,
    clearCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within a CartProvider')
  return ctx
}
