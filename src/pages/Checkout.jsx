import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { startCheckout } from '../services/orders'

const EMPTY_FORM = { name: '', email: '', address: '', city: '', postalCode: '' }

function buildRedirectUrl(path) {
  return `${window.location.origin}${import.meta.env.BASE_URL}${path}`
}

export default function Checkout() {
  const { user } = useAuth()
  const { cartItems, cart, subtotalDisplay, shippingDisplay, totalDisplay } = useCart()
  const [form, setForm] = useState(() =>
    user?.email ? { ...EMPTY_FORM, email: user.email } : EMPTY_FORM
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function placeOrder(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const { url, orderNumber } = await startCheckout({
        items: cart.map((c) => ({ productId: c.productId, quantity: c.qty })),
        customer: form,
        successUrl: buildRedirectUrl('checkout/success?session_id={CHECKOUT_SESSION_ID}'),
        cancelUrl: buildRedirectUrl('checkout/cancel'),
      })
      // Stashed so the success page can greet the customer by order number
      // without needing a public read policy on the orders table.
      window.sessionStorage.setItem('cp-last-order-number', orderNumber)
      window.location.href = url
    } catch (err) {
      setError(err.message || 'Could not start checkout. Please try again.')
      setSubmitting(false)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="max-w-[1000px] mx-auto px-10 pt-12 pb-[90px] text-center animate-cp-fade">
        <p className="text-cp-muted mb-6">Your cart is empty.</p>
        <Button as={Link} to="/catalog" variant="solid">
          View Catalog
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-[1000px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
      <h1 className="font-cinzel font-bold text-[34px] mb-8 text-cp-cream-bright">
        Checkout
      </h1>
      <form
        onSubmit={placeOrder}
        className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 items-start"
      >
        <div className="flex flex-col gap-4">
          <input
            required
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Full name"
            className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(e) => updateField('email', e.target.value)}
            placeholder="Email"
            className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
          />
          <input
            required
            value={form.address}
            onChange={(e) => updateField('address', e.target.value)}
            placeholder="Address"
            className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              required
              value={form.city}
              onChange={(e) => updateField('city', e.target.value)}
              placeholder="City"
              className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
            />
            <input
              required
              value={form.postalCode}
              onChange={(e) => updateField('postalCode', e.target.value)}
              placeholder="Postal Code"
              className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
            />
          </div>

          <div className="font-cinzel text-sm tracking-wide uppercase text-cp-cream mt-4">
            Payment
          </div>
          <p className="text-sm text-cp-muted-2">
            You'll enter your card details securely on the next screen.
          </p>

          {error && <div className="text-sm text-cp-crimson-bright">{error}</div>}
        </div>

        <div className="bg-cp-surface border border-cp-border rounded-md p-[26px]">
          <div className="font-cinzel text-lg font-bold mb-5 text-cp-cream-bright">
            Your Order
          </div>
          <div className="flex justify-between text-[15px] text-cp-muted mb-2.5">
            <span>Subtotal</span>
            <span>{subtotalDisplay}</span>
          </div>
          <div className="flex justify-between text-[15px] text-cp-muted mb-[18px]">
            <span>Shipping</span>
            <span>{shippingDisplay}</span>
          </div>
          <div className="flex justify-between font-cinzel text-[19px] font-bold text-cp-cream-bright border-t border-cp-border pt-4 mb-6">
            <span>Total</span>
            <span>{totalDisplay}</span>
          </div>
          <Button type="submit" variant="solid" className="w-full" disabled={submitting}>
            {submitting ? 'Redirecting to payment…' : 'Continue to Payment'}
          </Button>
        </div>
      </form>
    </div>
  )
}
