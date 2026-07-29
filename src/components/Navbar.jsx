import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Catalog' },
  { to: '/catalog?category=custom', label: 'Custom Order' },
]

function AccountLink({ user }) {
  return (
    <Link
      to={user ? '/account' : '/login'}
      className="text-cp-cream-dim hover:text-cp-gold transition-colors"
    >
      {user ? 'My Account' : 'Login'}
    </Link>
  )
}

function CartLink({ cartCount, onClick }) {
  return (
    <Link to="/cart" onClick={onClick} className="relative cursor-pointer">
      <span className="text-cp-cream-dim hover:text-cp-gold transition-colors">Cart</span>
      {cartCount > 0 && (
        <span className="absolute -top-[10px] -right-[18px] bg-cp-crimson-bright text-cp-cream-bright text-[11px] font-garamond font-semibold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {cartCount}
        </span>
      )}
    </Link>
  )
}

export default function Navbar() {
  const { cartCount } = useCart()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center gap-4 md:gap-6 px-6 md:px-10 py-3.5 bg-cp-bg-nav backdrop-blur-[10px] border-b border-cp-border">
        {/* Hamburger sits left of the logo, mobile only */}
        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="md:hidden text-cp-cream-dim hover:text-cp-gold transition-colors text-2xl leading-none"
        >
          ☰
        </button>

        <Link to="/" className="flex items-center gap-3.5 cursor-pointer">
          <img
            src={`${import.meta.env.BASE_URL}crimson-logo.png`}
            alt="Crimson Painting"
            className="w-[52px] h-[52px] object-contain"
          />
          <div className="font-cinzel font-bold text-xl tracking-wide text-cp-cream">
            CRIMSON<span className="text-cp-gold"> PAINTING</span>
          </div>
        </Link>

        <div className="flex-1" />

        {/* Desktop nav: everything inline, no drawer */}
        <div className="hidden md:flex items-center gap-8 font-cinzel text-[13px] tracking-[1.5px] uppercase">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-cp-cream-dim hover:text-cp-gold transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <AccountLink user={user} />
          <CartLink cartCount={cartCount} />
        </div>

        {/* Mobile: only the account link stays in the header */}
        <div className="flex md:hidden font-cinzel text-[13px] tracking-[1.5px] uppercase">
          <AccountLink user={user} />
        </div>
      </nav>

      {/* Mobile drawer: always mounted, animated via transform/opacity so it
          can start closed and slide in instead of popping in on toggle. */}
      <div
        className={`fixed inset-0 z-[60] md:hidden transition-opacity duration-300 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden={!menuOpen}
      >
        <div className="absolute inset-0 bg-black/60" onClick={() => setMenuOpen(false)} />
        <div
          className={`absolute top-0 left-0 h-full w-72 max-w-[80%] bg-cp-bg-nav border-r border-cp-border flex flex-col p-6 gap-8 transition-transform duration-300 ${
            menuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="font-cinzel text-xs tracking-[1.5px] uppercase text-cp-gold">
              Menu
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="Close menu"
              className="text-cp-cream-dim hover:text-cp-gold transition-colors text-2xl leading-none"
            >
              ×
            </button>
          </div>
          <div className="flex flex-col gap-6 font-cinzel text-[13px] tracking-[1.5px] uppercase">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className="text-cp-cream-dim hover:text-cp-gold transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <CartLink cartCount={cartCount} onClick={() => setMenuOpen(false)} />
          </div>
        </div>
      </div>
    </>
  )
}
