import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    const { profile, targetRole } = await request.json()

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Write a 2-line professional summary for a CV. Be extremely concise and impactful. No "I" statements. Write in third person implied.
${targetRole ? `Tailor for: ${targetRole}` : ''}`
        },
        {
          role: 'user',
          content: `Create a professional summary for:
Name: ${profile.personalInfo?.fullName || 'Candidate'}
Education: ${profile.academics?.filter((a: { institution: string }) => a.institution).map((a: { stream_branch: string; institution: string }) => `${a.stream_branch} from ${a.institution}`).join(', ') || 'Not specified'}
Experience: ${profile.workExperience?.filter((w: { companyName: string }) => w.companyName).map((w: { designation: string; companyName: string }) => `${w.designation} at ${w.companyName}`).join(', ') || 'Fresh graduate'}
Key achievements: ${profile.achievements?.filter((a: { title: string }) => a.title).map((a: { title: string }) => a.title).join(', ') || 'None specified'}
Activities: ${profile.activities?.filter((a: { name: string }) => a.name).map((a: { name: string }) => a.name).join(', ') || 'None specified'}
Goals: ${profile.careerGoals?.shortTermGoals || 'Not specified'}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    })

    const summary = response.choices[0]?.message?.content || ''

    return NextResponse.json({ summary })
  } catch (error) {
    console.error('Error generating summary:', error)
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    )
  }
}
