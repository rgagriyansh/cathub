'use client'

import { CareerGoals, MBA_SCHOOLS, MBA_SPECIALIZATIONS } from '@/types/profile'
import { useState } from 'react'

interface Props {
  data: CareerGoals
  onChange: (data: CareerGoals) => void
}

export default function CareerGoalsForm({ data, onChange }: Props) {
  const [schoolSearch, setSchoolSearch] = useState('')

  const updateField = (field: keyof CareerGoals, value: string | string[]) => {
    onChange({ ...data, [field]: value })
  }

  const toggleSchool = (school: string) => {
    const newSchools = data.targetSchools.includes(school)
      ? data.targetSchools.filter(s => s !== school)
      : [...data.targetSchools, school]
    updateField('targetSchools', newSchools)
  }

  const toggleSpecialization = (spec: string) => {
    const newSpecs = data.preferredSpecialization.includes(spec)
      ? data.preferredSpecialization.filter(s => s !== spec)
      : [...data.preferredSpecialization, spec]
    updateField('preferredSpecialization', newSpecs)
  }

  const filteredSchools = MBA_SCHOOLS.filter(school =>
    school.toLowerCase().includes(schoolSearch.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Instructions Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
        <p className="text-sm text-amber-800">
          ✍️ <strong>Write in your own words!</strong> No word limit. Just use short, simple sentences 
          to express your thoughts. Our AI will combine your inputs to create a polished SOP.
        </p>
      </div>

      {/* Why MBA */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Why MBA? <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          What motivates you to pursue an MBA? What do you hope to gain from it?
        </p>
        <textarea
          value={data.whyMba}
          onChange={(e) => updateField('whyMba', e.target.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Write freely in your own words... e.g., I want to transition from tech to product management. I feel I lack business acumen. Want to build my own startup someday."
        />
      </div>

      {/* Short-term Goals */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Short-term Career Goals (2-3 years post MBA) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.shortTermGoals}
          onChange={(e) => updateField('shortTermGoals', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Write in short sentences... e.g., Want to join a consulting firm. Interested in strategy roles. McKinsey or BCG would be ideal. Open to working in different cities."
        />
      </div>

      {/* Long-term Goals */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Long-term Career Goals (5-10 years) <span className="text-red-500">*</span>
        </label>
        <textarea
          value={data.longTermGoals}
          onChange={(e) => updateField('longTermGoals', e.target.value)}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
          placeholder="Write in short sentences... e.g., Want to start my own company. Focus on edtech or healthtech. Give back to society. Maybe teach at a B-school someday."
        />
      </div>

      {/* Target Schools */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Target Schools <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Select the schools you're applying to (you can select multiple)
        </p>
        
        <input
          type="text"
          value={schoolSearch}
          onChange={(e) => setSchoolSearch(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors mb-3"
          placeholder="Search schools..."
        />

        {/* Selected schools */}
        {data.targetSchools.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {data.targetSchools.map((school) => (
              <button
                key={school}
                onClick={() => toggleSchool(school)}
                className="flex items-center gap-1 bg-black text-white px-3 py-1.5 rounded-full text-sm"
              >
                {school}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            ))}
          </div>
        )}

        <div className="max-h-48 overflow-y-auto border border-[var(--border)] rounded-xl p-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {filteredSchools.map((school) => (
              <button
                key={school}
                onClick={() => toggleSchool(school)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  data.targetSchools.includes(school)
                    ? 'bg-black text-white'
                    : 'bg-[#fafafa] hover:bg-[#f0f0f0]'
                }`}
              >
                {school}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Preferred Specialization */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Preferred Specialization
        </label>
        <p className="text-sm text-[var(--muted)] mb-3">
          Select your areas of interest (you can select multiple)
        </p>
        
        <div className="flex flex-wrap gap-2">
          {MBA_SPECIALIZATIONS.map((spec) => (
            <button
              key={spec}
              onClick={() => toggleSpecialization(spec)}
              className={`px-4 py-2 rounded-full text-sm transition-colors ${
                data.preferredSpecialization.includes(spec)
                  ? 'bg-black text-white'
                  : 'border border-[var(--border)] hover:border-black'
              }`}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Be specific about your goals. "I want to work in consulting" 
          is okay, but "I want to join McKinsey's Digital Practice to help traditional businesses 
          transform digitally" is much better.
        </p>
      </div>
    </div>
  )
}
