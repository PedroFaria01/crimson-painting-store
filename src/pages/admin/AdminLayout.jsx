import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const TABS = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/orders', label: 'Orders' },
]

export default function AdminLayout() {
  const { signOut, user } = useAuth()
  const navigate = useNavigate()

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="max-w-[1200px] mx-auto px-10 pt-10 pb-[90px] w-full box-border animate-cp-fade">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <h1 className="font-cinzel font-bold text-[28px] text-cp-cream-bright">
          Admin
        </h1>
        <div className="flex items-center gap-5">
          <span className="text-sm text-cp-muted-2">{user?.email}</span>
          <button
            onClick={handleSignOut}
            className="font-cinzel text-xs tracking-wide uppercase text-cp-gold hover:text-cp-gold-bright"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-8 border-b border-cp-border">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `font-cinzel text-xs tracking-wide uppercase px-4 py-3 border-b-2 -mb-px transition-colors ${
                isActive
                  ? 'border-cp-crimson-bright text-cp-cream-bright'
                  : 'border-transparent text-cp-muted hover:text-cp-cream'
              }`
            }
          >
            {tab.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
