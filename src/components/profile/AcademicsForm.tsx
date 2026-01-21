'use client'

import { AcademicRecord } from '@/types/profile'

interface Props {
  data: AcademicRecord[]
  onChange: (data: AcademicRecord[]) => void
}

const LEVELS = [
  { id: '10th', label: 'Class 10th', icon: '🏫' },
  { id: '12th', label: 'Class 12th', icon: '📚' },
  { id: 'graduation', label: 'Graduation', icon: '🎓' },
  { id: 'post_graduation', label: 'Post Graduation (if any)', icon: '📖' },
]

const STREAMS_12TH = ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities']
const BOARDS = ['CBSE', 'ICSE', 'State Board', 'IB', 'Other']

export default function AcademicsForm({ data, onChange }: Props) {
  const updateRecord = (level: string, field: keyof AcademicRecord, value: string) => {
    const newData = data.map((record) =>
      record.level === level ? { ...record, [field]: value } : record
    )
    
    // If post_graduation doesn't exist and we're updating it, add it
    if (level === 'post_graduation' && !data.find(r => r.level === 'post_graduation')) {
      newData.push({
        level: 'post_graduation',
        institution: '',
        board_university: '',
        stream_branch: '',
        percentage_cgpa: '',
        year_of_completion: '',
        [field]: value,
      })
    }
    
    onChange(newData)
  }

  const getRecord = (level: string): AcademicRecord => {
    return data.find((r) => r.level === level) || {
      level: level as AcademicRecord['level'],
      institution: '',
      board_university: '',
      stream_branch: '',
      percentage_cgpa: '',
      year_of_completion: '',
    }
  }

  return (
    <div className="space-y-8">
      {LEVELS.map((level) => {
        const record = getRecord(level.id)
        const isOptional = level.id === 'post_graduation'

        return (
          <div key={level.id} className="border border-[var(--border)] rounded-xl p-6">
            <h3 className="font-medium text-lg mb-4 flex items-center gap-2">
              <span>{level.icon}</span>
              {level.label}
              {isOptional && <span className="text-sm text-[var(--muted)] font-normal">(Optional)</span>}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Institution */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {level.id === '10th' || level.id === '12th' ? 'School Name' : 'College/University'}
                  {!isOptional && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={record.institution}
                  onChange={(e) => updateRecord(level.id, 'institution', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  placeholder={level.id === '10th' || level.id === '12th' ? 'Enter school name' : 'Enter college name'}
                />
              </div>

              {/* Board/University */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {level.id === '10th' || level.id === '12th' ? 'Board' : 'University'}
                </label>
                {level.id === '10th' || level.id === '12th' ? (
                  <select
                    value={record.board_university}
                    onChange={(e) => updateRecord(level.id, 'board_university', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Select board</option>
                    {BOARDS.map((board) => (
                      <option key={board} value={board}>{board}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={record.board_university}
                    onChange={(e) => updateRecord(level.id, 'board_university', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                    placeholder="Enter university name"
                  />
                )}
              </div>

              {/* Stream/Branch */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  {level.id === '12th' ? 'Stream' : level.id === 'graduation' || level.id === 'post_graduation' ? 'Degree & Branch' : 'Stream (if applicable)'}
                </label>
                {level.id === '12th' ? (
                  <select
                    value={record.stream_branch}
                    onChange={(e) => updateRecord(level.id, 'stream_branch', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
                  >
                    <option value="">Select stream</option>
                    {STREAMS_12TH.map((stream) => (
                      <option key={stream} value={stream}>{stream}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={record.stream_branch}
                    onChange={(e) => updateRecord(level.id, 'stream_branch', e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                    placeholder={level.id === 'graduation' ? 'e.g., B.Tech Computer Science' : 'e.g., M.Tech, MBA'}
                  />
                )}
              </div>

              {/* Percentage/CGPA */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Percentage / CGPA
                  {!isOptional && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  value={record.percentage_cgpa}
                  onChange={(e) => updateRecord(level.id, 'percentage_cgpa', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., 85% or 8.5 CGPA"
                />
              </div>

              {/* Year of Completion */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Year of Completion
                </label>
                <input
                  type="text"
                  value={record.year_of_completion}
                  onChange={(e) => updateRecord(level.id, 'year_of_completion', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  placeholder="e.g., 2020"
                  maxLength={4}
                />
              </div>
            </div>
          </div>
        )
      })}

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Consistent academic performance is valued. If you had any dips, 
          don't worry - you can explain them in your SOP as part of your growth story.
        </p>
      </div>
    </div>
  )
}
