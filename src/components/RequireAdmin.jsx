import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAdmin({ children }) {
  const { loading, isAdmin } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="text-center py-24 text-cp-muted">Checking session…</div>
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />
  }

  return children
}
