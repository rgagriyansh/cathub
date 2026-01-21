'use client'

import { Activity } from '@/types/profile'

interface Props {
  data: Activity[]
  onChange: (data: Activity[]) => void
}

const ACTIVITY_TYPES = [
  { value: 'extra_curricular', label: 'Extra-Curricular', icon: '🎭', description: 'Sports, Arts, Music, Dance, etc.' },
  { value: 'co_curricular', label: 'Co-Curricular', icon: '🎓', description: 'Clubs, Committees, Student Bodies, etc.' },
]

const LEVELS = [
  { value: 'school', label: 'School Level' },
  { value: 'college', label: 'College Level' },
  { value: 'state', label: 'State Level' },
  { value: 'national', label: 'National Level' },
  { value: 'international', label: 'International Level' },
]

export default function ActivitiesForm({ data, onChange }: Props) {
  const addActivity = (type: 'extra_curricular' | 'co_curricular') => {
    onChange([
      ...data,
      {
        id: Date.now().toString(),
        name: '',
        type,
        level: 'college',
        duration: '',
        description: '',
        achievements: '',
      },
    ])
  }

  const updateActivity = (id: string, field: keyof Activity, value: string) => {
    onChange(
      data.map((activity) =>
        activity.id === id ? { ...activity, [field]: value } : activity
      )
    )
  }

  const removeActivity = (id: string) => {
    onChange(data.filter((activity) => activity.id !== id))
  }

  const extraCurricular = data.filter(a => a.type === 'extra_curricular')
  const coCurricular = data.filter(a => a.type === 'co_curricular')

  return (
    <div className="space-y-8">
      {/* Extra-Curricular Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎭</span>
          <div>
            <h3 className="font-medium text-lg">Extra-Curricular Activities</h3>
            <p className="text-sm text-[var(--muted)]">Sports, Arts, Music, Dance, Theater, etc.</p>
          </div>
        </div>

        {extraCurricular.length === 0 ? (
          <button
            onClick={() => addActivity('extra_curricular')}
            className="w-full py-6 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Extra-Curricular Activity
          </button>
        ) : (
          <div className="space-y-4">
            {extraCurricular.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onUpdate={updateActivity}
                onRemove={removeActivity}
              />
            ))}
            <button
              onClick={() => addActivity('extra_curricular')}
              className="w-full py-3 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors text-sm"
            >
              + Add Another Extra-Curricular Activity
            </button>
          </div>
        )}
      </div>

      {/* Co-Curricular Activities */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">🎓</span>
          <div>
            <h3 className="font-medium text-lg">Co-Curricular Activities</h3>
            <p className="text-sm text-[var(--muted)]">Clubs, Committees, Student Bodies, Events Organized, etc.</p>
          </div>
        </div>

        {coCurricular.length === 0 ? (
          <button
            onClick={() => addActivity('co_curricular')}
            className="w-full py-6 border-2 border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors flex flex-col items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Co-Curricular Activity
          </button>
        ) : (
          <div className="space-y-4">
            {coCurricular.map((activity, index) => (
              <ActivityCard
                key={activity.id}
                activity={activity}
                index={index}
                onUpdate={updateActivity}
                onRemove={removeActivity}
              />
            ))}
            <button
              onClick={() => addActivity('co_curricular')}
              className="w-full py-3 border border-dashed border-[var(--border)] rounded-xl text-[var(--muted)] hover:border-black hover:text-black transition-colors text-sm"
            >
              + Add Another Co-Curricular Activity
            </button>
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-sm text-blue-700">
          💡 <strong>Tip:</strong> Leadership positions and activities that show teamwork, initiative, 
          or social impact are highly valued by MBA programs.
        </p>
      </div>
    </div>
  )
}

function ActivityCard({
  activity,
  index,
  onUpdate,
  onRemove,
}: {
  activity: Activity
  index: number
  onUpdate: (id: string, field: keyof Activity, value: string) => void
  onRemove: (id: string) => void
}) {
  const LEVELS = [
    { value: 'school', label: 'School Level' },
    { value: 'college', label: 'College Level' },
    { value: 'state', label: 'State Level' },
    { value: 'national', label: 'National Level' },
    { value: 'international', label: 'International Level' },
  ]

  return (
    <div className="border border-[var(--border)] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-[var(--muted)]">
          Activity {index + 1}
        </span>
        <button
          onClick={() => onRemove(activity.id)}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Remove
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Activity Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={activity.name}
            onChange={(e) => onUpdate(activity.id, 'name', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
            placeholder="e.g., Cricket Team Captain, Debate Club"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Level</label>
          <select
            value={activity.level}
            onChange={(e) => onUpdate(activity.id, 'level', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors bg-white"
          >
            {LEVELS.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Duration</label>
          <input
            type="text"
            value={activity.duration}
            onChange={(e) => onUpdate(activity.id, 'duration', e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
            placeholder="e.g., 2018-2020, 3 years"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            value={activity.description}
            onChange={(e) => onUpdate(activity.id, 'description', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
            placeholder="Describe your role and involvement..."
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Achievements</label>
          <textarea
            value={activity.achievements}
            onChange={(e) => onUpdate(activity.id, 'achievements', e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
            placeholder="Any awards, recognitions, or notable achievements..."
          />
        </div>
      </div>
    </div>
  )
}
