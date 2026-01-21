'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MBAProfile, defaultProfile } from '@/types/profile'

const SECTIONS = [
  { id: 'personal', name: 'Personal Info', icon: PersonIcon },
  { id: 'academics', name: 'Academics', icon: AcademicsIcon },
  { id: 'scores', name: 'Entrance Scores', icon: ChartIcon },
  { id: 'work', name: 'Work Experience', icon: BriefcaseIcon },
  { id: 'activities', name: 'Activities', icon: TrophyIcon },
  { id: 'achievements', name: 'Achievements', icon: StarIcon },
  { id: 'goals', name: 'Career Goals', icon: TargetIcon },
  { id: 'additional', name: 'Additional Info', icon: FileIcon },
]

export default function ProfileViewPage() {
  const [activeSection, setActiveSection] = useState('personal')
  const [profile, setProfile] = useState<Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function loadProfile() {
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

        if (completion < 75) {
          router.push('/dashboard/profile')
          return
        }

        setProfile({
          personalInfo: data.personal_info || defaultProfile.personalInfo,
          academics: data.academics || defaultProfile.academics,
          entranceScores: data.entrance_scores || defaultProfile.entranceScores,
          workExperience: data.work_experience || defaultProfile.workExperience,
          activities: data.activities || defaultProfile.activities,
          achievements: data.achievements || defaultProfile.achievements,
          certifications: data.certifications || defaultProfile.certifications,
          careerGoals: data.career_goals || defaultProfile.careerGoals,
          additionalInfo: data.additional_info || defaultProfile.additionalInfo,
        })
      } else {
        router.push('/dashboard/profile')
        return
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--muted)]">Loading your profile...</p>
        </div>
      </div>
    )
  }

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'personal':
        return <PersonalInfoSection data={profile.personalInfo} />
      case 'academics':
        return <AcademicsSection data={profile.academics} />
      case 'scores':
        return <EntranceScoresSection data={profile.entranceScores} />
      case 'work':
        return <WorkExperienceSection data={profile.workExperience} />
      case 'activities':
        return <ActivitiesSection data={profile.activities} />
      case 'achievements':
        return <AchievementsSection data={profile.achievements} certifications={profile.certifications} />
      case 'goals':
        return <CareerGoalsSection data={profile.careerGoals} />
      case 'additional':
        return <AdditionalInfoSection data={profile.additionalInfo} />
      default:
        return null
    }
  }

  const ActiveIcon = SECTIONS.find(s => s.id === activeSection)?.icon || PersonIcon

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Hero Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
                <span className="text-3xl font-bold text-black">
                  {profile.personalInfo.fullName?.charAt(0)?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-syne)] text-2xl md:text-3xl font-bold">
                  {profile.personalInfo.fullName || 'Your Profile'}
                </h1>
                <p className="text-white/60 text-sm mt-1">
                  {profile.personalInfo.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard/profile/share"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                <ShareIcon />
                Share
              </Link>
              <Link
                href="/dashboard/profile?edit=true"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-white/10 hover:bg-white/20 transition-colors text-sm"
              >
                <EditIcon />
                Edit
              </Link>
              <Link
                href="/dashboard/mba-writer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium bg-white text-black hover:bg-white/90 transition-colors text-sm"
              >
                Generate SOP
                <ArrowRightIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden sticky top-24">
              <div className="p-4 border-b border-[var(--border)]">
                <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wider">
                  Profile Sections
                </p>
              </div>
              <nav className="p-2">
                {SECTIONS.map((section) => {
                  const Icon = section.icon
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                        activeSection === section.id
                          ? 'bg-black text-white'
                          : 'hover:bg-[#fafafa] text-[var(--foreground)]'
                      }`}
                    >
                      <Icon className={activeSection === section.id ? 'text-white' : 'text-[var(--muted)]'} />
                      <span className="text-sm font-medium">{section.name}</span>
                      {activeSection === section.id && (
                        <ChevronRightIcon className="ml-auto" />
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Right Content */}
          <div className="flex-1 min-w-0">
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
              {/* Section Header */}
              <div className="px-6 md:px-8 py-5 border-b border-[var(--border)] flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center">
                  <ActiveIcon className="text-white" />
                </div>
                <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                  {SECTIONS.find(s => s.id === activeSection)?.name}
                </h2>
              </div>
              {/* Section Content */}
              <div className="p-6 md:p-8">
                {renderSectionContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// SVG Icons
function PersonIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  )
}

function AcademicsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
    </svg>
  )
}

function ChartIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  )
}

function BriefcaseIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
    </svg>
  )
}

function TrophyIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m3.044 0a6.726 6.726 0 002.749-1.35m0 0a6.772 6.772 0 01-3.044 0" />
    </svg>
  )
}

function StarIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </svg>
  )
}

function TargetIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  )
}

function FileIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function EditIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
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

function ChevronRightIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
    </svg>
  )
}

// Section Components
function PersonalInfoSection({ data }: { data: MBAProfile['personalInfo'] }) {
  return (
    <div className="grid md:grid-cols-2 gap-x-8 gap-y-6">
      <DataField label="Full Name" value={data.fullName} />
      <DataField label="Email Address" value={data.email} />
      <DataField label="Phone Number" value={data.phone} />
      <DataField label="Date of Birth" value={data.dateOfBirth} />
      <DataField label="Gender" value={data.gender} capitalize />
      <DataField label="Category" value={data.category?.toUpperCase()} />
      <DataField label="City" value={data.city} />
      <DataField label="State" value={data.state} />
    </div>
  )
}

function AcademicsSection({ data }: { data: MBAProfile['academics'] }) {
  const levelLabels: Record<string, string> = {
    '10th': 'Class 10th',
    '12th': 'Class 12th',
    'graduation': 'Graduation',
    'post_graduation': 'Post Graduation',
  }

  const filledRecords = data.filter(r => r.institution)

  if (filledRecords.length === 0) {
    return <EmptyState message="No academic records added yet" />
  }

  return (
    <div className="space-y-6">
      {filledRecords.map((record, index) => (
        <div key={index} className="bg-[#fafafa] rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-xs font-bold">
              {index + 1}
            </span>
            <h3 className="font-semibold">{levelLabels[record.level] || record.level}</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <DataFieldSmall label="Institution" value={record.institution} />
            <DataFieldSmall label="Board/University" value={record.board_university} />
            <DataFieldSmall label="Stream/Branch" value={record.stream_branch} />
            <DataFieldSmall label="Score" value={record.percentage_cgpa} highlight />
            <DataFieldSmall label="Year" value={record.year_of_completion} />
          </div>
        </div>
      ))}
    </div>
  )
}

function EntranceScoresSection({ data }: { data: MBAProfile['entranceScores'] }) {
  const filledScores = data.filter(s => s.overallPercentile)

  if (filledScores.length === 0) {
    return <EmptyState message="No entrance scores added yet" />
  }

  return (
    <div className="space-y-6">
      {filledScores.map((score, index) => (
        <div key={index} className="bg-[#fafafa] rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">{score.examName}</h3>
            <span className="text-xs bg-black text-white px-3 py-1 rounded-full">{score.year}</span>
          </div>
          
          <div className="flex items-center gap-8 mb-4">
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Overall Percentile</p>
              <p className="text-3xl font-bold">{score.overallPercentile}<span className="text-lg">%ile</span></p>
            </div>
            {score.overallScore && (
              <div>
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide">Score</p>
                <p className="text-xl font-semibold">{score.overallScore}</p>
              </div>
            )}
          </div>

          {score.sectionalScores && score.sectionalScores.some(s => s.percentile) && (
            <div>
              <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-3">Sectional Breakdown</p>
              <div className="grid grid-cols-3 gap-3">
                {score.sectionalScores.map((s, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 text-center border border-[var(--border)]">
                    <p className="text-xs text-[var(--muted)] mb-1">{s.section}</p>
                    <p className="font-bold">{s.percentile || '-'}<span className="text-xs font-normal">%ile</span></p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function WorkExperienceSection({ data }: { data: MBAProfile['workExperience'] }) {
  if (data.length === 0) {
    return <EmptyState message="No work experience added yet" />
  }

  return (
    <div className="space-y-6">
      {data.map((exp, index) => (
        <div key={index} className="relative pl-6 border-l-2 border-black pb-6 last:pb-0">
          <div className="absolute -left-[9px] top-0 w-4 h-4 bg-black rounded-full" />
          
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <h3 className="font-semibold text-lg">{exp.designation}</h3>
              <p className="text-[var(--muted)]">{exp.companyName}</p>
            </div>
            {exp.isCurrentRole && (
              <span className="bg-black text-white text-xs font-medium px-3 py-1 rounded-full flex-shrink-0">
                Current
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 text-sm text-[var(--muted)] mb-3">
            {exp.industry && <span>{exp.industry}</span>}
            <span>•</span>
            <span>{exp.startDate} - {exp.isCurrentRole ? 'Present' : exp.endDate}</span>
          </div>

          {exp.responsibilities && (
            <div className="mb-3">
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Responsibilities</p>
              <p className="text-sm leading-relaxed">{exp.responsibilities}</p>
            </div>
          )}

          {exp.achievements && (
            <div className="bg-[#fafafa] rounded-lg p-3">
              <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">Key Achievements</p>
              <p className="text-sm leading-relaxed">{exp.achievements}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function ActivitiesSection({ data }: { data: MBAProfile['activities'] }) {
  const extraCurricular = data.filter(a => a.type === 'extra_curricular')
  const coCurricular = data.filter(a => a.type === 'co_curricular')

  if (data.length === 0) {
    return <EmptyState message="No activities added yet" />
  }

  return (
    <div className="space-y-8">
      {extraCurricular.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs">E</span>
            Extra-Curricular
          </h3>
          <div className="space-y-3">
            {extraCurricular.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        </div>
      )}

      {coCurricular.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-black text-white rounded flex items-center justify-center text-xs">C</span>
            Co-Curricular
          </h3>
          <div className="space-y-3">
            {coCurricular.map((activity, index) => (
              <ActivityCard key={index} activity={activity} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function ActivityCard({ activity }: { activity: MBAProfile['activities'][0] }) {
  return (
    <div className="bg-[#fafafa] rounded-xl p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <h4 className="font-medium">{activity.name}</h4>
        <span className="text-xs bg-white border border-[var(--border)] px-2 py-1 rounded-full capitalize flex-shrink-0">
          {activity.level}
        </span>
      </div>
      {activity.description && (
        <p className="text-sm text-[var(--muted)] mb-2">{activity.description}</p>
      )}
      {activity.achievements && (
        <p className="text-sm"><span className="font-medium">Achievement:</span> {activity.achievements}</p>
      )}
    </div>
  )
}

function AchievementsSection({ data, certifications }: { data: MBAProfile['achievements'], certifications: MBAProfile['certifications'] }) {
  if (data.length === 0 && certifications.length === 0) {
    return <EmptyState message="No achievements or certifications added yet" />
  }

  return (
    <div className="space-y-8">
      {data.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Awards & Achievements</h3>
          <div className="space-y-3">
            {data.map((achievement, index) => (
              <div key={index} className="bg-[#fafafa] rounded-xl p-4 flex gap-4">
                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center flex-shrink-0">
                  <StarIcon className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-medium">{achievement.title}</h4>
                    <span className="text-xs bg-white border border-[var(--border)] px-2 py-1 rounded-full">
                      {achievement.year}
                    </span>
                  </div>
                  {achievement.issuingOrganization && (
                    <p className="text-sm text-[var(--muted)]">{achievement.issuingOrganization}</p>
                  )}
                  {achievement.description && (
                    <p className="text-sm mt-2">{achievement.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {certifications.length > 0 && (
        <div>
          <h3 className="font-semibold mb-4">Certifications</h3>
          <div className="grid md:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <div key={index} className="bg-[#fafafa] rounded-xl p-4">
                <h4 className="font-medium mb-1">{cert.name}</h4>
                <p className="text-sm text-[var(--muted)]">
                  {cert.issuingOrganization} {cert.year && `• ${cert.year}`}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function CareerGoalsSection({ data }: { data: MBAProfile['careerGoals'] }) {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">Why MBA?</h3>
        <p className="leading-relaxed text-lg">{data.whyMba || <span className="text-[var(--muted)]">Not specified</span>}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[#fafafa] rounded-xl p-5">
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Short-term Goals</h3>
          <p className="text-sm font-medium mb-1">2-3 years post MBA</p>
          <p className="text-sm leading-relaxed">{data.shortTermGoals || <span className="text-[var(--muted)]">Not specified</span>}</p>
        </div>
        <div className="bg-[#fafafa] rounded-xl p-5">
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Long-term Goals</h3>
          <p className="text-sm font-medium mb-1">5-10 years</p>
          <p className="text-sm leading-relaxed">{data.longTermGoals || <span className="text-[var(--muted)]">Not specified</span>}</p>
        </div>
      </div>

      <div>
        <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">Target Schools</h3>
        {data.targetSchools.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {data.targetSchools.map((school, index) => (
              <span key={index} className="bg-black text-white text-sm px-4 py-2 rounded-full">
                {school}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-[var(--muted)]">Not specified</p>
        )}
      </div>

      {data.preferredSpecialization.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">Preferred Specializations</h3>
          <div className="flex flex-wrap gap-2">
            {data.preferredSpecialization.map((spec, index) => (
              <span key={index} className="border-2 border-black text-sm px-4 py-2 rounded-full font-medium">
                {spec}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AdditionalInfoSection({ data }: { data: MBAProfile['additionalInfo'] }) {
  const hasContent = data.hobbies || data.languages.length > 0 || data.socialProjects || data.publications || data.patents || data.otherInfo

  if (!hasContent) {
    return <EmptyState message="No additional information added yet" />
  }

  return (
    <div className="space-y-6">
      {data.hobbies && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Hobbies & Interests</h3>
          <p className="leading-relaxed">{data.hobbies}</p>
        </div>
      )}

      {data.languages.length > 0 && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {data.languages.map((lang, index) => (
              <span key={index} className="bg-[#fafafa] border border-[var(--border)] text-sm px-4 py-2 rounded-full">
                {lang}
              </span>
            ))}
          </div>
        </div>
      )}

      {data.socialProjects && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Social Projects & Volunteering</h3>
          <p className="leading-relaxed">{data.socialProjects}</p>
        </div>
      )}

      {data.publications && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Publications</h3>
          <p className="leading-relaxed">{data.publications}</p>
        </div>
      )}

      {data.patents && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Patents</h3>
          <p className="leading-relaxed">{data.patents}</p>
        </div>
      )}

      {data.otherInfo && (
        <div>
          <h3 className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-2">Other Information</h3>
          <p className="leading-relaxed">{data.otherInfo}</p>
        </div>
      )}
    </div>
  )
}

// Helper Components
function DataField({ label, value, capitalize = false }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted)] uppercase tracking-wide mb-1">{label}</p>
      <p className={`font-medium ${capitalize ? 'capitalize' : ''}`}>
        {value || <span className="text-[var(--muted)] font-normal">—</span>}
      </p>
    </div>
  )
}

function DataFieldSmall({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[var(--muted)] mb-0.5">{label}</p>
      <p className={`text-sm ${highlight ? 'font-bold' : 'font-medium'}`}>
        {value || <span className="text-[var(--muted)] font-normal">—</span>}
      </p>
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4">
        <FileIcon className="w-8 h-8 text-[var(--muted)]" />
      </div>
      <p className="text-[var(--muted)]">{message}</p>
      <Link
        href="/dashboard/profile?edit=true"
        className="inline-flex items-center gap-2 text-sm font-medium mt-4 hover:underline"
      >
        Add information
        <ArrowRightIcon />
      </Link>
    </div>
  )
}
