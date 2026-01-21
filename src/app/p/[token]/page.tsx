import { createClient } from '@supabase/supabase-js'
import { notFound } from 'next/navigation'
import Link from 'next/link'

interface ShareData {
  id: string
  share_token: string
  visible_sections: string[]
  is_active: boolean
  show_contact_info: boolean
  custom_headline: string
  view_count: number
  profile_id: string
}

interface ProfileData {
  personal_info: {
    fullName?: string
    email?: string
    phone?: string
    city?: string
    state?: string
    gender?: string
  }
  academics: Array<{
    level: string
    institution: string
    board_university: string
    stream_branch: string
    percentage_cgpa: string
    year_of_completion: string
  }>
  entrance_scores: Array<{
    examName: string
    overallScore: string
    overallPercentile: string
    year: string
  }>
  work_experience: Array<{
    companyName: string
    designation: string
    industry: string
    startDate: string
    endDate: string
    isCurrentRole: boolean
    responsibilities: string
    achievements: string
  }>
  activities: Array<{
    name: string
    type: string
    level: string
    description: string
    achievements: string
  }>
  achievements: Array<{
    title: string
    year: string
    issuingOrganization: string
    description: string
    type: string
  }>
  certifications: Array<{
    name: string
    issuingOrganization: string
    year: string
  }>
  career_goals: {
    shortTermGoals?: string
    longTermGoals?: string
    whyMba?: string
    targetSchools?: string[]
    preferredSpecialization?: string[]
  }
}

async function getShareData(token: string): Promise<{ share: ShareData; profile: ProfileData } | null> {
  // Create client inside the function to ensure env vars are available
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase credentials not configured')
    return null
  }

  const supabase = createClient(supabaseUrl, supabaseKey)

  try {
    // Get share settings
    const { data: shareData, error: shareError } = await supabase
      .from('profile_shares')
      .select('*')
      .eq('share_token', token)
      .eq('is_active', true)
      .single()

    if (shareError) {
      console.error('Share error:', shareError)
      return null
    }
    
    if (!shareData) {
      return null
    }

    // Get profile data
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', shareData.profile_id)
      .single()

    if (profileError || !profileData) {
      console.error('Profile error:', profileError)
      return null
    }

    // Increment view count (don't wait for it)
    supabase
      .from('profile_shares')
      .update({ 
        view_count: (shareData.view_count || 0) + 1,
        last_viewed_at: new Date().toISOString()
      })
      .eq('id', shareData.id)
      .then(() => {})

    return {
      share: shareData as ShareData,
      profile: profileData as ProfileData
    }
  } catch (error) {
    console.error('Error fetching share data:', error)
    return null
  }
}

export default async function PublicProfilePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const data = await getShareData(token)

  if (!data) {
    notFound()
  }

  const { share, profile } = data
  const visibleSections = share.visible_sections || []

  const name = profile.personal_info?.fullName || 'Anonymous'
  const initials = name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-black text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-white text-black rounded-full flex items-center justify-center text-3xl font-bold">
              {initials}
            </div>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{name}</h1>
              {share.custom_headline && (
                <p className="text-white/80 text-lg mb-3">{share.custom_headline}</p>
              )}
              <div className="flex flex-wrap gap-3 text-sm text-white/60">
                {visibleSections.includes('personalInfo') && profile.personal_info?.city && (
                  <span className="flex items-center gap-1">
                    <LocationIcon />
                    {profile.personal_info.city}{profile.personal_info.state ? `, ${profile.personal_info.state}` : ''}
                  </span>
                )}
                {share.show_contact_info && profile.personal_info?.email && (
                  <span className="flex items-center gap-1">
                    <EmailIcon />
                    {profile.personal_info.email}
                  </span>
                )}
                {share.show_contact_info && profile.personal_info?.phone && (
                  <span className="flex items-center gap-1">
                    <PhoneIcon />
                    {profile.personal_info.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Education */}
          {visibleSections.includes('academics') && profile.academics?.some((a: { institution: string }) => a.institution) && (
            <ProfileSection title="Education" icon={<GraduationIcon />}>
              <div className="space-y-4">
                {profile.academics.filter((a: { institution: string }) => a.institution).map((edu: { level: string; stream_branch: string; institution: string; board_university: string; percentage_cgpa: string; year_of_completion: string }, i: number) => (
                  <div key={i} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">
                        {edu.level === '10th' ? 'Class X' : 
                         edu.level === '12th' ? 'Class XII' : 
                         edu.level === 'graduation' ? 'Graduation' : 
                         edu.level === 'post_graduation' ? 'Post Graduation' : edu.level}
                        {edu.stream_branch && ` - ${edu.stream_branch}`}
                      </h4>
                      <p className="text-gray-500 text-sm">{edu.institution}</p>
                      {edu.board_university && <p className="text-gray-500 text-xs">{edu.board_university}</p>}
                    </div>
                    <div className="text-right">
                      {edu.percentage_cgpa && <p className="font-semibold">{edu.percentage_cgpa}</p>}
                      {edu.year_of_completion && <p className="text-sm text-gray-500">{edu.year_of_completion}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Test Scores */}
          {visibleSections.includes('entranceScores') && profile.entrance_scores?.some((s: { overallPercentile: string }) => s.overallPercentile) && (
            <ProfileSection title="Test Scores" icon={<ChartIcon />}>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {profile.entrance_scores.filter((s: { overallPercentile: string }) => s.overallPercentile).map((score: { examName: string; overallPercentile: string; overallScore: string; year: string }, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-2xl font-bold">{score.overallPercentile}%ile</p>
                    <p className="font-medium">{score.examName}</p>
                    {score.year && <p className="text-xs text-gray-500">{score.year}</p>}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Work Experience */}
          {visibleSections.includes('workExperience') && profile.work_experience?.some((w: { companyName: string }) => w.companyName) && (
            <ProfileSection title="Work Experience" icon={<BriefcaseIcon />}>
              <div className="space-y-6">
                {profile.work_experience.filter((w: { companyName: string }) => w.companyName).map((exp: { designation: string; companyName: string; industry: string; startDate: string; endDate: string; isCurrentRole: boolean; responsibilities: string; achievements: string }, i: number) => (
                  <div key={i}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{exp.designation}</h4>
                        <p className="text-gray-500">{exp.companyName}</p>
                        {exp.industry && <p className="text-xs text-gray-500">{exp.industry}</p>}
                      </div>
                      <p className="text-sm text-gray-500">
                        {formatDate(exp.startDate)} - {exp.isCurrentRole ? 'Present' : formatDate(exp.endDate)}
                      </p>
                    </div>
                    {exp.responsibilities && (
                      <p className="text-sm text-gray-600 whitespace-pre-line">{exp.responsibilities}</p>
                    )}
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Activities */}
          {visibleSections.includes('activities') && profile.activities?.some((a: { name: string }) => a.name) && (
            <ProfileSection title="Activities" icon={<StarIcon />}>
              <div className="space-y-3">
                {profile.activities.filter((a: { name: string }) => a.name).map((act: { name: string; level: string; type: string; description: string }, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-black rounded-full mt-2 flex-shrink-0" />
                    <div>
                      <h4 className="font-medium">
                        {act.name}
                        {act.level && <span className="text-gray-500 font-normal"> ({act.level})</span>}
                      </h4>
                      {act.description && <p className="text-sm text-gray-500">{act.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Achievements */}
          {visibleSections.includes('achievements') && profile.achievements?.some((a: { title: string }) => a.title) && (
            <ProfileSection title="Achievements" icon={<TrophyIcon />}>
              <div className="space-y-3">
                {profile.achievements.filter((a: { title: string }) => a.title).map((ach: { title: string; year: string; issuingOrganization: string; description: string }, i: number) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      🏆
                    </div>
                    <div>
                      <h4 className="font-medium">{ach.title}</h4>
                      <p className="text-sm text-gray-500">
                        {ach.issuingOrganization}{ach.year ? ` • ${ach.year}` : ''}
                      </p>
                      {ach.description && <p className="text-sm text-gray-600 mt-1">{ach.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Certifications */}
          {visibleSections.includes('certifications') && profile.certifications?.some((c: { name: string }) => c.name) && (
            <ProfileSection title="Certifications" icon={<CertificateIcon />}>
              <div className="grid sm:grid-cols-2 gap-3">
                {profile.certifications.filter((c: { name: string }) => c.name).map((cert: { name: string; issuingOrganization: string; year: string }, i: number) => (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <h4 className="font-medium">{cert.name}</h4>
                    <p className="text-sm text-gray-500">
                      {cert.issuingOrganization}{cert.year ? ` • ${cert.year}` : ''}
                    </p>
                  </div>
                ))}
              </div>
            </ProfileSection>
          )}

          {/* Career Goals */}
          {visibleSections.includes('careerGoals') && (profile.career_goals?.shortTermGoals || profile.career_goals?.longTermGoals) && (
            <ProfileSection title="Career Goals" icon={<TargetIcon />}>
              <div className="space-y-4">
                {profile.career_goals.shortTermGoals && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Short-term Goals</h4>
                    <p className="text-gray-700">{profile.career_goals.shortTermGoals}</p>
                  </div>
                )}
                {profile.career_goals.longTermGoals && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-1">Long-term Goals</h4>
                    <p className="text-gray-700">{profile.career_goals.longTermGoals}</p>
                  </div>
                )}
                {profile.career_goals.targetSchools && profile.career_goals.targetSchools.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-500 mb-2">Target Schools</h4>
                    <div className="flex flex-wrap gap-2">
                      {profile.career_goals.targetSchools.map((school: string, i: number) => (
                        <span key={i} className="px-3 py-1 bg-black text-white text-sm rounded-full">
                          {school}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </ProfileSection>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500 mb-2">
            Profile shared via CatHub
          </p>
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-sm text-black hover:underline"
          >
            Create your own profile →
          </Link>
        </footer>
      </main>
    </div>
  )
}

function ProfileSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="bg-white rounded-2xl border border-gray-200 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {children}
    </section>
  )
}

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// Icons
function LocationIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" /></svg>
}

function EmailIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
}

function PhoneIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" /></svg>
}

function GraduationIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" /></svg>
}

function ChartIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /></svg>
}

function BriefcaseIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" /></svg>
}

function StarIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" /></svg>
}

function TrophyIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m-.002 0a6.772 6.772 0 003.044 0m-3.042 0c1.045.188 2.06.188 3.042 0m3.958-6.85c.982.143 1.954.317 2.916.52A6.003 6.003 0 0116.27 9.728m2.48-5.492V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492V2.72" /></svg>
}

function CertificateIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" /></svg>
}

function TargetIcon() {
  return <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
}
