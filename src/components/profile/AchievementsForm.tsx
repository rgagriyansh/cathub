'use client'

import { Achievement, Certification } from '@/types/profile'

interface Props {
  data: Achievement[]
  certifications: Certification[]
  onChangeAchievements: (data: Achievement[]) => void
  onChangeCertifications: (data: Certification[]) => void
}

const ACHIEVEMENT_TYPES = [
  { value: 'academic', label: 'Academic', icon: '📚' },
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'sports', label: 'Sports', icon: '🏆' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'social', label: 'Social Service', icon: '🤝' },
  { value: 'other', label: 'Other', icon: '⭐' },
]

export default function AchievementsForm({ 
  data, 
  certifications, 
  onChangeAchievements, 
  onChangeCertifications 
}: Props) {
  // Achievements
  const addAchievement = () => {
    onChangeAchievements([
      ...data,
      {
        id: Date.now().toString(),
        title: '',
        year: '',
        issuingOrganization: '',
        description: '',
        type: 'other',
      },
    ])
  }

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    onChangeAchievements(
      data.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeAchievement = (id: string) => {
    onChangeAchievements(data.filter((item) => item.id !== id))
  }

  // Certifications
  const addCertification = () => {
    onChangeCertifications([
      ...certifications,
      {
        id: Date.now().toString(),
        name: '',
        issuingOrganization: '',
        year: '',
        credentialId: '',
      },
    ])
  }

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    onChangeCertifications(
      certifications.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    )
  }

  const removeCertification = (id: string) => {
    onChangeCertifications(certifications.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8">
      {/* Achievements Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🏅</span>
          <div>
            <h3 className="font-medium text-lg">Awards & Achievements</h3>
            <p className="text-sm text-[var(--muted)]">Scholarships, medals, recognitions, competitions won, etc.</p>
          </div>
        </div>

        {data.length === 0 ? (
          <button
            onClick={addAchievement}
            className="w-full py-6 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Achievement
          </button>
        ) : (
          <div className="space-y-4">
            {data.map((achievement, index) => (
              <div key={achievement.id} className="border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[var(--muted)]">
                    Achievement {index + 1}
                  </span>
                  <button
                    onClick={() => removeAchievement(achievement.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={achievement.title}
                      onChange={(e) => updateAchievement(achievement.id, 'title', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., Gold Medal in State Mathematics Olympiad"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Type</label>
                    <select
                      value={achievement.type}
                      onChange={(e) => updateAchievement(achievement.id, 'type', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
                    >
                      {ACHIEVEMENT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                          {type.icon} {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="text"
                      value={achievement.year}
                      onChange={(e) => updateAchievement(achievement.id, 'year', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., 2022"
                      maxLength={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Issuing Organization</label>
                    <input
                      type="text"
                      value={achievement.issuingOrganization}
                      onChange={(e) => updateAchievement(achievement.id, 'issuingOrganization', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., Government of Maharashtra"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Description</label>
                    <textarea
                      value={achievement.description}
                      onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
                      placeholder="Brief description of the achievement..."
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addAchievement}
              className="w-full py-3 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors text-sm"
            >
              + Add Another Achievement
            </button>
          </div>
        )}
      </div>

      {/* Certifications Section */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📜</span>
          <div>
            <h3 className="font-medium text-lg">Certifications</h3>
            <p className="text-sm text-[var(--muted)]">Professional certifications, online courses, etc.</p>
          </div>
        </div>

        {certifications.length === 0 ? (
          <button
            onClick={addCertification}
            className="w-full py-6 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Certification
          </button>
        ) : (
          <div className="space-y-4">
            {certifications.map((cert, index) => (
              <div key={cert.id} className="border border-[var(--border)] rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-[var(--muted)]">
                    Certification {index + 1}
                  </span>
                  <button
                    onClick={() => removeCertification(cert.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Certification Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => updateCertification(cert.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., AWS Solutions Architect, Google Analytics"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuingOrganization}
                      onChange={(e) => updateCertification(cert.id, 'issuingOrganization', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., Amazon, Google, Coursera"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Year</label>
                    <input
                      type="text"
                      value={cert.year}
                      onChange={(e) => updateCertification(cert.id, 'year', e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                      placeholder="e.g., 2023"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              onClick={addCertification}
              className="w-full py-3 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors text-sm"
            >
              + Add Another Certification
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Include achievements that demonstrate leadership, problem-solving, 
          or social impact. These are highly valued in MBA applications.
        </p>
      </div>
    </div>
  )
}
