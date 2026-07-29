import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { signIn, user, loading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (!loading && user) {
    return <Navigate to={location.state?.from?.pathname || '/account'} replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
      navigate(location.state?.from?.pathname || '/account', { replace: true })
    } catch {
      setError('Invalid email or password.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-[420px] mx-auto px-10 pt-20 pb-[90px] animate-cp-fade">
      <h1 className="font-cinzel font-bold text-3xl mb-8 text-cp-cream-bright text-center">
        Sign In
      </h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          required
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
        />
        <input
          required
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
        />
        {error && <div className="text-sm text-cp-crimson-bright">{error}</div>}
        <Button type="submit" variant="solid" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
      <p className="text-sm text-cp-muted-2 text-center mt-6">
        Don't have an account?{' '}
        <Link to="/signup" className="text-cp-gold hover:text-cp-gold-bright">
          Create one
        </Link>
      </p>
    </div>
  )
}
