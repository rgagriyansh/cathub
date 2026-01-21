'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

interface SavedSOP {
  id: string
  title: string
  school_name: string
  sop_type: string
  content: string
  word_count: number
  is_favorite: boolean
  created_at: string
  updated_at: string
}

export default function SavedSOPsPage() {
  const [sops, setSops] = useState<SavedSOP[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterFavorites, setFilterFavorites] = useState(false)
  const [selectedSOP, setSelectedSOP] = useState<SavedSOP | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadSOPs()
  }, [])

  const loadSOPs = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/login')
      return
    }

    const { data, error } = await supabase
      .from('generated_sops')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (data && !error) {
      setSops(data)
    }
    setLoading(false)
  }

  const toggleFavorite = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('generated_sops')
      .update({ is_favorite: !currentStatus })
      .eq('id', id)

    if (!error) {
      setSops(sops.map(sop => 
        sop.id === id ? { ...sop, is_favorite: !currentStatus } : sop
      ))
    }
  }

  const deleteSOP = async (id: string) => {
    setDeleting(true)
    const { error } = await supabase
      .from('generated_sops')
      .delete()
      .eq('id', id)

    if (!error) {
      setSops(sops.filter(sop => sop.id !== id))
      setShowDeleteConfirm(null)
      if (selectedSOP?.id === id) {
        setSelectedSOP(null)
      }
    }
    setDeleting(false)
  }

  const copyToClipboard = async (content: string) => {
    await navigator.clipboard.writeText(content)
  }

  const filteredSOPs = sops.filter(sop => {
    const matchesSearch = sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.school_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sop.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFavorite = !filterFavorites || sop.is_favorite
    return matchesSearch && matchesFavorite
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-black border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--muted)]">Loading saved SOPs...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="bg-black text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Link
            href="/dashboard/mba-writer"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white text-sm mb-4 transition-colors"
          >
            <ArrowLeftIcon />
            Back to MBA Writer
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <FolderIcon />
              </div>
              <div>
                <h1 className="font-[family-name:var(--font-syne)] text-2xl font-bold">
                  Saved SOPs
                </h1>
                <p className="text-white/60 text-sm">
                  {sops.length} saved document{sops.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/mba-writer/sop"
              className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/90 transition-colors"
            >
              <PlusIcon />
              New SOP
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {sops.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center">
            <div className="w-16 h-16 bg-[#fafafa] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <EmptyIcon />
            </div>
            <h2 className="text-xl font-semibold mb-2">No saved SOPs yet</h2>
            <p className="text-[var(--muted)] mb-6">
              Generate your first SOP and save it to see it here
            </p>
            <Link
              href="/dashboard/mba-writer/sop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors"
            >
              <SparklesIcon />
              Generate SOP
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* List Panel */}
            <div className="lg:col-span-1">
              {/* Search and Filter */}
              <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-4">
                <div className="relative mb-3">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted)]" />
                  <input
                    type="text"
                    placeholder="Search SOPs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-[var(--border)] focus:outline-none focus:border-black transition-colors"
                  />
                </div>
                <button
                  onClick={() => setFilterFavorites(!filterFavorites)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    filterFavorites ? 'bg-yellow-100 text-yellow-700' : 'bg-[#fafafa] hover:bg-gray-100'
                  }`}
                >
                  <StarIcon filled={filterFavorites} />
                  Favorites only
                </button>
              </div>

              {/* SOP List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredSOPs.map((sop) => (
                  <div
                    key={sop.id}
                    onClick={() => setSelectedSOP(sop)}
                    className={`bg-white rounded-xl border p-4 cursor-pointer transition-all ${
                      selectedSOP?.id === sop.id 
                        ? 'border-black shadow-md' 
                        : 'border-[var(--border)] hover:border-black/30'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-medium text-sm line-clamp-1">{sop.title}</h3>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleFavorite(sop.id, sop.is_favorite)
                        }}
                        className="text-yellow-500 hover:scale-110 transition-transform"
                      >
                        <StarIcon filled={sop.is_favorite} />
                      </button>
                    </div>
                    <p className="text-xs text-[var(--muted)] mb-2">
                      {sop.school_name || 'No school specified'}
                    </p>
                    <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                      <span>{sop.word_count} words</span>
                      <span>{formatDate(sop.created_at)}</span>
                    </div>
                  </div>
                ))}

                {filteredSOPs.length === 0 && (
                  <div className="text-center py-8 text-[var(--muted)]">
                    No SOPs match your search
                  </div>
                )}
              </div>
            </div>

            {/* Preview Panel */}
            <div className="lg:col-span-2">
              {selectedSOP ? (
                <div className="bg-white rounded-2xl border border-[var(--border)] overflow-hidden">
                  {/* Preview Header */}
                  <div className="border-b border-[var(--border)] p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold mb-1">{selectedSOP.title}</h2>
                        <p className="text-sm text-[var(--muted)]">
                          {selectedSOP.school_name} • {selectedSOP.word_count} words • 
                          Last updated {formatDate(selectedSOP.updated_at)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleFavorite(selectedSOP.id, selectedSOP.is_favorite)}
                        className={`p-2 rounded-lg transition-colors ${
                          selectedSOP.is_favorite ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-[#fafafa]'
                        }`}
                      >
                        <StarIcon filled={selectedSOP.is_favorite} />
                      </button>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => copyToClipboard(selectedSOP.content)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:border-black transition-colors text-sm"
                      >
                        <CopyIcon />
                        Copy
                      </button>
                      <button
                        onClick={() => {
                          const blob = new Blob([selectedSOP.content], { type: 'text/plain' })
                          const url = URL.createObjectURL(blob)
                          const a = document.createElement('a')
                          a.href = url
                          a.download = `${selectedSOP.title.replace(/\s+/g, '_')}.txt`
                          a.click()
                          URL.revokeObjectURL(url)
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[var(--border)] hover:border-black transition-colors text-sm"
                      >
                        <DownloadIcon />
                        Download
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(selectedSOP.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm ml-auto"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-6 max-h-[500px] overflow-y-auto">
                    <div 
                      className="prose max-w-none whitespace-pre-wrap leading-relaxed"
                      style={{ fontFamily: 'Georgia, serif' }}
                    >
                      {selectedSOP.content}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-[var(--border)] p-12 text-center h-full flex flex-col items-center justify-center min-h-[400px]">
                  <div className="w-16 h-16 bg-[#fafafa] rounded-2xl flex items-center justify-center mb-4">
                    <DocumentIcon />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Select an SOP</h3>
                  <p className="text-[var(--muted)] text-sm">
                    Click on any SOP from the list to preview it here
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <TrashIcon className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold">Delete SOP?</h3>
            </div>
            <p className="text-[var(--muted)] mb-6">
              Are you sure you want to delete this SOP? This action cannot be undone.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 rounded-lg border border-[var(--border)] hover:border-black transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteSOP(showDeleteConfirm)}
                disabled={deleting}
                className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Icons
function ArrowLeftIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
}

function FolderIcon() {
  return <svg className="w-6 h-6 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" /></svg>
}

function PlusIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
}

function EmptyIcon() {
  return <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}

function SparklesIcon() {
  return <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" /></svg>
}

function SearchIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" /></svg>
}

function StarIcon({ filled = false }: { filled?: boolean }) {
  if (filled) {
    return <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" /></svg>
  }
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
}

function CopyIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0013.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 01-.75.75H9a.75.75 0 01-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 01-2.25 2.25H6.75A2.25 2.25 0 014.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 011.927-.184" /></svg>
}

function DownloadIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" /></svg>
}

function TrashIcon({ className = '' }: { className?: string }) {
  return <svg className={`w-4 h-4 ${className}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>
}

function DocumentIcon() {
  return <svg className="w-8 h-8 text-[var(--muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
}
