'use client'

import { AdditionalInfo } from '@/types/profile'
import { useState } from 'react'

interface Props {
  data: AdditionalInfo
  onChange: (data: AdditionalInfo) => void
}

const COMMON_LANGUAGES = [
  'Hindi', 'English', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 
  'Gujarati', 'Kannada', 'Malayalam', 'Odia', 'Punjabi', 'Urdu',
  'French', 'German', 'Spanish', 'Japanese', 'Mandarin'
]

export default function AdditionalInfoForm({ data, onChange }: Props) {
  const [languageInput, setLanguageInput] = useState('')

  const updateField = (field: keyof AdditionalInfo, value: string | string[]) => {
    onChange({ ...data, [field]: value })
  }

  const addLanguage = (language: string) => {
    if (language && !data.languages.includes(language)) {
      updateField('languages', [...data.languages, language])
    }
    setLanguageInput('')
  }

  const removeLanguage = (language: string) => {
    updateField('languages', data.languages.filter(l => l !== language))
  }

  return (
    <div className="space-y-8">
      {/* Instructions Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          ✍️ <strong>Write in your own words!</strong> No word limit. Use short, simple sentences. 
          Don't worry about grammar or structure - just share your thoughts naturally.
        </p>
      </div>

      {/* Hobbies & Interests */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Hobbies & Interests
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          What do you do in your free time? This helps show your personality.
        </p>
        <textarea
          value={data.hobbies}
          onChange={(e) => updateField('hobbies', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Write freely... e.g., I love playing chess. Read a lot of books. Recently got into trekking. Like cooking on weekends. Follow cricket religiously."
        />
      </div>

      {/* Languages */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Languages Known
        </label>
        
        {/* Selected languages */}
        {data.languages.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.languages.map((lang) => (
              <button
                key={lang}
                onClick={() => removeLanguage(lang)}
                className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-sm"
              >
                {lang}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}

        {/* Quick add buttons */}
        <div className="flex flex-wrap gap-2 mb-3">
          {COMMON_LANGUAGES.filter(l => !data.languages.includes(l)).slice(0, 8).map((lang) => (
            <button
              key={lang}
              onClick={() => addLanguage(lang)}
              className="px-3 py-1.5 rounded-full text-sm border border-[var(--border)] hover:border-black transition-colors"
            >
              + {lang}
            </button>
          ))}
        </div>

        {/* Custom language input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={languageInput}
            onChange={(e) => setLanguageInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addLanguage(languageInput)}
            className="flex-1 px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
            placeholder="Add another language..."
          />
          <button
            onClick={() => addLanguage(languageInput)}
            className="px-4 py-3 bg-black text-white rounded-xl hover:bg-black/80 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {/* Social Projects / Volunteering */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Social Projects / Volunteering
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Any NGO work, community service, or social initiatives you've been part of
        </p>
        <textarea
          value={data.socialProjects}
          onChange={(e) => updateField('socialProjects', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Write in short sentences... e.g., Taught underprivileged kids for 2 years. Part of an NGO that plants trees. Organized blood donation camps in college. Help at old age home sometimes."
        />
      </div>

      {/* Publications */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Publications / Research Papers
        </label>
        <textarea
          value={data.publications}
          onChange={(e) => updateField('publications', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="List any publications, research papers, or articles published..."
        />
      </div>

      {/* Patents */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Patents / Intellectual Property
        </label>
        <textarea
          value={data.patents}
          onChange={(e) => updateField('patents', e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="List any patents filed or granted..."
        />
      </div>

      {/* Other Information */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Anything Else?
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Any other information that might strengthen your application
        </p>
        <textarea
          value={data.otherInfo}
          onChange={(e) => updateField('otherInfo', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Share anything unique... e.g., First person in family to go to college. Overcame financial difficulties. Family runs a small business. Had health issues but recovered. Travelled to 10 countries."
        />
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <p className="text-sm text-green-700">
          🎉 <strong>Almost done!</strong> After completing this section, you can save your profile 
          and start generating personalized SOPs for your target schools.
        </p>
      </div>
    </div>
  )
}
