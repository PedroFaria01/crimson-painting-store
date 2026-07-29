import { Link } from 'react-router-dom'
import Button from '../components/Button'

export default function CheckoutCancel() {
  return (
    <div className="max-w-[1000px] mx-auto px-10 pt-12 pb-[90px] text-center animate-cp-fade">
      <div className="font-cinzel text-[13px] tracking-[3px] text-cp-gold uppercase mb-5">
        Payment Cancelled
      </div>
      <h1 className="font-cinzel font-bold text-4xl mb-[18px] text-cp-cream-bright">
        No charge was made
      </h1>
      <p className="text-[17px] text-cp-muted mb-8">
        Your cart is still waiting for you whenever you're ready.
      </p>
      <Button as={Link} to="/cart" variant="solid">
        Back to Cart
      </Button>
    </div>
  )
}
