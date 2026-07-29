import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signUp, user, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)

  if (!loading && user) {
    return <Navigate to="/account" replace />
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      const needsConfirmation = await signUp(email, password)
      if (needsConfirmation) {
        setConfirmationSent(true)
      } else {
        navigate('/account', { replace: true })
      }
    } catch (err) {
      setError(err.message || 'Could not create account.')
    } finally {
      setSubmitting(false)
    }
  }

  if (confirmationSent) {
    return (
      <div className="max-w-[420px] mx-auto px-10 pt-20 pb-[90px] text-center animate-cp-fade">
        <h1 className="font-cinzel font-bold text-3xl mb-4 text-cp-cream-bright">
          Check your email
        </h1>
        <p className="text-cp-muted">
          We sent a confirmation link to {email}. Confirm it to finish creating
          your account, then sign in.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-[420px] mx-auto px-10 pt-20 pb-[90px] animate-cp-fade">
      <h1 className="font-cinzel font-bold text-3xl mb-8 text-cp-cream-bright text-center">
        Create Account
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
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password (min. 6 characters)"
          className="px-4 py-3.5 bg-cp-surface border border-cp-border rounded text-cp-cream text-[15px] font-garamond placeholder:text-cp-muted-3"
        />
        {error && <div className="text-sm text-cp-crimson-bright">{error}</div>}
        <Button type="submit" variant="solid" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
      <p className="text-sm text-cp-muted-2 text-center mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-cp-gold hover:text-cp-gold-bright">
          Sign in
        </Link>
      </p>
    </div>
  )
}
