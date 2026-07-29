import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

export default function CheckoutSuccess() {
  const { clearCart } = useCart()
  const [orderNumber, setOrderNumber] = useState('')

  // Runs once: the cart must only be cleared after Stripe confirms payment,
  // never before the redirect (an abandoned/cancelled checkout should leave
  // the cart intact).
  useEffect(() => {
    setOrderNumber(window.sessionStorage.getItem('cp-last-order-number') || '')
    window.sessionStorage.removeItem('cp-last-order-number')
    clearCart()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
          {orderNumber ? `Order ${orderNumber} received. ` : ''}
          We'll send updates by email.
        </p>
        <Button as={Link} to="/" variant="solid" className="mt-6 inline-block">
          Back to Home
        </Button>
      </div>
    </div>
  )
}
