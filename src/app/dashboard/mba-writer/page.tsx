'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TOOLS = [
  {
    id: 'sop',
    name: 'Statement of Purpose',
    description: 'Generate a compelling SOP tailored to your target school and program.',
    icon: SOPIcon,
    href: '/dashboard/mba-writer/sop',
    available: true,
  },
  {
    id: 'essay',
    name: 'Essay Questions',
    description: 'Answer specific essay questions for top MBA programs like IIM, ISB, XLRI.',
    icon: EssayIcon,
    href: '/dashboard/mba-writer/essay',
    available: false,
  },
  {
    id: 'short-answer',
    name: 'Short Answers',
    description: 'Quick, impactful responses for supplementary application questions.',
    icon: ShortAnswerIcon,
    href: '/dashboard/mba-writer/short-answer',
    available: false,
  },
  {
    id: 'lor',
    name: 'LOR Draft',
    description: 'Generate a draft Letter of Recommendation for your recommender.',
    icon: LORIcon,
    href: '/dashboard/mba-writer/lor',
    available: false,
  },
]

export default function MBAWriterPage() {
  const [loading, setLoading] = useState(true)
  const [hasProfile, setHasProfile] = useState(false)
  const [profileCompletion, setProfileCompletion] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function checkProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (data && !error) {
        const personalInfo = data.personal_info || {}
        const academics = data.academics || []
        const entranceScores = data.entrance_scores || []
        const careerGoals = data.career_goals || {}

        const hasPersonalInfo = personalInfo.fullName && personalInfo.email
        const hasAcademics = academics.length > 0 && academics.some((a: { institution: string }) => a.institution)
        const hasEntranceScores = entranceScores.length > 0 && entranceScores.some((s: { overallPercentile: string }) => s.overallPercentile)
        const hasCareerGoals = careerGoals.whyMba && careerGoals.shortTermGoals

        let completion = 0
        if (hasPersonalInfo) completion += 25
        if (hasAcademics) completion += 25
        if (hasEntranceScores) completion += 25
        if (hasCareerGoals) completion += 25

        setProfileCompletion(completion)
        setHasProfile(completion >= 75)
      }

      setLoading(false)
    }

    checkProfile()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--muted)]">Loading...</p>
        </div>
      </div>
    )
  }

  // Profile not filled
  if (!hasProfile) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-black rounded-2xl flex items-center justify-center mx-auto mb-6">
            <LockIcon />
          </div>
          
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold mb-3">
            Complete Your Profile First
          </h1>
          
          <p className="text-[var(--muted)] mb-6">
            To generate personalized SOPs, we need your background information, 
            achievements, and career goals.
          </p>

          <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              <span className="text-sm font-bold">{profileCompletion}%</span>
            </div>
            <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-black transition-all duration-300"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
            <p className="text-xs text-[var(--muted)] mt-2">
              Minimum 75% required to use MBA Writer
            </p>
          </div>

          <Link
            href="/dashboard/profile"
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-black/80 transition-colors"
          >
            Complete Profile
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center">
              <PenIcon />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-bold">
                MBA Writer
              </h1>
              <p className="text-white/60 text-sm">
                AI-powered writing tools for your MBA applications
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Quick Access */}
        <div className="mb-8">
          <Link
            href="/dashboard/mba-writer/saved"
            className="flex items-center justify-between bg-white rounded-xl border border-[var(--border)] p-4 hover:border-black transition-colors group"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#fafafa] rounded-lg flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                <FolderIcon />
              </div>
              <div>
                <h3 className="font-medium">Saved SOPs</h3>
                <p className="text-sm text-[var(--muted)]">View and manage your saved documents</p>
              </div>
            </div>
            <ArrowRightIcon />
          </Link>
        </div>

        {/* Tools Grid */}
        <div className="mb-8">
          <h2 className="font-semibold text-lg mb-4">Choose a Tool</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {TOOLS.map((tool) => {
              const Icon = tool.icon
              return tool.available ? (
                <Link
                  key={tool.id}
                  href={tool.href}
                  className="group bg-white rounded-2xl border border-[var(--border)] p-6 hover:border-black transition-all hover:-translate-y-1"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                      <Icon />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{tool.name}</h3>
                        <ChevronRightIcon className="w-4 h-4 text-[var(--muted)] group-hover:translate-x-1 transition-transform" />
                      </div>
                      <p className="text-sm text-[var(--muted)]">{tool.description}</p>
                    </div>
                  </div>
                </Link>
              ) : (
                <div
                  key={tool.id}
                  className="bg-white rounded-2xl border border-[var(--border)] p-6 opacity-60"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#f5f5f5] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="text-[var(--muted)]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{tool.name}</h3>
                        <span className="text-xs bg-[var(--border)] px-2 py-0.5 rounded-full">Coming Soon</span>
                      </div>
                      <p className="text-sm text-[var(--muted)]">{tool.description}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Generations */}
        <div>
          <h2 className="font-semibold text-lg mb-4">Recent Generations</h2>
          <div className="bg-white rounded-2xl border border-[var(--border)] p-8 text-center">
            <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4">
              <FileIcon />
            </div>
            <p className="text-[var(--muted)] mb-2">No documents generated yet</p>
            <p className="text-sm text-[var(--muted)]">
              Start by generating an SOP for your target school
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function SOPIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 text-white ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function EssayIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className || 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  )
}

function ShortAnswerIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className || 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  )
}

function LORIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className || 'text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  )
}

function PenIcon() {
  return (
    <svg className="w-7 h-7 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </svg>
  )
}

function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

function FileIcon() {
  return (
    <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}
