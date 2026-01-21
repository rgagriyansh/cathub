'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MBAProfile, defaultProfile } from '@/types/profile'
import PersonalInfoForm from '@/components/profile/PersonalInfoForm'
import AcademicsForm from '@/components/profile/AcademicsForm'
import EntranceScoresForm from '@/components/profile/EntranceScoresForm'
import WorkExperienceForm from '@/components/profile/WorkExperienceForm'
import ActivitiesForm from '@/components/profile/ActivitiesForm'
import AchievementsForm from '@/components/profile/AchievementsForm'
import CareerGoalsForm from '@/components/profile/CareerGoalsForm'
import AdditionalInfoForm from '@/components/profile/AdditionalInfoForm'

const STEPS = [
  { id: 1, name: 'Personal Info', icon: '👤' },
  { id: 2, name: 'Academics', icon: '🎓' },
  { id: 3, name: 'Entrance Scores', icon: '📊' },
  { id: 4, name: 'Work Experience', icon: '💼' },
  { id: 5, name: 'Activities', icon: '🏆' },
  { id: 6, name: 'Achievements', icon: '🏅' },
  { id: 7, name: 'Career Goals', icon: '🎯' },
  { id: 8, name: 'Additional Info', icon: '📝' },
]

export default function ProfilePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [profile, setProfile] = useState<Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const isEditMode = searchParams.get('edit') === 'true'
  const supabase = createClient()

  // Load existing profile or redirect to view if already filled
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
        // Check if profile meets 75% completion (same as MBA Writer criteria)
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

        const isProfileFilled = completion >= 75

        // If profile is already filled and not in edit mode, redirect to view page
        if (isProfileFilled && !isEditMode) {
          router.push('/dashboard/profile/view')
          return
        }

        // Load the data for editing
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
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const updateProfile = (section: keyof typeof profile, data: unknown) => {
    setProfile(prev => ({
      ...prev,
      [section]: data,
    }))
  }

  const saveProfile = async () => {
    setSaving(true)
    setMessage(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const profileData = {
        user_id: user.id,
        personal_info: profile.personalInfo,
        academics: profile.academics,
        entrance_scores: profile.entranceScores,
        work_experience: profile.workExperience,
        activities: profile.activities,
        achievements: profile.achievements,
        certifications: profile.certifications,
        career_goals: profile.careerGoals,
        additional_info: profile.additionalInfo,
        updated_at: new Date().toISOString(),
      }

      const { error } = await supabase
        .from('profiles')
        .upsert(profileData, { onConflict: 'user_id' })

      if (error) throw error

      setMessage({ type: 'success', text: 'Profile saved successfully!' })
    } catch (error) {
      console.error('Error saving profile:', error)
      setMessage({ type: 'error', text: 'Failed to save profile. Please try again.' })
    } finally {
      setSaving(false)
    }
  }

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(prev => prev + 1)
      window.scrollTo(0, 0)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
      window.scrollTo(0, 0)
    }
  }

  const goToStep = (step: number) => {
    setCurrentStep(step)
    window.scrollTo(0, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-black border-t-transparent rounded-full" />
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PersonalInfoForm
            data={profile.personalInfo}
            onChange={(data) => updateProfile('personalInfo', data)}
          />
        )
      case 2:
        return (
          <AcademicsForm
            data={profile.academics}
            onChange={(data) => updateProfile('academics', data)}
          />
        )
      case 3:
        return (
          <EntranceScoresForm
            data={profile.entranceScores}
            onChange={(data) => updateProfile('entranceScores', data)}
          />
        )
      case 4:
        return (
          <WorkExperienceForm
            data={profile.workExperience}
            onChange={(data) => updateProfile('workExperience', data)}
          />
        )
      case 5:
        return (
          <ActivitiesForm
            data={profile.activities}
            onChange={(data) => updateProfile('activities', data)}
          />
        )
      case 6:
        return (
          <AchievementsForm
            data={profile.achievements}
            certifications={profile.certifications}
            onChangeAchievements={(data) => updateProfile('achievements', data)}
            onChangeCertifications={(data) => updateProfile('certifications', data)}
          />
        )
      case 7:
        return (
          <CareerGoalsForm
            data={profile.careerGoals}
            onChange={(data) => updateProfile('careerGoals', data)}
          />
        )
      case 8:
        return (
          <AdditionalInfoForm
            data={profile.additionalInfo}
            onChange={(data) => updateProfile('additionalInfo', data)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-[family-name:var(--font-syne)] text-3xl font-bold mb-2">
          Your MBA Profile
        </h1>
        <p className="text-[var(--muted)]">
          Complete your profile to generate personalized SOPs and essays
        </p>
      </div>

      {/* Progress Steps */}
      <div className="mb-8 overflow-x-auto">
        <div className="flex gap-2 min-w-max pb-2">
          {STEPS.map((step) => (
            <button
              key={step.id}
              onClick={() => goToStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                currentStep === step.id
                  ? 'bg-black text-white'
                  : 'bg-white border border-[var(--border)] hover:border-black'
              }`}
            >
              <span>{step.icon}</span>
              <span className="hidden sm:inline">{step.name}</span>
              <span className="sm:hidden">{step.id}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="h-2 bg-[var(--border)] rounded-full overflow-hidden">
          <div 
            className="h-full bg-black transition-all duration-300"
            style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
          />
        </div>
        <p className="text-sm text-[var(--muted)] mt-2">
          Step {currentStep} of {STEPS.length}
        </p>
      </div>

      {/* Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-xl ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      {/* Form Content */}
      <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 mb-8">
        <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold mb-6 flex items-center gap-2">
          <span>{STEPS[currentStep - 1].icon}</span>
          {STEPS[currentStep - 1].name}
        </h2>
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium border border-[var(--border)] hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <button
          onClick={saveProfile}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-black/10 hover:bg-black/20 transition-colors disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Save Progress
            </>
          )}
        </button>

        {currentStep === STEPS.length ? (
          <button
            onClick={async () => {
              await saveProfile()
              router.push('/dashboard/profile/view')
            }}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-black text-white hover:bg-black/80 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Profile'}
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </button>
        ) : (
          <button
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 rounded-full font-medium bg-black text-white hover:bg-black/80 transition-colors"
          >
            Next
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}
