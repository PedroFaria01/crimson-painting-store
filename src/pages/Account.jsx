import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatEUR } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { fetchMyOrders } from '../services/orders'

export default function Account() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchMyOrders()
      .then(setOrders)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  return (
    <div className="max-w-[900px] mx-auto px-10 pt-12 pb-[90px] w-full box-border animate-cp-fade">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-cinzel font-bold text-[34px] text-cp-cream-bright">
            My Account
          </h1>
          <p className="text-sm text-cp-muted-2">{user.email}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="font-cinzel text-xs tracking-wide uppercase text-cp-gold hover:text-cp-gold-bright"
        >
          Sign Out
        </button>
      </div>

      <h2 className="font-cinzel text-lg font-bold mb-4 text-cp-cream-bright">
        My Orders
      </h2>

      {loading ? (
        <p className="text-cp-muted-2">Loading orders…</p>
      ) : error ? (
        <p className="text-cp-crimson-bright">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-cp-muted-2">
          No orders yet — orders placed while signed in will show up here.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-cp-surface border border-cp-border rounded-md p-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <div>
                  <div className="font-cinzel text-cp-cream-bright font-semibold">
                    {order.order_number}
                  </div>
                  <div className="text-xs text-cp-muted-2">
                    {new Date(order.created_at).toLocaleString()} · {order.status}
                  </div>
                </div>
                <span className="font-cinzel text-cp-cream-bright">
                  {formatEUR(order.total_cents / 100)}
                </span>
              </div>
              <div className="text-sm text-cp-muted-2">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span>
                      {item.quantity} × {item.product_name}
                    </span>
                    <span>{formatEUR((item.unit_price_cents * item.quantity) / 100)}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
