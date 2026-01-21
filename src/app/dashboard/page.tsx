import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Welcome Section */}
      <div className="mb-12">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl md:text-4xl font-bold mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-[var(--muted)]">
          Ready to continue working on your MBA applications?
        </p>
      </div>

      {/* Profile Completion Banner */}
      <div className="bg-gradient-to-r from-black to-black/80 text-white p-6 rounded-2xl mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-1">
              Complete Your Profile First! 📝
            </h2>
            <p className="text-white/70 text-sm">
              Fill in your details to generate personalized SOPs tailored to your background.
            </p>
          </div>
          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
          >
            Complete Profile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Link 
          href="/dashboard/profile"
          className="group bg-white p-8 rounded-2xl border-2 border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
            <span className="text-2xl">👤</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            My Profile
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Add your academics, work experience, achievements & career goals.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Fill Profile
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>

        {/* MBA Writer Card */}
        <Link 
          href="/dashboard/mba-writer"
          className="group bg-white p-8 rounded-2xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
            <span className="text-2xl">✍️</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            MBA Writer
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Generate compelling SOPs, essays, and application responses.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Start Writing
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>

        {/* CV Creator Card */}
        <Link 
          href="/dashboard/cv"
          className="group bg-white p-8 rounded-2xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
            <span className="text-2xl">📄</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            CV Creator
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Create a professional CV/resume from your profile data.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Create CV
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>

        {/* Reddit Card */}
        <Link 
          href="/dashboard/profile/share"
          className="group bg-white p-8 rounded-2xl border border-[var(--border)] hover:border-black transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
            <span className="text-2xl">🎴</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            Reddit Card
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Create shareable profile cards for Reddit & social media.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
            Create Card
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </span>
        </Link>

        {/* Interview Prep Card - Coming Soon */}
        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-60">
          <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-6">
            <span className="text-2xl">🎯</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            Interview Prep
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Practice with AI-powered mock interviews.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            Coming Soon
          </span>
        </div>

        {/* Essay Review Card - Coming Soon */}
        <div className="bg-white p-8 rounded-2xl border border-[var(--border)] opacity-60">
          <div className="w-14 h-14 bg-[#f5f5f5] rounded-2xl flex items-center justify-center mb-6">
            <span className="text-2xl">📝</span>
          </div>
          <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-2">
            Essay Review
          </h2>
          <p className="text-[var(--muted)] text-sm leading-relaxed mb-4">
            Get AI feedback on your existing essays.
          </p>
          <span className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
            Coming Soon
          </span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-16">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-6">
          Recent Activity
        </h2>
        <div className="bg-white rounded-2xl border border-[var(--border)] p-8 text-center">
          <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-medium mb-2">No activity yet</h3>
          <p className="text-[var(--muted)] text-sm mb-4">
            Start using our tools to see your recent work here.
          </p>
          <Link
            href="/dashboard/mba-writer"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
          >
            Get Started
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  )
}
