import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RequireAuth({ children }) {
  const { loading, user } = useAuth()
  const location = useLocation()

  if (loading) {
    return <div className="text-center py-24 text-cp-muted">Checking session…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
