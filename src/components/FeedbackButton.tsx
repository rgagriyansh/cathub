'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type FeedbackType = 'bug' | 'feature' | 'general'

export default function FeedbackButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [type, setType] = useState<FeedbackType>('general')
  const [message, setMessage] = useState('')
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return

    setSubmitting(true)
    
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      await supabase.from('feedback').insert({
        user_id: user?.id || null,
        type,
        message: message.trim(),
        email: email.trim() || user?.email || null,
        page_url: window.location.href,
        user_agent: navigator.userAgent,
      })
      
      setSubmitted(true)
      setTimeout(() => {
        setIsOpen(false)
        setSubmitted(false)
        setMessage('')
        setType('general')
      }, 2000)
    } catch (error) {
      console.error('Error submitting feedback:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-black text-white rounded-full shadow-lg hover:bg-black/90 transition-all hover:scale-105 flex items-center justify-center z-50"
        aria-label="Send feedback"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4">
          <div 
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in slide-in-from-bottom-4 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
              <h2 className="font-[family-name:var(--font-syne)] text-xl font-semibold">
                Send Feedback
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {submitted ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="font-semibold text-lg mb-2">Thank you!</h3>
                <p className="text-[var(--muted)]">Your feedback has been submitted.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {/* Feedback Type */}
                <div>
                  <label className="block text-sm font-medium mb-2">Type</label>
                  <div className="flex gap-2">
                    {[
                      { id: 'bug', label: 'Bug', icon: '🐛' },
                      { id: 'feature', label: 'Feature', icon: '✨' },
                      { id: 'general', label: 'General', icon: '💬' },
                    ].map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setType(option.id as FeedbackType)}
                        className={`flex-1 py-2.5 px-3 rounded-xl border text-sm font-medium transition-all ${
                          type === option.id
                            ? 'border-black bg-black text-white'
                            : 'border-[var(--border)] hover:border-black'
                        }`}
                      >
                        <span className="mr-1">{option.icon}</span> {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    {type === 'bug' ? 'Describe the bug' : type === 'feature' ? 'Describe the feature' : 'Your message'}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors resize-none"
                    placeholder={
                      type === 'bug' 
                        ? "What happened? What did you expect to happen?" 
                        : type === 'feature'
                        ? "What feature would you like to see?"
                        : "Share your thoughts..."
                    }
                    required
                  />
                </div>

                {/* Email (optional) */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Email <span className="text-[var(--muted)] font-normal">(optional)</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                    placeholder="your@email.com"
                  />
                  <p className="text-xs text-[var(--muted)] mt-1">
                    We'll only use this to follow up on your feedback
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting || !message.trim()}
                  className="w-full py-3 bg-black text-white rounded-xl font-medium hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Feedback
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  )
}
