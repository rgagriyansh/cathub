import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import DashboardNav from '@/components/DashboardNav'
import FeedbackButton from '@/components/FeedbackButton'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <DashboardNav user={user} />
      <main className="pt-20">
        {children}
      </main>
      <FeedbackButton />
    </div>
  )
}
