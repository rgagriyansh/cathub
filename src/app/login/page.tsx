'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
      router.refresh()
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-white grid-pattern noise-bg">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-12">
          <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center">
            <span className="text-white text-2xl">🐱</span>
          </div>
          <span className="font-[family-name:var(--font-syne)] font-bold text-2xl tracking-tight">
            CatHub
          </span>
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-[var(--border)] p-8 md:p-10 shadow-sm">
          <div className="text-center mb-8">
            <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-2">
              Welcome back
            </h1>
            <p className="text-[var(--muted)] text-sm">
              Sign in to continue to your dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-6 bg-black text-white py-3 rounded-xl font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-[var(--muted)] mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-black font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-[var(--muted)] mt-8">
          By signing in, you agree to our{' '}
          <Link href="#" className="underline">Terms</Link> and{' '}
          <Link href="#" className="underline">Privacy Policy</Link>
        </p>
      </div>
    </main>
  )
}
