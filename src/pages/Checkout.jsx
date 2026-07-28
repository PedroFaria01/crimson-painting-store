import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

const PAYMENT_METHODS = [
  { key: 'card', label: 'Card' },
  { key: 'banktransfer', label: 'Bank Transfer' },
]

const EMPTY_FORM = { name: '', email: '', address: '', city: '', postalCode: '' }

export default function Checkout() {
  const { cartItems, subtotalDisplay, shippingDisplay, totalDisplay, clearCart } =
    useCart()
  const [form, setForm] = useState(EMPTY_FORM)
  const [payment, setPayment] = useState('card')
  const [orderConfirmed, setOrderConfirmed] = useState(false)
  const [orderNumber, setOrderNumber] = useState('')

  function updateField(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  function placeOrder(e) {
    e.preventDefault()
    // NOTE: order number should be issued by the backend in production —
    // this random value is a placeholder to mirror the prototype's confirmation screen.
    const num = '#CP-' + Math.floor(10000 + Math.random() * 90000)
    setOrderNumber(num)
    setOrderConfirmed(true)
    clearCart()
  }

  if (cartItems.length === 0 && !orderConfirmed) {
    return (
      <div className="max-w-[1000px] mx-auto px-10 pt-12 pb-[90px] text-center animate-cp-fade">
        <p className="text-cp-muted mb-6">Your cart is empty.</p>
        <Button as={Link} to="/catalog" variant="solid">
          View Catalog
        </Button>
      </div>
    )
  }

  if (orderConfirmed) {
    return (
      <div className="max-w-[1000px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
        <div className="text-center py-[70px]">
          <div className="font-cinzel text-[13px] tracking-[3px] text-cp-gold uppercase mb-5">
            Order Confirmed
          </div>
          <h1 className="font-cinzel font-bold text-4xl mb-[18px] text-cp-cream-bright">
            Your order has departed for the forge
          </h1>
          <p className="text-[17px] text-cp-muted mb-2.5">
            Order {orderNumber} received. We'll send updates by email.
          </p>
          <Button
            as={Link}
            to="/"
            variant="solid"
            className="mt-6 inline-block"
          >
            Back to Home
          </Button>
        </div>
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
          <div className="flex gap-3">
            {PAYMENT_METHODS.map((m) => {
              const active = m.key === payment
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setPayment(m.key)}
                  className={`flex-1 px-3 py-3 rounded font-garamond text-sm cursor-pointer transition-colors ${
                    active
                      ? 'bg-cp-crimson text-cp-cream-bright border border-cp-crimson-bright'
                      : 'bg-transparent text-cp-muted border border-cp-border hover:border-cp-gold-dim'
                  }`}
                >
                  {m.label}
                </button>
              )
            })}
          </div>
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
          <Button type="submit" variant="solid" className="w-full">
            Confirm Order
          </Button>
        </div>
      </form>
    </div>
  )
}
