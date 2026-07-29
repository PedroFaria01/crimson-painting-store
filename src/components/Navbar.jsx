import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const { user } = useAuth()

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between gap-6 px-10 py-3.5 bg-cp-bg-nav backdrop-blur-[10px] border-b border-cp-border">
      <Link to="/" className="flex items-center gap-3.5 cursor-pointer">
        <img
          src="/crimson-logo.png"
          alt="Crimson Painting"
          className="w-[52px] h-[52px] object-contain"
        />
        <div className="font-cinzel font-bold text-xl tracking-wide text-cp-cream">
          CRIMSON<span className="text-cp-gold"> PAINTING</span>
        </div>
      </Link>

      <div className="flex items-center gap-8 font-cinzel text-[13px] tracking-[1.5px] uppercase">
        <Link to="/" className="text-cp-cream-dim hover:text-cp-gold transition-colors">
          Home
        </Link>
        <Link
          to="/catalog"
          className="text-cp-cream-dim hover:text-cp-gold transition-colors"
        >
          Catalog
        </Link>
        <Link
          to="/catalog?category=custom"
          className="text-cp-cream-dim hover:text-cp-gold transition-colors"
        >
          Custom Order
        </Link>
        <Link
          to={user ? '/account' : '/login'}
          className="text-cp-cream-dim hover:text-cp-gold transition-colors"
        >
          {user ? 'My Account' : 'Login'}
        </Link>
        <Link to="/cart" className="relative cursor-pointer">
          <span className="text-cp-cream-dim hover:text-cp-gold transition-colors">
            Cart
          </span>
          {cartCount > 0 && (
            <span className="absolute -top-[10px] -right-[18px] bg-cp-crimson-bright text-cp-cream-bright text-[11px] font-garamond font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
