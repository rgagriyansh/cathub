'use client'

import { EntranceScore } from '@/types/profile'

interface Props {
  data: EntranceScore[]
  onChange: (data: EntranceScore[]) => void
}

const OTHER_EXAMS = ['XAT', 'GMAT', 'NMAT', 'SNAP', 'CMAT', 'MAT', 'IIFT', 'TISSNET']

export default function EntranceScoresForm({ data, onChange }: Props) {
  const catScore = data.find(s => s.examName === 'CAT') || {
    examName: 'CAT',
    overallScore: '',
    overallPercentile: '',
    sectionalScores: [
      { section: 'VARC', score: '', percentile: '' },
      { section: 'DILR', score: '', percentile: '' },
      { section: 'QA', score: '', percentile: '' },
    ],
    year: '',
  }

  const otherScores = data.filter(s => s.examName !== 'CAT')

  const updateCATScore = (field: string, value: string) => {
    const newCat = { ...catScore, [field]: value }
    const newData = [newCat, ...otherScores]
    onChange(newData)
  }

  const updateCATSectional = (section: string, field: 'score' | 'percentile', value: string) => {
    const newSectional = catScore.sectionalScores?.map(s =>
      s.section === section ? { ...s, [field]: value } : s
    ) || []
    const newCat = { ...catScore, sectionalScores: newSectional }
    const newData = [newCat, ...otherScores]
    onChange(newData)
  }

  const addOtherExam = (examName: string) => {
    if (examName && !data.find(s => s.examName === examName)) {
      onChange([...data, {
        examName,
        overallScore: '',
        overallPercentile: '',
        year: '',
      }])
    }
  }

  const updateOtherExam = (examName: string, field: string, value: string) => {
    const newData = data.map(s =>
      s.examName === examName ? { ...s, [field]: value } : s
    )
    onChange(newData)
  }

  const removeOtherExam = (examName: string) => {
    onChange(data.filter(s => s.examName !== examName))
  }

  return (
    <div className="space-y-8">
      {/* CAT Score */}
      <div className="border-2 border-black rounded-xl p-6">
        <h3 className="font-[family-name:var(--font-syne)] font-semibold text-lg mb-4 flex items-center gap-2">
          📊 CAT Score
        </h3>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Year <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={catScore.year}
              onChange={(e) => updateCATScore('year', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
              placeholder="e.g., 2024"
              maxLength={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Overall Score
            </label>
            <input
              type="text"
              value={catScore.overallScore}
              onChange={(e) => updateCATScore('overallScore', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
              placeholder="e.g., 156"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Overall Percentile <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={catScore.overallPercentile}
              onChange={(e) => updateCATScore('overallPercentile', e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
              placeholder="e.g., 99.5"
            />
          </div>
        </div>

        {/* Sectional Scores */}
        <h4 className="font-medium mb-3">Sectional Scores</h4>
        <div className="grid md:grid-cols-3 gap-4">
          {catScore.sectionalScores?.map((section) => (
            <div key={section.section} className="bg-[#fafafa] rounded-xl p-4">
              <label className="block text-sm font-medium mb-3">{section.section}</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-xs text-[var(--muted)]">Score</span>
                  <input
                    type="text"
                    value={section.score}
                    onChange={(e) => updateCATSectional(section.section, 'score', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="Score"
                  />
                </div>
                <div>
                  <span className="text-xs text-[var(--muted)]">%ile</span>
                  <input
                    type="text"
                    value={section.percentile}
                    onChange={(e) => updateCATSectional(section.section, 'percentile', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm"
                    placeholder="%ile"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Other Exams */}
      <div className="border border-[var(--border)] rounded-xl p-6">
        <h3 className="font-medium text-lg mb-4">Other Entrance Exams (Optional)</h3>

        {/* Existing other exams */}
        {otherScores.length > 0 && (
          <div className="space-y-4 mb-4">
            {otherScores.map((exam) => (
              <div key={exam.examName} className="bg-[#fafafa] rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{exam.examName}</span>
                  <button
                    onClick={() => removeOtherExam(exam.examName)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-xs text-[var(--muted)]">Year</span>
                    <input
                      type="text"
                      value={exam.year}
                      onChange={(e) => updateOtherExam(exam.examName, 'year', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="Year"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--muted)]">Score</span>
                    <input
                      type="text"
                      value={exam.overallScore}
                      onChange={(e) => updateOtherExam(exam.examName, 'overallScore', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="Score"
                    />
                  </div>
                  <div>
                    <span className="text-xs text-[var(--muted)]">Percentile</span>
                    <input
                      type="text"
                      value={exam.overallPercentile}
                      onChange={(e) => updateOtherExam(exam.examName, 'overallPercentile', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors text-sm"
                      placeholder="%ile"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add other exam */}
        <div>
          <label className="block text-sm font-medium mb-2">Add another exam</label>
          <div className="flex flex-wrap gap-2">
            {OTHER_EXAMS.filter(e => !data.find(s => s.examName === e)).map((exam) => (
              <button
                key={exam}
                onClick={() => addOtherExam(exam)}
                className="px-4 py-2 rounded-full border border-[var(--border)] hover:border-black text-sm transition-colors"
              >
                + {exam}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Your CAT sectional scores can highlight your strengths. 
          High VARC shows communication skills, while high QA demonstrates analytical ability.
        </p>
      </div>
    </div>
  )
}
