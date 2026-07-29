import { useEffect, useState } from 'react'
import { formatEUR } from '../../lib/format'
import { fetchOrdersForAdmin, updateOrderStatus } from '../../services/orders'

const STATUSES = ['pending', 'paid', 'fulfilled', 'cancelled']

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  async function reload() {
    setLoading(true)
    setError(null)
    try {
      setOrders(await fetchOrdersForAdmin())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  async function handleStatusChange(order, status) {
    setError(null)
    try {
      const updated = await updateOrderStatus(order.id, status)
      setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, ...updated } : o)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <p className="text-cp-muted-2 py-8">Loading orders…</p>
  if (error) return <p className="text-cp-crimson-bright py-8">{error}</p>
  if (orders.length === 0) return <p className="text-cp-muted-2 py-8">No orders yet.</p>

  return (
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
                {order.customer_name} · {order.customer_email} ·{' '}
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-cinzel text-cp-cream-bright">
                {formatEUR(order.total_cents / 100)}
              </span>
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order, e.target.value)}
                className="px-3 py-2 bg-cp-bg border border-cp-border rounded text-cp-cream text-xs uppercase font-cinzel tracking-wide"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
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
  )
}
