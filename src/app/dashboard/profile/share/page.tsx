'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { QRCodeSVG } from 'qrcode.react'
import { createClient } from '@/lib/supabase/client'
import { MBAProfile, defaultProfile } from '@/types/profile'

const SHAREABLE_SECTIONS = [
  { id: 'personalInfo', name: 'Personal Info', description: 'Name, city, gender', icon: '👤' },
  { id: 'academics', name: 'Education', description: '10th, 12th, graduation details', icon: '🎓' },
  { id: 'entranceScores', name: 'Test Scores', description: 'CAT, GMAT, XAT scores', icon: '📊' },
  { id: 'workExperience', name: 'Work Experience', description: 'Jobs, roles, responsibilities', icon: '💼' },
  { id: 'activities', name: 'Activities', description: 'Extra-curricular, co-curricular', icon: '🏆' },
  { id: 'achievements', name: 'Achievements', description: 'Awards, recognitions', icon: '🏅' },
  { id: 'certifications', name: 'Certifications', description: 'Professional certifications', icon: '📜' },
  { id: 'careerGoals', name: 'Career Goals', description: 'Aspirations, target schools', icon: '🎯' },
]

interface ShareSettings {
  id?: string
  share_token: string
  visible_sections: string[]
  is_active: boolean
  show_contact_info: boolean
  custom_headline: string
  view_count: number
}

interface CardSettings {
  maskName: boolean
  maskChars: number
  showCategory: boolean
  showEngineer: boolean
  showGender: boolean
  showPercentile: boolean
  showWorkEx: boolean
  workExMonths: number
  theme: 'dark' | 'light' | 'gradient' | 'neon' | 'ocean' | 'sunset' | 'minimal'
}

export default function ProfileSharePage() {
  const [profile, setProfile] = useState<Omit<MBAProfile, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>(defaultProfile)
  const [shareSettings, setShareSettings] = useState<ShareSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'link' | 'card'>('link')
  const [cardSettings, setCardSettings] = useState<CardSettings>({
    maskName: true,
    maskChars: 3,
    showCategory: true,
    showEngineer: true,
    showGender: true,
    showPercentile: true,
    showWorkEx: true,
    workExMonths: 0,
    theme: 'dark',
  })
  const qrRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  const shareUrl = shareSettings?.share_token 
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/p/${shareSettings.share_token}`
    : ''

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    // Load profile
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (profileData) {
      setProfileId(profileData.id)
      setProfile({
        personalInfo: profileData.personal_info || defaultProfile.personalInfo,
        academics: profileData.academics || defaultProfile.academics,
        entranceScores: profileData.entrance_scores || defaultProfile.entranceScores,
        workExperience: profileData.work_experience || defaultProfile.workExperience,
        activities: profileData.activities || defaultProfile.activities,
        achievements: profileData.achievements || defaultProfile.achievements,
        certifications: profileData.certifications || defaultProfile.certifications,
        careerGoals: profileData.career_goals || defaultProfile.careerGoals,
        additionalInfo: profileData.additional_info || defaultProfile.additionalInfo,
      })
    }

    // Load share settings
    const { data: shareData } = await supabase
      .from('profile_shares')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (shareData) {
      setShareSettings({
        id: shareData.id,
        share_token: shareData.share_token,
        visible_sections: shareData.visible_sections || [],
        is_active: shareData.is_active,
        show_contact_info: shareData.show_contact_info,
        custom_headline: shareData.custom_headline || '',
        view_count: shareData.view_count || 0,
      })
    }

    setLoading(false)
  }

  function generateToken(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let token = ''
    for (let i = 0; i < 8; i++) {
      token += chars[Math.floor(Math.random() * chars.length)]
    }
    return token
  }

  async function createShare() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user || !profileId) return

    setSaving(true)
    const token = generateToken()
    
    const { data, error } = await supabase
      .from('profile_shares')
      .insert({
        user_id: user.id,
        profile_id: profileId,
        share_token: token,
        visible_sections: ['personalInfo', 'academics', 'workExperience', 'achievements', 'activities'],
        is_active: true,
        show_contact_info: true,
      })
      .select()
      .single()

    if (data && !error) {
      setShareSettings({
        id: data.id,
        share_token: data.share_token,
        visible_sections: data.visible_sections,
        is_active: data.is_active,
        show_contact_info: data.show_contact_info,
        custom_headline: data.custom_headline || '',
        view_count: data.view_count || 0,
      })
    }
    setSaving(false)
  }

  async function updateShare(updates: Partial<ShareSettings>) {
    if (!shareSettings?.id) return

    setSaving(true)
    const { error } = await supabase
      .from('profile_shares')
      .update({
        visible_sections: updates.visible_sections ?? shareSettings.visible_sections,
        is_active: updates.is_active ?? shareSettings.is_active,
        show_contact_info: updates.show_contact_info ?? shareSettings.show_contact_info,
        custom_headline: updates.custom_headline ?? shareSettings.custom_headline,
      })
      .eq('id', shareSettings.id)

    if (!error) {
      setShareSettings(prev => prev ? { ...prev, ...updates } : null)
    }
    setSaving(false)
  }

  function toggleSection(sectionId: string) {
    if (!shareSettings) return
    
    const newSections = shareSettings.visible_sections.includes(sectionId)
      ? shareSettings.visible_sections.filter(s => s !== sectionId)
      : [...shareSettings.visible_sections, sectionId]
    
    updateShare({ visible_sections: newSections })
  }

  async function copyLink() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  async function downloadQR() {
    if (!qrRef.current) return
    
    const svg = qrRef.current.querySelector('svg')
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = 300
      canvas.height = 300
      if (ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, 300, 300)
        ctx.drawImage(img, 0, 0, 300, 300)
        const pngUrl = canvas.toDataURL('image/png')
        const link = document.createElement('a')
        link.download = `profile-qr-${shareSettings?.share_token}.png`
        link.href = pngUrl
        link.click()
      }
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
  }

  // Business Card Functions
  function getMaskedName(name: string): string {
    if (!cardSettings.maskName || !name) return name
    const parts = name.split(' ')
    return parts.map(part => {
      if (part.length <= cardSettings.maskChars) {
        return '*'.repeat(part.length)
      }
      const visible = part.slice(0, -cardSettings.maskChars)
      const masked = '*'.repeat(cardSettings.maskChars)
      return visible + masked
    }).join(' ')
  }

  function getIsEngineer(): boolean {
    const graduation = profile.academics.find(a => a.level === 'graduation')
    if (!graduation) return false
    const branch = graduation.stream_branch?.toLowerCase() || ''
    return branch.includes('engineer') || branch.includes('tech') || branch.includes('b.e') || branch.includes('b.tech')
  }

  function getCATPercentile(): string {
    const catScore = profile.entranceScores.find(s => s.examName?.toLowerCase() === 'cat')
    return catScore?.overallPercentile || ''
  }

  function getAcademicsShort(): string {
    const tenth = profile.academics.find(a => a.level === '10th')
    const twelfth = profile.academics.find(a => a.level === '12th')
    const graduation = profile.academics.find(a => a.level === 'graduation')
    
    const getFirstDigit = (score: string | undefined): string => {
      if (!score) return '-'
      // Extract numeric part and get first digit
      const num = parseFloat(score.replace(/[^0-9.]/g, ''))
      if (isNaN(num)) return '-'
      // For percentages like 70.5, return 7
      // For CGPA like 8.5, return 8
      return Math.floor(num / 10).toString() || Math.floor(num).toString()
    }
    
    const t = getFirstDigit(tenth?.percentage_cgpa)
    const tw = getFirstDigit(twelfth?.percentage_cgpa)
    const g = getFirstDigit(graduation?.percentage_cgpa)
    
    return `${t}/${tw}/${g}`
  }

  function getWorkExDisplay(): string {
    if (cardSettings.workExMonths === 0) return 'Fresher'
    if (cardSettings.workExMonths < 12) return `${cardSettings.workExMonths}m`
    const years = Math.floor(cardSettings.workExMonths / 12)
    const months = cardSettings.workExMonths % 12
    if (months === 0) return `${years}y`
    return `${years}y ${months}m`
  }

  function getThemeStyles() {
    switch (cardSettings.theme) {
      case 'dark':
        return {
          background: 'linear-gradient(135deg, #1f2937 0%, #000000 100%)',
          color: '#ffffff',
          border: 'none',
          boxBg: 'rgba(255,255,255,0.1)',
          mutedColor: 'rgba(255,255,255,0.6)',
          borderColor: 'rgba(255,255,255,0.1)',
        }
      case 'light':
        return {
          background: 'linear-gradient(135deg, #f9fafb 0%, #ffffff 100%)',
          color: '#000000',
          border: '1px solid #e5e7eb',
          boxBg: 'rgba(0,0,0,0.05)',
          mutedColor: '#6b7280',
          borderColor: '#e5e7eb',
        }
      case 'gradient':
        return {
          background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 50%, #f97316 100%)',
          color: '#ffffff',
          border: 'none',
          boxBg: 'rgba(255,255,255,0.2)',
          mutedColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.2)',
        }
      case 'neon':
        return {
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
          color: '#00ff88',
          border: '1px solid #00ff88',
          boxBg: 'rgba(0,255,136,0.1)',
          mutedColor: 'rgba(0,255,136,0.6)',
          borderColor: 'rgba(0,255,136,0.3)',
        }
      case 'ocean':
        return {
          background: 'linear-gradient(135deg, #0077b6 0%, #023e8a 50%, #03045e 100%)',
          color: '#ffffff',
          border: 'none',
          boxBg: 'rgba(255,255,255,0.15)',
          mutedColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.2)',
        }
      case 'sunset':
        return {
          background: 'linear-gradient(135deg, #f72585 0%, #b5179e 50%, #7209b7 100%)',
          color: '#ffffff',
          border: 'none',
          boxBg: 'rgba(255,255,255,0.2)',
          mutedColor: 'rgba(255,255,255,0.7)',
          borderColor: 'rgba(255,255,255,0.2)',
        }
      case 'minimal':
        return {
          background: '#ffffff',
          color: '#000000',
          border: '2px solid #000000',
          boxBg: '#f5f5f5',
          mutedColor: '#666666',
          borderColor: '#000000',
        }
      default:
        return {
          background: 'linear-gradient(135deg, #1f2937 0%, #000000 100%)',
          color: '#ffffff',
          border: 'none',
          boxBg: 'rgba(255,255,255,0.1)',
          mutedColor: 'rgba(255,255,255,0.6)',
          borderColor: 'rgba(255,255,255,0.1)',
        }
    }
  }

  async function downloadCard() {
    if (!cardRef.current) return

    try {
      // Clone the element and apply standard colors
      const clone = cardRef.current.cloneNode(true) as HTMLElement
      applyStandardColors(clone)
      
      // Temporarily append to DOM
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      document.body.appendChild(clone)

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: cardSettings.theme === 'light' ? '#ffffff' : '#000000',
        logging: false,
      })
      
      document.body.removeChild(clone)
      
      const link = document.createElement('a')
      link.download = `cat-profile-card.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('Failed to download card:', error)
    }
  }

  async function copyCardToClipboard() {
    if (!cardRef.current) return

    try {
      // Clone the element and apply standard colors
      const clone = cardRef.current.cloneNode(true) as HTMLElement
      applyStandardColors(clone)
      
      // Temporarily append to DOM
      clone.style.position = 'absolute'
      clone.style.left = '-9999px'
      document.body.appendChild(clone)

      const html2canvas = (await import('html2canvas')).default
      const canvas = await html2canvas(clone, {
        scale: 2,
        backgroundColor: cardSettings.theme === 'light' ? '#ffffff' : '#000000',
        logging: false,
      })
      
      document.body.removeChild(clone)
      
      canvas.toBlob(async (blob) => {
        if (blob) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ])
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      })
    } catch (error) {
      console.error('Failed to copy card:', error)
    }
  }

  function applyStandardColors(element: HTMLElement) {
    const styles = getThemeStyles()
    
    // Apply standard hex colors to all elements
    const allElements = element.querySelectorAll('*')
    allElements.forEach((el) => {
      const htmlEl = el as HTMLElement
      const computed = window.getComputedStyle(htmlEl)
      
      // Convert any modern color formats to standard
      if (computed.color) {
        const color = computed.color
        if (color.includes('oklab') || color.includes('oklch') || color.includes('lab')) {
          htmlEl.style.color = styles.color
        }
      }
      if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
        const bgColor = computed.backgroundColor
        if (bgColor.includes('oklab') || bgColor.includes('oklch') || bgColor.includes('lab')) {
          htmlEl.style.backgroundColor = 'transparent'
        }
      }
    })
    
    // Set explicit colors on the main element
    element.style.background = styles.background
    element.style.color = styles.color
    if (styles.border !== 'none') {
      element.style.border = styles.border
    }
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard/profile/view" className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeftIcon />
              </Link>
              <div>
                <h1 className="font-semibold">Share Profile</h1>
                <p className="text-sm text-white/60">Create shareable links and cards</p>
              </div>
            </div>
            {shareSettings && (
              <div className="flex items-center gap-2 text-sm">
                <EyeIcon />
                <span>{shareSettings.view_count} views</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {!shareSettings && !profileId ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShareIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Share Your Profile</h2>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
              Please complete your profile first to create shareable links and cards.
            </p>
            <Link
              href="/dashboard/profile"
              className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-black/80 transition-colors inline-block"
            >
              Complete Profile
            </Link>
          </div>
        ) : !shareSettings ? (
          <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
            <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShareIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold mb-3">Share Your Profile</h2>
            <p className="text-[var(--muted)] mb-8 max-w-md mx-auto">
              Create a shareable link and business card to share on Reddit, LinkedIn, or with friends.
            </p>
            <button
              onClick={createShare}
              disabled={saving}
              className="bg-black text-white px-8 py-3 rounded-xl font-medium hover:bg-black/80 transition-colors disabled:opacity-50 flex items-center gap-2 mx-auto"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <LinkIcon />
              )}
              Create Shareable Link
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Tab Switcher */}
            <div className="bg-white rounded-2xl border border-[var(--border)] p-2 flex gap-2">
              <button
                onClick={() => setActiveTab('link')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'link' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                🔗 Profile Link
              </button>
              <button
                onClick={() => setActiveTab('card')}
                className={`flex-1 py-3 rounded-xl font-medium transition-all ${
                  activeTab === 'card' ? 'bg-black text-white' : 'hover:bg-gray-100'
                }`}
              >
                🪪 Reddit Card
              </button>
            </div>

            {activeTab === 'link' ? (
              <>
                {/* Share Link & QR */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Your Share Link</h2>
                      <p className="text-sm text-[var(--muted)]">Anyone with this link can view your selected profile sections</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className={`text-sm ${shareSettings.is_active ? 'text-green-600' : 'text-[var(--muted)]'}`}>
                        {shareSettings.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <button
                        onClick={() => updateShare({ is_active: !shareSettings.is_active })}
                        className={`w-12 h-6 rounded-full transition-colors relative ${
                          shareSettings.is_active ? 'bg-green-500' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-transform ${
                          shareSettings.is_active ? 'translate-x-6' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </label>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="text"
                          value={shareUrl}
                          readOnly
                          className="flex-1 px-4 py-3 bg-[#fafafa] rounded-xl text-sm border border-[var(--border)] focus:outline-none"
                        />
                        <button
                          onClick={copyLink}
                          className={`px-4 py-3 rounded-xl font-medium transition-all ${
                            copied ? 'bg-green-500 text-white' : 'bg-black text-white hover:bg-black/80'
                          }`}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                        </button>
                      </div>
                      <div className="flex gap-2">
                        <Link
                          href={`/p/${shareSettings.share_token}`}
                          target="_blank"
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-sm transition-colors"
                        >
                          <ExternalLinkIcon />
                          Preview
                        </Link>
                        <button
                          onClick={downloadQR}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#fafafa] hover:bg-gray-100 rounded-lg text-sm transition-colors"
                        >
                          <DownloadIcon />
                          Download QR
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-center" ref={qrRef}>
                      <QRCodeSVG value={shareUrl} size={150} />
                    </div>
                  </div>
                </div>

                {/* Section Toggles */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold mb-1">Visible Sections</h2>
                      <p className="text-sm text-[var(--muted)]">Choose what information to share</p>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <span className="text-sm text-[var(--muted)]">Show contact</span>
                      <button
                        onClick={() => updateShare({ show_contact_info: !shareSettings.show_contact_info })}
                        className={`w-10 h-5 rounded-full transition-colors relative ${
                          shareSettings.show_contact_info ? 'bg-black' : 'bg-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                          shareSettings.show_contact_info ? 'translate-x-5' : 'translate-x-0.5'
                        }`} />
                      </button>
                    </label>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {SHAREABLE_SECTIONS.map((section) => {
                      const isEnabled = shareSettings.visible_sections.includes(section.id)
                      return (
                        <button
                          key={section.id}
                          onClick={() => toggleSection(section.id)}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            isEnabled ? 'border-black bg-black text-white' : 'border-[var(--border)] hover:border-gray-300'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{section.icon}</span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{section.name}</div>
                              <div className={`text-xs ${isEnabled ? 'text-white/60' : 'text-[var(--muted)]'}`}>
                                {section.description}
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              isEnabled ? 'border-white bg-white' : 'border-gray-300'
                            }`}>
                              {isEnabled && <CheckIcon className="w-3 h-3 text-black" />}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Reddit Business Card Generator */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                  <h2 className="text-lg font-semibold mb-1">Reddit Profile Card</h2>
                  <p className="text-sm text-[var(--muted)] mb-6">Create a shareable card with your CAT profile stats</p>

                  <div className="grid lg:grid-cols-2 gap-8">
                    {/* Card Preview */}
                    <div className="flex flex-col items-center">
                      <div 
                        ref={cardRef}
                        className="w-[400px] rounded-2xl p-5 relative overflow-hidden"
                        style={{
                          minHeight: '180px',
                          background: getThemeStyles().background,
                          color: getThemeStyles().color,
                          border: getThemeStyles().border,
                        }}
                      >
                        {/* Decorative elements */}
                        {cardSettings.theme !== 'minimal' && (
                          <>
                            <div 
                              className="absolute top-0 right-0 w-32 h-32 rounded-full"
                              style={{
                                filter: 'blur(48px)',
                                backgroundColor: cardSettings.theme === 'neon' ? 'rgba(0,255,136,0.15)' : 
                                  cardSettings.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.15)'
                              }}
                            />
                            <div 
                              className="absolute bottom-0 left-0 w-24 h-24 rounded-full"
                              style={{
                                filter: 'blur(32px)',
                                backgroundColor: cardSettings.theme === 'neon' ? 'rgba(0,255,136,0.1)' : 
                                  cardSettings.theme === 'light' ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'
                              }}
                            />
                          </>
                        )}
                        
                        {/* Content */}
                        <div className="relative z-10 h-full flex flex-col">
                          {/* Name Row */}
                          <div className="flex items-start justify-between mb-3">
                            <h3 className="text-2xl font-bold tracking-tight">
                              {getMaskedName(profile.personalInfo.fullName || 'Your Name')}
                            </h3>
                            <div 
                              className="text-sm font-mono font-bold px-2 py-1 rounded"
                              style={{ backgroundColor: getThemeStyles().boxBg }}
                              title="10th / 12th / Graduation"
                            >
                              {getAcademicsShort()}
                            </div>
                          </div>

                          {/* Stats - Compact Inline Layout */}
                          <div className="flex flex-wrap gap-2">
                            {cardSettings.showPercentile && getCATPercentile() && (
                              <div 
                                className="rounded-lg px-3 py-2 flex items-center gap-2"
                                style={{ backgroundColor: getThemeStyles().boxBg }}
                              >
                                <span className="text-[10px]" style={{ color: getThemeStyles().mutedColor }}>CAT</span>
                                <span className="text-base font-bold">{getCATPercentile()}%ile</span>
                              </div>
                            )}
                            
                            {cardSettings.showCategory && (
                              <div 
                                className="rounded-lg px-3 py-2 flex items-center gap-2"
                                style={{ backgroundColor: getThemeStyles().boxBg }}
                              >
                                <span className="text-base font-bold uppercase">
                                  {profile.personalInfo.category || 'GEN'}
                                </span>
                              </div>
                            )}
                            
                            {cardSettings.showWorkEx && (
                              <div 
                                className="rounded-lg px-3 py-2 flex items-center gap-2"
                                style={{ backgroundColor: getThemeStyles().boxBg }}
                              >
                                <span className="text-[10px]" style={{ color: getThemeStyles().mutedColor }}>Exp</span>
                                <span className="text-base font-bold">
                                  {getWorkExDisplay()}
                                </span>
                              </div>
                            )}
                            
                            {cardSettings.showEngineer && (
                              <div 
                                className="rounded-lg px-3 py-2"
                                style={{ backgroundColor: getThemeStyles().boxBg }}
                              >
                                <span className="text-base font-bold">
                                  {getIsEngineer() ? 'Eng' : 'Non-Eng'}
                                </span>
                              </div>
                            )}
                            
                            {cardSettings.showGender && (
                              <div 
                                className="rounded-lg px-3 py-2"
                                style={{ backgroundColor: getThemeStyles().boxBg }}
                              >
                                <span className="text-base font-bold capitalize">
                                  {profile.personalInfo.gender === 'male' ? 'M' : profile.personalInfo.gender === 'female' ? 'F' : 'O'}
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Footer */}
                          <div 
                            className="flex items-center justify-between mt-2 pt-2"
                            style={{ borderTop: `1px solid ${getThemeStyles().borderColor}` }}
                          >
                            <span className="text-xs" style={{ color: getThemeStyles().mutedColor, opacity: 0.7 }}>
                              Made with CatHub
                            </span>
                            <span className="text-xs" style={{ color: getThemeStyles().mutedColor, opacity: 0.7 }}>
                              r/MBA · r/CATpreparation
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Download Buttons */}
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={downloadCard}
                          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl font-medium hover:bg-black/80 transition-colors"
                        >
                          <DownloadIcon />
                          Download PNG
                        </button>
                        <button
                          onClick={copyCardToClipboard}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors ${
                            copied ? 'bg-green-500 text-white' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {copied ? <CheckIcon /> : <CopyIcon />}
                          {copied ? 'Copied!' : 'Copy Image'}
                        </button>
                      </div>
                    </div>

                    {/* Card Settings */}
                    <div className="space-y-4">
                      {/* Theme Selection */}
                      <div>
                        <label className="block text-sm font-medium mb-2">Card Theme</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'dark', label: '🌙 Dark' },
                            { id: 'light', label: '☀️ Light' },
                            { id: 'gradient', label: '🌈 Gradient' },
                            { id: 'neon', label: '💚 Neon' },
                            { id: 'ocean', label: '🌊 Ocean' },
                            { id: 'sunset', label: '🌅 Sunset' },
                            { id: 'minimal', label: '⬜ Minimal' },
                          ].map((theme) => (
                            <button
                              key={theme.id}
                              onClick={() => setCardSettings(prev => ({ ...prev, theme: theme.id as CardSettings['theme'] }))}
                              className={`p-2 rounded-xl border text-xs transition-all ${
                                cardSettings.theme === theme.id
                                  ? 'border-black bg-black text-white'
                                  : 'border-[var(--border)] hover:border-gray-300'
                              }`}
                            >
                              {theme.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Name Masking */}
                      <div className="p-4 bg-[#fafafa] rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">Mask Name</label>
                          <button
                            onClick={() => setCardSettings(prev => ({ ...prev, maskName: !prev.maskName }))}
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                              cardSettings.maskName ? 'bg-black' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                              cardSettings.maskName ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                        {cardSettings.maskName && (
                          <div>
                            <label className="block text-xs text-[var(--muted)] mb-1">Characters to mask</label>
                            <input
                              type="range"
                              min="1"
                              max="6"
                              value={cardSettings.maskChars}
                              onChange={(e) => setCardSettings(prev => ({ ...prev, maskChars: parseInt(e.target.value) }))}
                              className="w-full"
                            />
                            <p className="text-xs text-[var(--muted)] mt-1">
                              Preview: {getMaskedName(profile.personalInfo.fullName || 'John Doe')}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Work Experience Input */}
                      <div className="p-4 bg-[#fafafa] rounded-xl">
                        <div className="flex items-center justify-between mb-3">
                          <label className="text-sm font-medium">Work Experience</label>
                          <button
                            onClick={() => setCardSettings(prev => ({ ...prev, showWorkEx: !prev.showWorkEx }))}
                            className={`w-10 h-5 rounded-full transition-colors relative ${
                              cardSettings.showWorkEx ? 'bg-black' : 'bg-gray-300'
                            }`}
                          >
                            <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                              cardSettings.showWorkEx ? 'translate-x-5' : 'translate-x-0.5'
                            }`} />
                          </button>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="0"
                            max="360"
                            value={cardSettings.workExMonths}
                            onChange={(e) => setCardSettings(prev => ({ ...prev, workExMonths: parseInt(e.target.value) || 0 }))}
                            className="w-20 px-3 py-2 rounded-lg border border-[var(--border)] text-sm focus:outline-none focus:border-black"
                          />
                          <span className="text-sm text-[var(--muted)]">months</span>
                          <span className="text-sm font-medium ml-auto">
                            → {getWorkExDisplay()}
                          </span>
                        </div>
                        <p className="text-xs text-[var(--muted)] mt-2">
                          Enter 0 for Fresher, or total months of work experience
                        </p>
                      </div>

                      {/* Toggle Fields */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium mb-2">Show Fields</label>
                        
                        {[
                          { key: 'showPercentile', label: 'CAT Percentile', value: getCATPercentile() || 'Not set' },
                          { key: 'showCategory', label: 'Category', value: profile.personalInfo.category || 'General' },
                          { key: 'showEngineer', label: 'Engineer/Non-Eng', value: getIsEngineer() ? 'Engineer' : 'Non-Engineer' },
                          { key: 'showGender', label: 'Gender', value: profile.personalInfo.gender || 'Not set' },
                        ].map((field) => (
                          <div 
                            key={field.key}
                            className="flex items-center justify-between p-3 bg-[#fafafa] rounded-xl"
                          >
                            <div>
                              <p className="text-sm font-medium">{field.label}</p>
                              <p className="text-xs text-[var(--muted)]">{field.value}</p>
                            </div>
                            <button
                              onClick={() => setCardSettings(prev => ({ 
                                ...prev, 
                                [field.key]: !prev[field.key as keyof CardSettings] 
                              }))}
                              className={`w-10 h-5 rounded-full transition-colors relative ${
                                cardSettings[field.key as keyof CardSettings] ? 'bg-black' : 'bg-gray-300'
                              }`}
                            >
                              <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform ${
                                cardSettings[field.key as keyof CardSettings] ? 'translate-x-5' : 'translate-x-0.5'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Tips */}
                      <div className="p-4 bg-orange-50 rounded-xl border border-orange-200">
                        <p className="text-sm text-orange-800">
                          <strong>💡 Reddit Tip:</strong> Use name masking for privacy when posting on r/MBA or r/CATpreparation. The card can be directly pasted into Reddit posts!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
}

function ShareIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
}

function LinkIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" /></svg>
}

function CopyIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
}

function CheckIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
}

function ExternalLinkIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
}

function DownloadIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
}

function EyeIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
}
