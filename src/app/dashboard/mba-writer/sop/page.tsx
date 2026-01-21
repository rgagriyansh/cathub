'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MBAProfile, defaultProfile, MBA_SCHOOLS } from '@/types/profile'
import SOPEditor from '@/components/mba-writer/SOPEditor'

const WORD_LIMITS = [
  { value: '500', label: '500 words' },
  { value: '750', label: '750 words' },
  { value: '1000', label: '1000 words' },
  { value: '1500', label: '1500 words' },
  { value: 'custom', label: 'Custom' },
]

const SOP_TONES = [
  { value: 'professional', label: 'Professional', description: 'Formal and business-like' },
  { value: 'conversational', label: 'Conversational', description: 'Warm and personal' },
  { value: 'confident', label: 'Confident', description: 'Bold and assertive' },
  { value: 'humble', label: 'Humble', description: 'Modest and reflective' },
]

const SOP_SECTIONS = [
  { id: 'opening', name: 'Opening Hook', description: 'Compelling first impression', wordShare: '5%' },
  { id: 'journey', name: 'Your Journey', description: 'Stories & experiences', wordShare: '60%' },
  { id: 'whyMba', name: 'Why MBA', description: 'Gaps & growth areas', wordShare: '15%' },
  { id: 'whySchool', name: 'Why This School', description: 'School-specific fit', wordShare: '15%' },
  { id: 'closing', name: 'Closing', description: 'Memorable ending', wordShare: '5%' },
]

export default function SOPGeneratorPage() {
  const [step, setStep] = useState<'config' | 'generating' | 'editor'>('config')
  const [profile, setProfile] = useState<Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [streamingContent, setStreamingContent] = useState('')
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Form state
  const [targetSchool, setTargetSchool] = useState('')
  const [customSchool, setCustomSchool] = useState('')
  const [wordLimitOption, setWordLimitOption] = useState('1000')
  const [customWordLimit, setCustomWordLimit] = useState('')
  const [tone, setTone] = useState('conversational')
  const [keyStories, setKeyStories] = useState('')
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  
  // Section mode
  const [generationMode, setGenerationMode] = useState<'full' | 'sections'>('full')
  const [sectionContents, setSectionContents] = useState<Record<string, string>>({})
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [generatingSection, setGeneratingSection] = useState<string | null>(null)

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

        if (data.career_goals?.targetSchools?.length > 0) {
          setTargetSchool(data.career_goals.targetSchools[0])
        }
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const getWordLimit = () => {
    if (wordLimitOption === 'custom') {
      return parseInt(customWordLimit) || 1000
    }
    return parseInt(wordLimitOption)
  }

  const getSchoolName = () => {
    if (targetSchool === 'other') {
      return customSchool
    }
    return targetSchool
  }

  // Streaming generation for full SOP
  const handleGenerateStreaming = async () => {
    if (!getSchoolName()) {
      setError('Please select or enter a target school')
      return
    }

    setError(null)
    setStep('generating')
    setGenerating(true)
    setStreamingContent('')

    try {
      const response = await fetch('/api/generate-sop/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          targetSchool: getSchoolName(),
          wordLimit: getWordLimit(),
          tone,
          keyStories,
          additionalInstructions,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate SOP')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const text = decoder.decode(value, { stream: true })
          fullContent += text
          setStreamingContent(fullContent)
        }
      }

      setGeneratedContent(fullContent)
      setStep('editor')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setStep('config')
    } finally {
      setGenerating(false)
    }
  }

  // Generate a specific section
  const handleGenerateSection = async (sectionId: string) => {
    if (!getSchoolName()) {
      setError('Please select a target school first')
      return
    }

    setError(null)
    setGeneratingSection(sectionId)

    try {
      // Pass already-generated sections to avoid repetition
      const previousSections: Record<string, string> = {}
      SOP_SECTIONS.forEach(s => {
        if (s.id !== sectionId && sectionContents[s.id]) {
          previousSections[s.id] = sectionContents[s.id]
        }
      })

      const response = await fetch('/api/generate-sop/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile,
          targetSchool: getSchoolName(),
          wordLimit: getWordLimit(),
          tone,
          keyStories,
          additionalInstructions,
          section: sectionId,
          previousSections,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate section')
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let sectionContent = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          
          const text = decoder.decode(value, { stream: true })
          sectionContent += text
          setSectionContents(prev => ({ ...prev, [sectionId]: sectionContent }))
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate section')
    } finally {
      setGeneratingSection(null)
    }
  }

  // Combine all sections into full SOP
  const handleCombineSections = () => {
    const fullContent = SOP_SECTIONS
      .map(s => sectionContents[s.id] || '')
      .filter(Boolean)
      .join('\n\n')
    
    setGeneratedContent(fullContent)
    setStep('editor')
  }

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

  // Editor view
  if (step === 'editor') {
    return (
      <SOPEditor
        content={generatedContent}
        schoolName={getSchoolName()}
        wordLimit={getWordLimit()}
        profile={profile}
        onBack={() => setStep('config')}
        onRegenerate={handleGenerateStreaming}
      />
    )
  }

  // Generating view with streaming
  if (step === 'generating') {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <div className="bg-black text-white">
          <div className="max-w-4xl mx-auto px-6 py-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <SparklesIcon className="w-5 h-5 text-black animate-pulse" />
              </div>
              <div>
                <h1 className="font-semibold">Generating SOP for {getSchoolName()}</h1>
                <p className="text-sm text-white/60">Writing in real-time...</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto px-6 py-8">
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 min-h-[400px]">
            {streamingContent ? (
              <div className="prose max-w-none">
                <p className="whitespace-pre-wrap leading-relaxed" style={{ fontFamily: 'Georgia, serif' }}>
                  {streamingContent}
                  <span className="inline-block w-2 h-5 bg-black animate-pulse ml-1" />
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <div className="flex gap-2">
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-3 h-3 bg-black rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <p className="text-[var(--muted)]">Crafting your personalized SOP...</p>
              </div>
            )}
          </div>
          
          {streamingContent && (
            <div className="mt-4 flex items-center justify-between text-sm text-[var(--muted)]">
              <span>{streamingContent.trim().split(/\s+/).length} words generated</span>
              <span>Target: {getWordLimit()} words</span>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Configuration view
  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Link
            href="/dashboard/mba-writer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeftIcon />
            Back to MBA Writer
          </Link>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
              <DocumentIcon />
            </div>
            <div>
              <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold">
                SOP Generator
              </h1>
              <p className="text-white/60 text-sm">
                Generate a personalized Statement of Purpose
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6">
            {error}
          </div>
        )}

        {/* Generation Mode Toggle */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
          <h2 className="font-semibold mb-4">Generation Mode</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setGenerationMode('full')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                generationMode === 'full' 
                  ? 'border-black bg-black text-white' 
                  : 'border-[var(--border)] hover:border-black'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <DocumentIcon className={generationMode === 'full' ? 'text-white' : ''} />
                <span className="font-semibold">Full SOP</span>
              </div>
              <p className={`text-sm ${generationMode === 'full' ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                Generate complete SOP in one go with streaming
              </p>
            </button>
            <button
              onClick={() => setGenerationMode('sections')}
              className={`p-4 rounded-xl border-2 text-left transition-all ${
                generationMode === 'sections' 
                  ? 'border-black bg-black text-white' 
                  : 'border-[var(--border)] hover:border-black'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                <SectionsIcon className={generationMode === 'sections' ? 'text-white' : ''} />
                <span className="font-semibold">Section by Section</span>
              </div>
              <p className={`text-sm ${generationMode === 'sections' ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                Generate each section separately for more control
              </p>
            </button>
          </div>
        </div>

        {/* Profile Summary */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Using Your Profile Data</h2>
            <Link
              href="/dashboard/profile?edit=true"
              className="text-sm text-[var(--muted)] hover:text-black transition-colors"
            >
              Edit Profile
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="bg-[#fafafa] rounded-lg p-3">
              <p className="text-[var(--muted)] text-xs mb-1">Name</p>
              <p className="font-medium truncate">{profile.personalInfo.fullName || '—'}</p>
            </div>
            <div className="bg-[#fafafa] rounded-lg p-3">
              <p className="text-[var(--muted)] text-xs mb-1">Education</p>
              <p className="font-medium truncate">
                {profile.academics.find(a => a.level === 'graduation')?.stream_branch || '—'}
              </p>
            </div>
            <div className="bg-[#fafafa] rounded-lg p-3">
              <p className="text-[var(--muted)] text-xs mb-1">CAT Percentile</p>
              <p className="font-medium">
                {profile.entranceScores.find(s => s.examName === 'CAT')?.overallPercentile || '—'}%ile
              </p>
            </div>
            <div className="bg-[#fafafa] rounded-lg p-3">
              <p className="text-[var(--muted)] text-xs mb-1">Work Experience</p>
              <p className="font-medium">{profile.workExperience.length} roles</p>
            </div>
          </div>
        </div>

        {/* Configuration Form */}
        <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
          <h2 className="font-semibold mb-6">SOP Configuration</h2>

          {/* Target School */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Target School <span className="text-red-500">*</span>
            </label>
            <select
              value={targetSchool}
              onChange={(e) => setTargetSchool(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
            >
              <option value="">Select a school</option>
              {profile.careerGoals.targetSchools.length > 0 && (
                <optgroup label="Your Target Schools">
                  {profile.careerGoals.targetSchools.map((school) => (
                    <option key={school} value={school}>{school}</option>
                  ))}
                </optgroup>
              )}
              <optgroup label="All Schools">
                {MBA_SCHOOLS.filter(s => !profile.careerGoals.targetSchools.includes(s)).map((school) => (
                  <option key={school} value={school}>{school}</option>
                ))}
              </optgroup>
              <option value="other">Other (Enter manually)</option>
            </select>
            {targetSchool === 'other' && (
              <input
                type="text"
                value={customSchool}
                onChange={(e) => setCustomSchool(e.target.value)}
                placeholder="Enter school name"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors mt-3"
              />
            )}
          </div>

          {/* Word Limit */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Word Limit</label>
            <div className="flex flex-wrap gap-2">
              {WORD_LIMITS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setWordLimitOption(option.value)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    wordLimitOption === option.value
                      ? 'bg-black text-white'
                      : 'bg-[#fafafa] hover:bg-[#f0f0f0]'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {wordLimitOption === 'custom' && (
              <input
                type="number"
                value={customWordLimit}
                onChange={(e) => setCustomWordLimit(e.target.value)}
                placeholder="Enter word limit"
                className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors mt-3"
              />
            )}
          </div>

          {/* Tone */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Writing Tone</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {SOP_TONES.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setTone(option.value)}
                  className={`p-3 rounded-xl text-left transition-colors ${
                    tone === option.value
                      ? 'bg-black text-white'
                      : 'bg-[#fafafa] hover:bg-[#f0f0f0]'
                  }`}
                >
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className={`text-xs ${tone === option.value ? 'text-white/70' : 'text-[var(--muted)]'}`}>
                    {option.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Key Stories */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Key Stories & Achievements <span className="text-red-500">*</span>
            </label>
            <p className="text-sm text-[var(--muted)] mb-3">
              Share specific stories, numbers, and achievements that make you unique. Be specific!
            </p>
            <textarea
              value={keyStories}
              onChange={(e) => setKeyStories(e.target.value)}
              rows={6}
              placeholder={`Examples:
• Started a YouTube channel that grew to 20,000 subscribers in 3 months
• Founded a startup incubated at [Incubator Name]
• Led a team of 15 for college fest, managed ₹5L budget
• Realized coding wasn't for me, pivoted to teaching
• Key moment when you decided to pursue MBA...`}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>

          {/* Additional Instructions */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Additional Instructions <span className="text-[var(--muted)]">(Optional)</span>
            </label>
            <textarea
              value={additionalInstructions}
              onChange={(e) => setAdditionalInstructions(e.target.value)}
              rows={2}
              placeholder="Any specific angles or themes to emphasize..."
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
            />
          </div>
        </div>

        {/* Section-by-Section Mode */}
        {generationMode === 'sections' && (
          <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-6">
            <h2 className="font-semibold mb-4">Generate Sections</h2>
            <p className="text-sm text-[var(--muted)] mb-4">
              Generate each section individually, edit as needed, then combine into your final SOP.
            </p>
            
            {/* Context indicator */}
            {Object.keys(sectionContents).length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-6 flex items-start gap-2">
                <ContextIcon className="text-green-600 mt-0.5" />
                <div className="text-sm">
                  <span className="font-medium text-green-800">Smart Context Active:</span>
                  <span className="text-green-700"> AI will avoid repeating content from {Object.keys(sectionContents).length} already-generated section(s).</span>
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              {SOP_SECTIONS.map((section) => (
                <div 
                  key={section.id}
                  className="border border-[var(--border)] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{section.name}</h3>
                      <p className="text-xs text-[var(--muted)]">{section.description} • {section.wordShare}</p>
                    </div>
                    <button
                      onClick={() => handleGenerateSection(section.id)}
                      disabled={generatingSection === section.id || !getSchoolName()}
                      className="flex items-center gap-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-black/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {generatingSection === section.id ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Writing...
                        </>
                      ) : sectionContents[section.id] ? (
                        <>
                          <RefreshIcon />
                          Regenerate
                        </>
                      ) : (
                        <>
                          <SparklesIcon className="w-4 h-4" />
                          Generate
                        </>
                      )}
                    </button>
                  </div>
                  
                  {sectionContents[section.id] && (
                    <textarea
                      value={sectionContents[section.id]}
                      onChange={(e) => setSectionContents(prev => ({ ...prev, [section.id]: e.target.value }))}
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-[var(--border)] rounded-lg focus:outline-none focus:border-black resize-none"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Combine Button */}
            {Object.keys(sectionContents).length >= 3 && (
              <button
                onClick={handleCombineSections}
                className="w-full mt-6 bg-black text-white py-4 rounded-xl font-medium hover:bg-black/80 transition-colors flex items-center justify-center gap-2"
              >
                <CombineIcon />
                Combine Sections & Edit
              </button>
            )}
          </div>
        )}

        {/* Generate Full SOP Button */}
        {generationMode === 'full' && (
          <button
            onClick={handleGenerateStreaming}
            disabled={generating || !getSchoolName()}
            className="w-full bg-black text-white py-4 rounded-xl font-medium hover:bg-black/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <SparklesIcon className="w-5 h-5" />
            Generate SOP
          </button>
        )}
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
    </svg>
  )
}

function DocumentIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className || 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

function SectionsIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-6 h-6 ${className || 'text-black'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
    </svg>
  )
}

function SparklesIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-5 h-5 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
    </svg>
  )
}

function RefreshIcon() {
  return (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
  )
}

function CombineIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
    </svg>
  )
}

function ContextIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
    </svg>
  )
}
