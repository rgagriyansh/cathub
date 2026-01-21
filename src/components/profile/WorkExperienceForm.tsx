'use client'

import { WorkExperience } from '@/types/profile'
import { v4 as uuidv4 } from 'crypto'

interface Props {
  data: WorkExperience[]
  onChange: (data: WorkExperience[]) => void
}

const INDUSTRIES = [
  'Information Technology',
  'Consulting',
  'Banking & Finance',
  'FMCG',
  'Manufacturing',
  'Healthcare',
  'E-commerce',
  'Telecom',
  'Energy & Utilities',
  'Automobile',
  'Real Estate',
  'Media & Entertainment',
  'Education',
  'Government/PSU',
  'Startup',
  'Other',
]

export default function WorkExperienceForm({ data, onChange }: Props) {
  const addExperience = () => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        companyName: '',
        designation: '',
        industry: '',
        startDate: '',
        endDate: '',
        isCurrentRole: false,
        responsibilities: '',
        achievements: '',
      },
    ])
  }

  const updateExperience = (id: string, field: keyof WorkExperience, value: string | boolean) => {
    onChange(
      data.map((exp) =>
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    )
  }

  const removeExperience = (id: string) => {
    onChange(data.filter((exp) => exp.id !== id))
  }

  return (
    <div className="space-y-6">
      {data.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-[var(--border)] rounded-xl">
          <div className="w-16 h-16 bg-[#fafafa] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">💼</span>
          </div>
          <h3 className="font-medium mb-2">No work experience added</h3>
          <p className="text-[var(--muted)] text-sm mb-4">
            Add your professional experience to strengthen your profile
          </p>
          <button
            onClick={addExperience}
            className="inline-flex items-center gap-2 bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-black/80 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Work Experience
          </button>
        </div>
      ) : (
        <>
          {data.map((exp, index) => (
            <div key={exp.id} className="border border-[var(--border)] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Experience {index + 1}</h3>
                <button
                  onClick={() => removeExperience(exp.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium"
                >
                  Remove
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* Company Name */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Company Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.companyName}
                    onChange={(e) => updateExperience(exp.id, 'companyName', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                    placeholder="e.g., Tata Consultancy Services"
                  />
                </div>

                {/* Designation */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Designation <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={exp.designation}
                    onChange={(e) => updateExperience(exp.id, 'designation', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                    placeholder="e.g., Software Engineer"
                  />
                </div>

                {/* Industry */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Industry
                  </label>
                  <select
                    value={exp.industry}
                    onChange={(e) => updateExperience(exp.id, 'industry', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Select industry</option>
                    {INDUSTRIES.map((industry) => (
                      <option key={industry} value={industry}>{industry}</option>
                    ))}
                  </select>
                </div>

                {/* Current Role Checkbox */}
                <div className="flex items-center">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={exp.isCurrentRole}
                      onChange={(e) => updateExperience(exp.id, 'isCurrentRole', e.target.checked)}
                      className="w-4 h-4 rounded border-[var(--border)]"
                    />
                    <span className="text-sm">This is my current role</span>
                  </label>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Start Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                {/* End Date */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    End Date {!exp.isCurrentRole && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.isCurrentRole}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors disabled:bg-[#fafafa] disabled:cursor-not-allowed"
                  />
                </div>

                {/* Responsibilities */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Key Responsibilities
                  </label>
                  <textarea
                    value={exp.responsibilities}
                    onChange={(e) => updateExperience(exp.id, 'responsibilities', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Describe your main responsibilities and role..."
                  />
                </div>

                {/* Achievements */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-2">
                    Key Achievements <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={exp.achievements}
                    onChange={(e) => updateExperience(exp.id, 'achievements', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder="Mention specific achievements, projects led, impact created (use numbers where possible)..."
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addExperience}
            className="w-full py-4 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Experience
          </button>
        </>
      )}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Quantify your achievements whenever possible. 
          "Increased sales by 30%" is more impactful than "Improved sales performance".
        </p>
      </div>
    </div>
  )
}
