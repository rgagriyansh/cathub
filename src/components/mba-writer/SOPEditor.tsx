'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface ProfileData {
  personalInfo: { fullName?: string; city?: string; state?: string }
  academics: Array<{ level: string; institution: string; stream_branch: string; percentage_cgpa: string }>
  entranceScores: Array<{ examName: string; overallPercentile: string }>
  workExperience: Array<{ companyName: string; designation: string; industry: string; responsibilities: string; achievements: string }>
  activities: Array<{ name: string; level: string; description: string; achievements: string }>
  achievements: Array<{ title: string; year: string; description: string }>
  certifications: Array<{ name: string; issuingOrganization: string }>
  careerGoals: { whyMba?: string; shortTermGoals?: string; longTermGoals?: string; preferredSpecialization?: string[] }
  additionalInfo: { hobbies?: string; socialProjects?: string; otherInfo?: string }
}

interface AIAnalysis {
  overallScore: number
  summary: string
  scores: {
    opening: { score: number; comment: string }
    storytelling: { score: number; comment: string }
    specificity: { score: number; comment: string }
    whyMba: { score: number; comment: string }
    whySchool: { score: number; comment: string }
    authenticity: { score: number; comment: string }
    structure: { score: number; comment: string }
    language: { score: number; comment: string }
  }
  strengths: string[]
  improvements: Array<{ issue: string; suggestion: string; priority: 'high' | 'medium' | 'low' }>
  cliches: string[]
  wordCountAnalysis: string
  admissionChance: string
}

interface SOPEditorProps {
  content: string
  schoolName: string
  wordLimit: number
  profile?: ProfileData
  onBack: () => void
  onRegenerate: () => void
}

export default function SOPEditor({ content, schoolName, wordLimit, profile, onBack, onRegenerate }: SOPEditorProps) {
  const [editedContent, setEditedContent] = useState(content)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copySuccess, setCopySuccess] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(true)
  const [exportingPdf, setExportingPdf] = useState(false)
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null)
  const [analyzingAI, setAnalyzingAI] = useState(false)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const supabase = createClient()

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px'
    }
  }, [editedContent])

  // Auto-analyze when content loads
  useEffect(() => {
    if (content && content.trim().length > 100) {
      analyzeWithAI()
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Stats
  const wordCount = editedContent.trim().split(/\s+/).filter(Boolean).length
  const charCount = editedContent.length
  const isOverLimit = wordCount > wordLimit
  const paragraphCount = editedContent.split(/\n\n+/).filter(Boolean).length

  const analyzeWithAI = async () => {
    if (editedContent.trim().length < 100) {
      setAnalysisError('SOP is too short to analyze')
      return
    }

    setAnalyzingAI(true)
    setAnalysisError(null)

    try {
      const response = await fetch('/api/analyze-sop', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: editedContent,
          schoolName,
          wordLimit,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to analyze')
      }

      const data = await response.json()
      setAiAnalysis(data.analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
      setAnalysisError('Failed to analyze SOP. Please try again.')
    } finally {
      setAnalyzingAI(false)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      
      if (userError) {
        throw new Error('Authentication error: ' + userError.message)
      }
      
      if (!user) {
        throw new Error('Please log in to save your SOP')
      }

      const { error } = await supabase.from('generated_sops').insert({
        user_id: user.id,
        title: `SOP for ${schoolName}`,
        school_name: schoolName,
        sop_type: 'sop',
        content: editedContent,
        word_count: wordCount,
      })

      if (error) {
        // Check for common errors
        if (error.code === '42P01') {
          throw new Error('Database table not found. Please run the schema.sql in Supabase SQL Editor.')
        } else if (error.code === '42501') {
          throw new Error('Permission denied. Check your RLS policies in Supabase.')
        } else {
          throw new Error(error.message)
        }
      }
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving SOP:', error)
      setSaveError(error instanceof Error ? error.message : 'Failed to save SOP')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(editedContent)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
    }
  }

  const handleDownloadTxt = () => {
    const blob = new Blob([editedContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SOP_${schoolName.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportPdf = async () => {
    setExportingPdf(true)
    try {
      const html2pdf = (await import('html2pdf.js')).default
      const container = document.createElement('div')
      container.innerHTML = `
        <div style="font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; padding: 40px; color: #000;">
          <h1 style="font-size: 16pt; font-weight: bold; margin-bottom: 8px; text-align: center;">Statement of Purpose</h1>
          <p style="font-size: 10pt; color: #666; text-align: center; margin-bottom: 32px;">${schoolName} | ${wordCount} words</p>
          <div style="text-align: justify; white-space: pre-wrap;">${editedContent.split('\n\n').map(p => `<p style="margin-bottom: 16px;">${p}</p>`).join('')}</div>
        </div>
      `
      const opt = {
        margin: [0.75, 0.75] as [number, number],
        filename: `SOP_${schoolName.replace(/\s+/g, '_')}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      }
      await html2pdf().set(opt).from(container).save()
    } catch (error) {
      console.error('PDF export failed:', error)
      window.print()
    } finally {
      setExportingPdf(false)
    }
  }

  const handleExportWord = () => {
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word'>
      <head><meta charset='utf-8'><title>SOP for ${schoolName}</title></head>
      <body style="font-family: Georgia, serif; font-size: 12pt; line-height: 1.6;">
        <h1 style="text-align: center;">Statement of Purpose</h1>
        <p style="text-align: center; color: #666;">${schoolName} | ${wordCount} words</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        ${editedContent.split('\n\n').map(p => `<p style="text-align: justify;">${p}</p>`).join('')}
      </body>
      </html>
    `
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `SOP_${schoolName.replace(/\s+/g, '_')}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getScoreColor = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number, max: number = 100) => {
    const percentage = (score / max) * 100
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  const getPriorityColor = (priority: string) => {
    if (priority === 'high') return 'bg-red-100 text-red-700'
    if (priority === 'medium') return 'bg-yellow-100 text-yellow-700'
    return 'bg-blue-100 text-blue-700'
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-black text-white sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                <ArrowLeftIcon />
              </button>
              <div>
                <h1 className="font-semibold">SOP for {schoolName}</h1>
                <div className="flex items-center gap-3 text-sm text-white/60">
                  <span className={isOverLimit ? 'text-red-400' : ''}>
                    {wordCount} / {wordLimit} words
                  </span>
                  <span>•</span>
                  <span>{charCount} characters</span>
                  {aiAnalysis && (
                    <>
                      <span>•</span>
                      <span className={`font-medium ${getScoreColor(aiAnalysis.overallScore)}`}>
                        Score: {aiAnalysis.overallScore}/100
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm ${showAnalysis ? 'bg-white/20' : 'hover:bg-white/10'}`}
              >
                <AnalyticsIcon />
                Analysis
              </button>
              <button onClick={onRegenerate} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                <RefreshIcon />
                Regenerate
              </button>
              <button onClick={handleCopy} className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                {copySuccess ? <CheckIcon /> : <CopyIcon />}
                {copySuccess ? 'Copied!' : 'Copy'}
              </button>
              
              {/* Export Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-sm">
                  <DownloadIcon />
                  Export
                  <ChevronDownIcon />
                </button>
                <div className="absolute right-0 top-full mt-1 bg-white text-black rounded-lg shadow-xl border border-gray-200 py-1 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <button onClick={handleDownloadTxt} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                    <TxtIcon /> Text (.txt)
                  </button>
                  <button onClick={handleExportWord} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2">
                    <WordIcon /> Word (.doc)
                  </button>
                  <button onClick={handleExportPdf} disabled={exportingPdf} className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 flex items-center gap-2 disabled:opacity-50">
                    <PdfIcon /> {exportingPdf ? 'Exporting...' : 'PDF (.pdf)'}
                  </button>
                </div>
              </div>
              
              <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-black hover:bg-white/90 transition-colors text-sm font-medium disabled:opacity-50">
                {saved ? <CheckIcon className="text-green-600" /> : <SaveIcon />}
                {isSaving ? 'Saving...' : saved ? 'Saved!' : 'Save'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Word count warning */}
      {isOverLimit && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-2 text-red-700 text-sm">
            <WarningIcon />
            Your SOP exceeds the word limit by {wordCount - wordLimit} words.
          </div>
        </div>
      )}

      {/* Save error */}
      {saveError && (
        <div className="bg-red-50 border-b border-red-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 text-red-700 text-sm">
              <WarningIcon />
              <span><strong>Save failed:</strong> {saveError}</span>
            </div>
            <button 
              onClick={() => setSaveError(null)}
              className="text-red-700 hover:text-red-900"
            >
              <CloseIcon />
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className={`grid gap-6 ${showAnalysis ? 'lg:grid-cols-3' : ''}`}>
          {/* Editor */}
          <div className={showAnalysis ? 'lg:col-span-2' : ''}>
            <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
              {/* Toolbar */}
              <div className="border-b border-[var(--border)] px-4 py-3 flex items-center gap-2">
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Bold"><BoldIcon /></button>
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Italic"><ItalicIcon /></button>
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Underline"><UnderlineIcon /></button>
                <div className="w-px h-6 bg-[var(--border)] mx-1" />
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Align Left"><AlignLeftIcon /></button>
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Align Center"><AlignCenterIcon /></button>
                <button className="p-2 hover:bg-[#fafafa] rounded-lg transition-colors" title="Justify"><AlignJustifyIcon /></button>
              </div>

              {/* Text Area */}
              <textarea
                ref={textareaRef}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="w-full p-6 md:p-8 text-base leading-relaxed focus:outline-none resize-none min-h-[500px]"
                style={{ fontFamily: 'Georgia, serif' }}
                placeholder="Your SOP will appear here..."
              />
            </div>

            {/* Re-analyze button */}
            <div className="mt-4 flex justify-end">
              <button
                onClick={analyzeWithAI}
                disabled={analyzingAI}
                className="flex items-center gap-2 px-4 py-2 text-sm bg-black text-white rounded-lg hover:bg-black/80 disabled:opacity-50"
              >
                {analyzingAI ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <SparklesIcon />
                    Re-analyze with AI
                  </>
                )}
              </button>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Words</p>
                <p className={`text-2xl font-bold ${isOverLimit ? 'text-red-600' : ''}`}>{wordCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Characters</p>
                <p className="text-2xl font-bold">{charCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Paragraphs</p>
                <p className="text-2xl font-bold">{paragraphCount}</p>
              </div>
              <div className="bg-white rounded-xl border border-[var(--border)] p-4">
                <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Reading Time</p>
                <p className="text-2xl font-bold">{Math.ceil(wordCount / 200)} min</p>
              </div>
            </div>
          </div>

          {/* AI Analysis Panel */}
          {showAnalysis && (
            <div className="space-y-6">
              {/* Loading State */}
              {analyzingAI && (
                <div className="bg-white rounded-2xl border border-[var(--border)] p-8">
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className="w-12 h-12 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                    <div className="text-center">
                      <p className="font-medium">Analyzing your SOP...</p>
                      <p className="text-sm text-[var(--muted)] mt-1">AI is reviewing content, structure, and authenticity</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {analysisError && !analyzingAI && (
                <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                  <div className="flex items-center gap-3 text-red-700">
                    <WarningIcon />
                    <p>{analysisError}</p>
                  </div>
                  <button
                    onClick={analyzeWithAI}
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* AI Analysis Results */}
              {aiAnalysis && !analyzingAI && (
                <>
                  {/* Overall Score */}
                  <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold flex items-center gap-2">
                        <SparklesIcon />
                        AI Analysis
                      </h3>
                      <div className={`text-3xl font-bold ${getScoreColor(aiAnalysis.overallScore)}`}>
                        {aiAnalysis.overallScore}/100
                      </div>
                    </div>
                    
                    {/* Progress bar */}
                    <div className="h-3 bg-gray-100 rounded-full mb-4 overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all ${getScoreBgColor(aiAnalysis.overallScore)}`}
                        style={{ width: `${aiAnalysis.overallScore}%` }}
                      />
                    </div>
                    
                    <p className="text-sm text-[var(--muted)]">{aiAnalysis.summary}</p>

                    {/* Admission Chance */}
                    <div className="mt-4 p-3 bg-[#fafafa] rounded-lg">
                      <p className="text-xs text-[var(--muted)] uppercase tracking-wide mb-1">Admission Chance</p>
                      <p className="text-sm font-medium">{aiAnalysis.admissionChance}</p>
                    </div>
                  </div>

                  {/* Detailed Scores */}
                  <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                    <h3 className="font-semibold mb-4">Detailed Scores</h3>
                    <div className="space-y-3">
                      {Object.entries(aiAnalysis.scores).map(([key, value]) => (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className={`text-sm font-semibold ${getScoreColor(value.score, 10)}`}>
                              {value.score}/10
                            </span>
                          </div>
                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1">
                            <div 
                              className={`h-full rounded-full ${getScoreBgColor(value.score, 10)}`}
                              style={{ width: `${value.score * 10}%` }}
                            />
                          </div>
                          <p className="text-xs text-[var(--muted)]">{value.comment}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Strengths */}
                  {aiAnalysis.strengths.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <CheckCircleIcon className="text-green-500" />
                        Strengths
                      </h3>
                      <ul className="space-y-2">
                        {aiAnalysis.strengths.map((strength, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <span className="text-green-500 mt-0.5">✓</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Improvements */}
                  {aiAnalysis.improvements.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <ImprovementIcon />
                        Areas to Improve
                      </h3>
                      <div className="space-y-4">
                        {aiAnalysis.improvements.map((item, i) => (
                          <div key={i} className="p-3 bg-[#fafafa] rounded-lg">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <p className="text-sm font-medium">{item.issue}</p>
                              <span className={`text-xs px-2 py-0.5 rounded-full ${getPriorityColor(item.priority)}`}>
                                {item.priority}
                              </span>
                            </div>
                            <p className="text-xs text-[var(--muted)]">
                              💡 {item.suggestion}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clichés Found */}
                  {aiAnalysis.cliches.length > 0 && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                      <h3 className="font-semibold flex items-center gap-2 mb-4">
                        <WarningIcon className="text-yellow-500" />
                        Clichés Found
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {aiAnalysis.cliches.map((cliche, i) => (
                          <span key={i} className="px-2 py-1 bg-yellow-50 text-yellow-700 rounded text-xs">
                            &quot;{cliche}&quot;
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-[var(--muted)] mt-3">
                        Consider replacing these with more original language.
                      </p>
                    </div>
                  )}

                  {/* Word Count Analysis */}
                  <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                    <h3 className="font-semibold flex items-center gap-2 mb-3">
                      <WordCountIcon />
                      Word Count Analysis
                    </h3>
                    <p className="text-sm text-[var(--muted)]">{aiAnalysis.wordCountAnalysis}</p>
                  </div>
                </>
              )}

              {/* Quick Tips (shown when no analysis yet) */}
              {!aiAnalysis && !analyzingAI && !analysisError && (
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                  <h3 className="font-semibold flex items-center gap-2 mb-4">
                    <TipsIcon />
                    Quick Tips
                  </h3>
                  <ul className="space-y-3 text-sm text-[var(--muted)]">
                    <li className="flex items-start gap-2"><span className="text-black">•</span>Use specific numbers and outcomes</li>
                    <li className="flex items-start gap-2"><span className="text-black">•</span>Avoid &quot;I am [Name] from [City]&quot; openings</li>
                    <li className="flex items-start gap-2"><span className="text-black">•</span>Show, don&apos;t tell - use examples</li>
                    <li className="flex items-start gap-2"><span className="text-black">•</span>Be specific about why this school</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Link href="/dashboard/mba-writer" className="flex items-center gap-2 text-[var(--muted)] hover:text-black transition-colors">
            <ArrowLeftIcon /> Back to MBA Writer
          </Link>
          <div className="flex items-center gap-3">
            <button onClick={onRegenerate} className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[var(--border)] hover:border-black transition-colors font-medium">
              <RefreshIcon /> Regenerate
            </button>
            <button onClick={handleSave} disabled={isSaving} className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-black text-white hover:bg-black/80 transition-colors font-medium disabled:opacity-50">
              {saved ? 'Saved!' : 'Save SOP'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Icons
function ArrowLeftIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
}

function RefreshIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
}

function CopyIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
}

function DownloadIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
}

function SaveIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" /></svg>
}

function CheckIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
}

function WarningIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>
}

function BoldIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 12h8a4 4 0 100-8H6v8zm0 0h9a4 4 0 110 8H6v-8z" /></svg>
}

function ItalicIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="19" y1="4" x2="10" y2="4" /><line x1="14" y1="20" x2="5" y2="20" /><line x1="15" y1="4" x2="9" y2="20" /></svg>
}

function UnderlineIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M6 3v7a6 6 0 006 6 6 6 0 006-6V3" /><line x1="4" y1="21" x2="20" y2="21" /></svg>
}

function AlignLeftIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="15" y2="12" /><line x1="3" y1="18" x2="18" y2="18" /></svg>
}

function AlignCenterIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="6" y1="12" x2="18" y2="12" /><line x1="4" y1="18" x2="20" y2="18" /></svg>
}

function AlignJustifyIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
}

function AnalyticsIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
}

function ChevronDownIcon() {
  return <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
}

function TxtIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}

function WordIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}

function PdfIcon() {
  return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 15h6" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 18h3" /></svg>
}

function SparklesIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" /></svg>
}

function TipsIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" /></svg>
}

function CheckCircleIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

function ImprovementIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}

function WordCountIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" /></svg>
}

function CloseIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
}
