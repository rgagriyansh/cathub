'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { MBAProfile, defaultProfile } from '@/types/profile'

const CV_SECTIONS = [
  { id: 'summary', name: 'Professional Summary', default: true },
  { id: 'education', name: 'Education', default: true },
  { id: 'scores', name: 'Test Scores', default: false },
  { id: 'experience', name: 'Work Experience', default: true },
  { id: 'activities', name: 'Leadership & Activities', default: true },
  { id: 'achievements', name: 'Achievements', default: true },
  { id: 'certifications', name: 'Certifications', default: false },
  { id: 'skills', name: 'Skills & Interests', default: true },
]

interface CVData {
  name: string
  contact: string[]
  summary: string
  education: Array<{ degree: string; institution: string; score: string; year: string }>
  scores: Array<{ exam: string; score: string; year: string }>
  experience: Array<{ title: string; company: string; date: string; bullets: string[] }>
  activities: Array<{ name: string; description: string }>
  achievements: Array<{ title: string; year: string; description: string }>
  certifications: Array<{ name: string; issuer: string }>
  skills: string
  interests: string
}

export default function CVCreatorPage() {
  const [profile, setProfile] = useState<Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(defaultProfile)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const cvRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  // Config state
  const [selectedSections, setSelectedSections] = useState<string[]>(
    CV_SECTIONS.filter(s => s.default).map(s => s.id)
  )
  const [targetRole, setTargetRole] = useState('')
  
  // CV Data state (editable)
  const [cvData, setCvData] = useState<CVData | null>(null)
  const [editingField, setEditingField] = useState<string | null>(null)

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
        const loadedProfile = {
          personalInfo: data.personal_info || defaultProfile.personalInfo,
          academics: data.academics || defaultProfile.academics,
          entranceScores: data.entrance_scores || defaultProfile.entranceScores,
          workExperience: data.work_experience || defaultProfile.workExperience,
          activities: data.activities || defaultProfile.activities,
          achievements: data.achievements || defaultProfile.achievements,
          certifications: data.certifications || defaultProfile.certifications,
          careerGoals: data.career_goals || defaultProfile.careerGoals,
          additionalInfo: data.additional_info || defaultProfile.additionalInfo,
        }
        setProfile(loadedProfile)
        
        // Initialize CV data from profile
        initializeCVData(loadedProfile)
      }
      setLoading(false)
    }

    loadProfile()
  }, [supabase, router])

  const initializeCVData = (p: typeof profile) => {
    const contactParts: string[] = []
    if (p.personalInfo.phone) contactParts.push(p.personalInfo.phone)
    if (p.personalInfo.email) contactParts.push(p.personalInfo.email)
    if (p.personalInfo.city) {
      contactParts.push(`${p.personalInfo.city}${p.personalInfo.state ? ', ' + p.personalInfo.state : ''}`)
    }

    setCvData({
      name: p.personalInfo.fullName || 'Your Name',
      contact: contactParts,
      summary: '',
      education: p.academics.filter(a => a.institution).map(a => ({
        degree: a.level === '10th' ? 'Class X' : 
                a.level === '12th' ? 'Class XII' : 
                a.level === 'graduation' ? `B.Tech${a.stream_branch ? ' - ' + a.stream_branch : ''}` : 
                a.level === 'post_graduation' ? `M.Tech${a.stream_branch ? ' - ' + a.stream_branch : ''}` : a.stream_branch,
        institution: a.institution,
        score: a.percentage_cgpa || '',
        year: a.year_of_completion || ''
      })),
      scores: p.entranceScores.filter(s => s.overallPercentile).map(s => ({
        exam: s.examName,
        score: s.overallPercentile + ' percentile',
        year: s.year || ''
      })),
      experience: p.workExperience.filter(w => w.companyName).map(w => ({
        title: w.designation,
        company: w.companyName,
        date: formatDateRange(w.startDate, w.endDate, w.isCurrentRole),
        bullets: w.responsibilities ? w.responsibilities.split('\n').filter(r => r.trim()) : []
      })),
      activities: p.activities.filter(a => a.name).map(a => ({
        name: a.name + (a.level ? ` (${a.level})` : ''),
        description: a.description || ''
      })),
      achievements: p.achievements.filter(a => a.title).map(a => ({
        title: a.title,
        year: a.year || '',
        description: a.description || ''
      })),
      certifications: p.certifications.filter(c => c.name).map(c => ({
        name: c.name,
        issuer: c.issuingOrganization || ''
      })),
      skills: p.careerGoals?.preferredSpecialization?.join(', ') || '',
      interests: p.additionalInfo?.hobbies || ''
    })
  }

  const toggleSection = (sectionId: string) => {
    setSelectedSections(prev =>
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const generateSummary = async () => {
    if (!cvData) return
    setGenerating(true)
    setError(null)

    try {
      const response = await fetch('/api/generate-cv-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile, targetRole }),
      })

      if (!response.ok) throw new Error('Failed to generate summary')
      
      const data = await response.json()
      setCvData(prev => prev ? { ...prev, summary: data.summary } : null)
    } catch (err) {
      setError('Failed to generate summary')
    } finally {
      setGenerating(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!cvRef.current) return

    try {
      // Clone the element to avoid modifying the original
      const clone = cvRef.current.cloneNode(true) as HTMLElement
      
      // Create a wrapper with explicit white background
      const wrapper = document.createElement('div')
      wrapper.style.cssText = 'background: #ffffff; color: #000000; font-family: "Times New Roman", Times, serif;'
      wrapper.appendChild(clone)
      document.body.appendChild(wrapper)
      
      // Replace any CSS variables or modern colors with standard ones
      const allElements = wrapper.querySelectorAll('*')
      allElements.forEach((el) => {
        const htmlEl = el as HTMLElement
        const computed = window.getComputedStyle(htmlEl)
        
        // Force standard colors
        if (computed.color) {
          htmlEl.style.color = computed.color.includes('lab') || computed.color.includes('oklch') 
            ? '#000000' 
            : computed.color
        }
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          htmlEl.style.backgroundColor = computed.backgroundColor.includes('lab') || computed.backgroundColor.includes('oklch')
            ? '#ffffff'
            : computed.backgroundColor
        }
      })

      const html2pdf = (await import('html2pdf.js')).default
      const opt = {
        margin: [0.4, 0.4] as [number, number],
        filename: `CV_${cvData?.name?.replace(/\s+/g, '_') || 'Resume'}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          logging: false,
        },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }
      
      await html2pdf().set(opt).from(clone).save()
      
      // Clean up
      document.body.removeChild(wrapper)
    } catch (error) {
      console.error('PDF export failed:', error)
    }
  }

  const updateField = (path: string, value: string | string[]) => {
    if (!cvData) return
    
    const keys = path.split('.')
    const newData = { ...cvData }
    
    if (keys.length === 1) {
      const key = keys[0] as keyof CVData
      if (key === 'name' || key === 'summary' || key === 'skills' || key === 'interests') {
        newData[key] = value as string
      }
    } else if (keys.length === 3) {
      const [section, indexStr, field] = keys
      const index = parseInt(indexStr)
      
      if (section === 'education') {
        const arr = [...newData.education]
        const item = { ...arr[index] }
        if (field === 'degree') item.degree = value as string
        else if (field === 'institution') item.institution = value as string
        else if (field === 'score') item.score = value as string
        else if (field === 'year') item.year = value as string
        arr[index] = item
        newData.education = arr
      } else if (section === 'experience') {
        const arr = [...newData.experience]
        const item = { ...arr[index] }
        if (field === 'title') item.title = value as string
        else if (field === 'company') item.company = value as string
        else if (field === 'date') item.date = value as string
        arr[index] = item
        newData.experience = arr
      } else if (section === 'activities') {
        const arr = [...newData.activities]
        const item = { ...arr[index] }
        if (field === 'name') item.name = value as string
        else if (field === 'description') item.description = value as string
        arr[index] = item
        newData.activities = arr
      } else if (section === 'achievements') {
        const arr = [...newData.achievements]
        const item = { ...arr[index] }
        if (field === 'title') item.title = value as string
        else if (field === 'year') item.year = value as string
        else if (field === 'description') item.description = value as string
        arr[index] = item
        newData.achievements = arr
      }
    }
    
    setCvData(newData)
    setEditingField(null)
  }

  const addItem = (section: string) => {
    if (!cvData) return
    const newData = { ...cvData }
    
    if (section === 'experience') {
      newData.experience = [...newData.experience, { title: 'New Role', company: 'Company', date: '', bullets: ['Responsibility'] }]
    } else if (section === 'education') {
      newData.education = [...newData.education, { degree: 'Degree', institution: 'Institution', score: '', year: '' }]
    } else if (section === 'achievements') {
      newData.achievements = [...newData.achievements, { title: 'Achievement', year: '', description: '' }]
    } else if (section === 'activities') {
      newData.activities = [...newData.activities, { name: 'Activity', description: '' }]
    }
    
    setCvData(newData)
  }

  const removeItem = (section: string, index: number) => {
    if (!cvData) return
    const newData = { ...cvData }
    
    if (section === 'education') {
      newData.education = newData.education.filter((_, i) => i !== index)
    } else if (section === 'experience') {
      newData.experience = newData.experience.filter((_, i) => i !== index)
    } else if (section === 'activities') {
      newData.activities = newData.activities.filter((_, i) => i !== index)
    } else if (section === 'achievements') {
      newData.achievements = newData.achievements.filter((_, i) => i !== index)
    }
    
    setCvData(newData)
  }

  const addBullet = (expIndex: number) => {
    if (!cvData) return
    const newData = { ...cvData }
    newData.experience[expIndex].bullets.push('New bullet point')
    setCvData(newData)
  }

  const removeBullet = (expIndex: number, bulletIndex: number) => {
    if (!cvData) return
    const newData = { ...cvData }
    newData.experience[expIndex].bullets = newData.experience[expIndex].bullets.filter((_, i) => i !== bulletIndex)
    setCvData(newData)
  }

  const updateBullet = (expIndex: number, bulletIndex: number, value: string) => {
    if (!cvData) return
    const newData = { ...cvData }
    newData.experience[expIndex].bullets[bulletIndex] = value
    setCvData(newData)
    setEditingField(null)
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

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-black text-white sticky top-0 z-20">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeftIcon />
              </Link>
              <div>
                <h1 className="font-semibold">CV Creator</h1>
                <p className="text-sm text-white/60">Click on any text to edit • Live preview</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm"
              >
                <PrintIcon />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition-colors text-sm font-medium"
              >
                <DownloadIcon />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-[1600px] mx-auto text-red-700 text-sm">{error}</div>
        </div>
      )}

      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="grid lg:grid-cols-12 gap-6">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-4 space-y-4">
            {/* Sections Toggle */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-4">
              <h3 className="font-semibold mb-3 text-sm">Sections</h3>
              <div className="grid grid-cols-2 gap-2">
                {CV_SECTIONS.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => toggleSection(section.id)}
                    className={`p-2 rounded-lg text-left text-xs transition-all flex items-center gap-2 ${
                      selectedSections.includes(section.id)
                        ? 'bg-black text-white'
                        : 'bg-[#fafafa] hover:bg-gray-100'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded border flex items-center justify-center ${
                      selectedSections.includes(section.id) ? 'bg-white border-white' : 'border-gray-300'
                    }`}>
                      {selectedSections.includes(section.id) && <CheckIcon className="text-black" />}
                    </div>
                    {section.name}
                  </button>
                ))}
              </div>
            </div>

            {/* AI Summary Generator */}
            {selectedSections.includes('summary') && (
              <div className="bg-white rounded-xl border border-[var(--border)] p-4">
                <h3 className="font-semibold mb-3 text-sm">AI Summary</h3>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="Target role (e.g., Product Manager)"
                  className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm mb-2"
                />
                <button
                  onClick={generateSummary}
                  disabled={generating}
                  className="w-full bg-black text-white py-2 rounded-lg text-sm font-medium hover:bg-black/80 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {generating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <SparklesIcon />
                      Generate Summary
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Quick Add */}
            <div className="bg-white rounded-xl border border-[var(--border)] p-4">
              <h3 className="font-semibold mb-3 text-sm">Quick Add</h3>
              <div className="grid grid-cols-2 gap-2">
                {selectedSections.includes('education') && (
                  <button onClick={() => addItem('education')} className="p-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                    <PlusIcon /> Education
                  </button>
                )}
                {selectedSections.includes('experience') && (
                  <button onClick={() => addItem('experience')} className="p-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                    <PlusIcon /> Experience
                  </button>
                )}
                {selectedSections.includes('achievements') && (
                  <button onClick={() => addItem('achievements')} className="p-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                    <PlusIcon /> Achievement
                  </button>
                )}
                {selectedSections.includes('activities') && (
                  <button onClick={() => addItem('activities')} className="p-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-xs flex items-center gap-1">
                    <PlusIcon /> Activity
                  </button>
                )}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
              <h3 className="font-semibold mb-2 text-sm text-yellow-800">💡 Tips</h3>
              <ul className="text-xs text-yellow-700 space-y-1">
                <li>• Click any text in preview to edit</li>
                <li>• Hover over items to see delete option</li>
                <li>• Font sizes auto-adjust to fit one page</li>
                <li>• Press Enter to save edits</li>
              </ul>
            </div>
          </div>

          {/* Right Panel - Live CV Preview */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl border border-[var(--border)] shadow-lg overflow-hidden">
              <div className="bg-gray-50 px-4 py-2 border-b border-[var(--border)] flex items-center justify-between">
                <span className="text-xs text-[var(--muted)]">Live Preview</span>
                <span className="text-xs text-[var(--muted)]">A4 Format</span>
              </div>
              
              {/* CV Content */}
              <div 
                ref={cvRef}
                className="p-8 min-h-[1000px]"
                style={{ 
                  fontFamily: "'Times New Roman', Times, serif",
                  backgroundColor: '#ffffff',
                  color: '#000000',
                }}
              >
                {cvData && (
                  <>
                    {/* Header */}
                    <div className="text-center mb-4">
                      <EditableText
                        value={cvData.name}
                        onChange={(v) => updateField('name', v)}
                        className="text-lg font-bold uppercase tracking-wide"
                        editing={editingField === 'name'}
                        onEdit={() => setEditingField('name')}
                      />
                      <div className="text-[11px] mt-1" style={{ color: '#374151' }}>
                        {cvData.contact.join(' | ')}
                      </div>
                    </div>

                    {/* Summary */}
                    {selectedSections.includes('summary') && cvData.summary && (
                      <CVSection title="Summary">
                        <EditableText
                          value={cvData.summary}
                          onChange={(v) => updateField('summary', v)}
                          className="text-[11px] text-justify"
                          editing={editingField === 'summary'}
                          onEdit={() => setEditingField('summary')}
                          multiline
                        />
                      </CVSection>
                    )}

                    {/* Education */}
                    {selectedSections.includes('education') && cvData.education.length > 0 && (
                      <CVSection title="Education">
                        {cvData.education.map((edu, i) => (
                          <div key={i} className="flex justify-between text-[11px] mb-1 group relative">
                            <div className="flex-1">
                              <EditableText
                                value={edu.degree}
                                onChange={(v) => updateField(`education.${i}.degree`, v)}
                                className="font-bold inline"
                                editing={editingField === `education.${i}.degree`}
                                onEdit={() => setEditingField(`education.${i}.degree`)}
                              />
                              <span>, </span>
                              <EditableText
                                value={edu.institution}
                                onChange={(v) => updateField(`education.${i}.institution`, v)}
                                className="inline"
                                editing={editingField === `education.${i}.institution`}
                                onEdit={() => setEditingField(`education.${i}.institution`)}
                              />
                            </div>
                            <div>
                              <EditableText
                                value={edu.score}
                                onChange={(v) => updateField(`education.${i}.score`, v)}
                                className="inline"
                                editing={editingField === `education.${i}.score`}
                                onEdit={() => setEditingField(`education.${i}.score`)}
                                placeholder="Score"
                              />
                              <span> | </span>
                              <EditableText
                                value={edu.year}
                                onChange={(v) => updateField(`education.${i}.year`, v)}
                                className="inline"
                                editing={editingField === `education.${i}.year`}
                                onEdit={() => setEditingField(`education.${i}.year`)}
                                placeholder="Year"
                              />
                            </div>
                            <button 
                              onClick={() => removeItem('education', i)}
                              className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </CVSection>
                    )}

                    {/* Test Scores */}
                    {selectedSections.includes('scores') && cvData.scores.length > 0 && (
                      <CVSection title="Test Scores">
                        <div className="text-[11px]">
                          {cvData.scores.map((s, i) => (
                            <span key={i}>
                              <strong>{s.exam}:</strong> {s.score}{s.year ? ` (${s.year})` : ''}
                              {i < cvData.scores.length - 1 ? ' | ' : ''}
                            </span>
                          ))}
                        </div>
                      </CVSection>
                    )}

                    {/* Experience */}
                    {selectedSections.includes('experience') && cvData.experience.length > 0 && (
                      <CVSection title="Experience">
                        {cvData.experience.map((exp, i) => (
                          <div key={i} className="mb-3 group relative">
                            <div className="flex justify-between text-[11px]">
                              <div>
                                <EditableText
                                  value={exp.title}
                                  onChange={(v) => updateField(`experience.${i}.title`, v)}
                                  className="font-bold inline"
                                  editing={editingField === `experience.${i}.title`}
                                  onEdit={() => setEditingField(`experience.${i}.title`)}
                                />
                                <span>, </span>
                                <EditableText
                                  value={exp.company}
                                  onChange={(v) => updateField(`experience.${i}.company`, v)}
                                  className="inline"
                                  editing={editingField === `experience.${i}.company`}
                                  onEdit={() => setEditingField(`experience.${i}.company`)}
                                />
                              </div>
                              <EditableText
                                value={exp.date}
                                onChange={(v) => updateField(`experience.${i}.date`, v)}
                                style={{ color: '#4b5563' }}
                                editing={editingField === `experience.${i}.date`}
                                onEdit={() => setEditingField(`experience.${i}.date`)}
                              />
                            </div>
                            {exp.bullets.length > 0 && (
                              <ul className="ml-4 mt-1 text-[10px] list-disc">
                                {exp.bullets.map((bullet, j) => (
                                  <li key={j} className="mb-0.5 group/bullet relative">
                                    <EditableText
                                      value={bullet}
                                      onChange={(v) => updateBullet(i, j, v)}
                                      className="inline"
                                      editing={editingField === `experience.${i}.bullet.${j}`}
                                      onEdit={() => setEditingField(`experience.${i}.bullet.${j}`)}
                                    />
                                    <button 
                                      onClick={() => removeBullet(i, j)}
                                      className="absolute -right-4 top-0 opacity-0 group-hover/bullet:opacity-100 text-red-400 hover:text-red-600 text-[10px]"
                                    >
                                      ×
                                    </button>
                                  </li>
                                ))}
                              </ul>
                            )}
                            <button 
                              onClick={() => addBullet(i)}
                              className="text-[9px] text-blue-500 hover:text-blue-700 mt-1 opacity-0 group-hover:opacity-100"
                            >
                              + Add bullet
                            </button>
                            <button 
                              onClick={() => removeItem('experience', i)}
                              className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </CVSection>
                    )}

                    {/* Activities */}
                    {selectedSections.includes('activities') && cvData.activities.length > 0 && (
                      <CVSection title="Leadership & Activities">
                        {cvData.activities.map((act, i) => (
                          <div key={i} className="text-[11px] mb-1 group relative">
                            <EditableText
                              value={act.name}
                              onChange={(v) => updateField(`activities.${i}.name`, v)}
                              className="font-bold inline"
                              editing={editingField === `activities.${i}.name`}
                              onEdit={() => setEditingField(`activities.${i}.name`)}
                            />
                            <span> - </span>
                            <EditableText
                              value={act.description}
                              onChange={(v) => updateField(`activities.${i}.description`, v)}
                              className="inline"
                              editing={editingField === `activities.${i}.description`}
                              onEdit={() => setEditingField(`activities.${i}.description`)}
                              placeholder="Description"
                            />
                            <button 
                              onClick={() => removeItem('activities', i)}
                              className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        ))}
                      </CVSection>
                    )}

                    {/* Achievements */}
                    {selectedSections.includes('achievements') && cvData.achievements.length > 0 && (
                      <CVSection title="Achievements">
                        <ul className="ml-4 list-disc">
                          {cvData.achievements.map((ach, i) => (
                            <li key={i} className="text-[11px] mb-1 group relative">
                              <EditableText
                                value={ach.title}
                                onChange={(v) => updateField(`achievements.${i}.title`, v)}
                                className="font-bold inline"
                                editing={editingField === `achievements.${i}.title`}
                                onEdit={() => setEditingField(`achievements.${i}.title`)}
                              />
                              <span> (</span>
                              <EditableText
                                value={ach.year}
                                onChange={(v) => updateField(`achievements.${i}.year`, v)}
                                className="inline"
                                editing={editingField === `achievements.${i}.year`}
                                onEdit={() => setEditingField(`achievements.${i}.year`)}
                                placeholder="Year"
                              />
                              <span>) - </span>
                              <EditableText
                                value={ach.description}
                                onChange={(v) => updateField(`achievements.${i}.description`, v)}
                                className="inline"
                                editing={editingField === `achievements.${i}.description`}
                                onEdit={() => setEditingField(`achievements.${i}.description`)}
                                placeholder="Description"
                              />
                              <button 
                                onClick={() => removeItem('achievements', i)}
                                className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                              >
                                <TrashIcon />
                              </button>
                            </li>
                          ))}
                        </ul>
                      </CVSection>
                    )}

                    {/* Certifications */}
                    {selectedSections.includes('certifications') && cvData.certifications.length > 0 && (
                      <CVSection title="Certifications">
                        <div className="text-[11px]">
                          {cvData.certifications.map((c, i) => (
                            <span key={i}>
                              {c.name}{c.issuer ? ` - ${c.issuer}` : ''}
                              {i < cvData.certifications.length - 1 ? ' | ' : ''}
                            </span>
                          ))}
                        </div>
                      </CVSection>
                    )}

                    {/* Skills */}
                    {selectedSections.includes('skills') && (cvData.skills || cvData.interests) && (
                      <CVSection title="Skills & Interests">
                        <div className="text-[11px]">
                          {cvData.skills && (
                            <div className="mb-1">
                              <strong>Skills:</strong>{' '}
                              <EditableText
                                value={cvData.skills}
                                onChange={(v) => updateField('skills', v)}
                                className="inline"
                                editing={editingField === 'skills'}
                                onEdit={() => setEditingField('skills')}
                              />
                            </div>
                          )}
                          {cvData.interests && (
                            <div>
                              <strong>Interests:</strong>{' '}
                              <EditableText
                                value={cvData.interests}
                                onChange={(v) => updateField('interests', v)}
                                className="inline"
                                editing={editingField === 'interests'}
                                onEdit={() => setEditingField('interests')}
                              />
                            </div>
                          )}
                        </div>
                      </CVSection>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// CV Section Component
function CVSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-3">
      <div className="text-[12px] font-bold uppercase mb-1">{title}</div>
      {children}
    </div>
  )
}

// Editable Text Component
function EditableText({ 
  value, 
  onChange, 
  className = '', 
  editing, 
  onEdit,
  multiline = false,
  placeholder = 'Click to edit',
  style = {}
}: { 
  value: string
  onChange: (value: string) => void
  className?: string
  editing: boolean
  onEdit: () => void
  multiline?: boolean
  placeholder?: string
  style?: React.CSSProperties
}) {
  const [tempValue, setTempValue] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
      inputRef.current.select()
    }
  }, [editing])

  useEffect(() => {
    setTempValue(value)
  }, [value])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      onChange(tempValue)
    } else if (e.key === 'Escape') {
      setTempValue(value)
      onChange(value)
    }
  }

  if (editing) {
    if (multiline) {
      return (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={tempValue}
          onChange={(e) => setTempValue(e.target.value)}
          onBlur={() => onChange(tempValue)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`${className} bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 focus:outline-none focus:border-yellow-500 w-full resize-none`}
          rows={3}
        />
      )
    }
    return (
      <input
        ref={inputRef as React.RefObject<HTMLInputElement>}
        type="text"
        value={tempValue}
        onChange={(e) => setTempValue(e.target.value)}
        onBlur={() => onChange(tempValue)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} bg-yellow-50 border border-yellow-300 rounded px-1 py-0.5 focus:outline-none focus:border-yellow-500`}
        style={{ width: `${Math.max(tempValue.length * 7, 60)}px` }}
      />
    )
  }

  return (
    <span 
      onClick={onEdit}
      className={`${className} cursor-pointer hover:bg-yellow-50 hover:outline hover:outline-1 hover:outline-yellow-300 rounded px-0.5 transition-colors`}
      style={style}
    >
      {value || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>{placeholder}</span>}
    </span>
  )
}

function formatDateRange(start: string, end: string, isCurrent: boolean): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }
  const startFormatted = formatDate(start)
  const endFormatted = isCurrent ? 'Present' : formatDate(end)
  if (startFormatted && endFormatted) return `${startFormatted} - ${endFormatted}`
  return startFormatted || endFormatted || ''
}

// Icons
function ArrowLeftIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
}

function SparklesIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
}

function CheckIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-2 h-2 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
}

function PrintIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>
}

function DownloadIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
}

function PlusIcon() {
  return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
}

function TrashIcon() {
  return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
}
