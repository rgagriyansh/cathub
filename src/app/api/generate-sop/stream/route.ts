import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { createClient } from '@/lib/supabase/server'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    // Check authentication
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

    const { profile, targetSchool, wordLimit, tone, keyStories, additionalInstructions, section, previousSections } = await request.json()

    const prompt = buildSectionPrompt(profile, targetSchool, wordLimit, tone, keyStories, additionalInstructions, section, previousSections)
    const systemPrompt = getSystemPrompt(tone, wordLimit, section, previousSections)

    // Create streaming response
    const stream = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: section ? 1000 : Math.min(wordLimit * 3, 4000),
      stream: true,
    })

    // Create a ReadableStream from OpenAI's stream
    const encoder = new TextEncoder()
    const readableStream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || ''
            if (content) {
              controller.enqueue(encoder.encode(content))
            }
          }
          controller.close()
        } catch (error) {
          controller.error(error)
        }
      },
    })

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    })
  } catch (error) {
    console.error('Error generating SOP:', error)
    return NextResponse.json(
      { error: 'Failed to generate SOP' },
      { status: 500 }
    )
  }
}

function getSystemPrompt(tone: string, wordLimit: number, section?: string, previousSections?: Record<string, string>): string {
  const toneDescription = tone === 'professional' ? 'composed, thoughtful tone' 
    : tone === 'conversational' ? 'warm but substantive, like talking to a mentor' 
    : tone === 'confident' ? 'assertive about achievements without arrogance' 
    : 'reflective and showing genuine growth'

  if (section) {
    const hasPrevious = previousSections && Object.keys(previousSections).length > 0
    
    return `You are an expert MBA admissions consultant. Write ONLY the "${section}" section of an SOP.

CRITICAL RULES:
- Write ONLY this section, nothing else
- NO clichés like "Since childhood", "I am eager", "I firmly believe"
- Be SPECIFIC with numbers, names, outcomes
- Use authentic, reflective voice
- Tone: ${toneDescription}
- Keep this section focused and impactful
${hasPrevious ? `
VERY IMPORTANT - AVOID REPETITION:
- Previous sections have ALREADY been written (shown below)
- DO NOT repeat any stories, achievements, or points already mentioned
- DO NOT re-introduce yourself if opening was already written
- Build on what's been said, don't repeat it
- Use DIFFERENT examples and angles
- Maintain narrative continuity - reference previous points naturally if needed
` : ''}`
  }

  return `You are an expert MBA admissions consultant who writes SOPs that sound like the candidate wrote them personally.

CRITICAL RULES:
1. NEVER start with "I am [Name] from [City]"
2. NEVER use "I am eager to pursue", "Since childhood", "I firmly believe"
3. Every sentence must be specific to THIS candidate
4. Use SHORT sentences mixed with longer ones
5. Be SPECIFIC - use numbers, names, outcomes
6. Tone: ${toneDescription}

STRUCTURE:
1. Opening: A compelling hook (2-3 sentences)
2. Journey: Specific stories with outcomes (60%)
3. Why MBA: Genuine gaps identified (15%)
4. Why This School: Specific programs/faculty (15%)
5. Closing: Forward-looking (2-3 sentences)

Word limit: ~${wordLimit} words`
}

function buildSectionPrompt(
  profile: Record<string, unknown>,
  targetSchool: string,
  wordLimit: number,
  tone: string,
  keyStories: string,
  additionalInstructions: string,
  section?: string,
  previousSections?: Record<string, string>
): string {
  const personalInfo = profile.personalInfo as { fullName?: string; city?: string; state?: string } || {}
  const academics = (profile.academics as Array<{ level: string; institution: string; stream_branch: string; percentage_cgpa: string }>) || []
  const entranceScores = (profile.entranceScores as Array<{ examName: string; overallPercentile: string; year: string }>) || []
  const workExperience = (profile.workExperience as Array<{ companyName: string; designation: string; industry: string; responsibilities: string; achievements: string; isCurrentRole: boolean }>) || []
  const activities = (profile.activities as Array<{ name: string; level: string; description: string; achievements: string }>) || []
  const achievements = (profile.achievements as Array<{ title: string; year: string; description: string }>) || []
  const careerGoals = profile.careerGoals as { whyMba?: string; shortTermGoals?: string; longTermGoals?: string; preferredSpecialization?: string[] } || {}
  const additionalInfo = profile.additionalInfo as { hobbies?: string; socialProjects?: string; otherInfo?: string } || {}

  // Build previous sections context
  const sectionNames: Record<string, string> = {
    opening: 'Opening Hook',
    journey: 'Your Journey',
    whyMba: 'Why MBA',
    whySchool: 'Why This School',
    closing: 'Closing'
  }
  
  let previousContext = ''
  if (previousSections && Object.keys(previousSections).length > 0) {
    const prevContent = Object.entries(previousSections)
      .filter(([, content]) => content && content.trim())
      .map(([key, content]) => `### ${sectionNames[key] || key}:\n${content}`)
      .join('\n\n')
    
    if (prevContent) {
      previousContext = `
## ALREADY WRITTEN SECTIONS (DO NOT REPEAT THESE POINTS):
${prevContent}

## IMPORTANT: 
- The above sections are ALREADY part of the SOP
- DO NOT repeat any stories, achievements, or examples mentioned above
- Use DIFFERENT angles and examples for this new section
- Maintain consistency in tone and narrative flow
`
    }
  }

  const profileSummary = `
## KEY STORIES (PRIORITIZE THESE):
${keyStories || 'Use profile data below'}

## PROFILE:
- Name: ${personalInfo.fullName}
- Education: ${academics.filter(a => a.institution).map(a => `${a.stream_branch} from ${a.institution} (${a.percentage_cgpa})`).join('; ')}
- CAT: ${entranceScores.find(s => s.examName === 'CAT')?.overallPercentile || 'N/A'}%ile
- Work: ${workExperience.map(w => `${w.designation} at ${w.companyName}`).join('; ') || 'Fresher'}
- Activities: ${activities.map(a => a.name).join(', ') || 'None'}
- Achievements: ${achievements.map(a => a.title).join(', ') || 'None'}
- Why MBA: ${careerGoals.whyMba}
- Short-term: ${careerGoals.shortTermGoals}
- Long-term: ${careerGoals.longTermGoals}
- Social: ${additionalInfo.socialProjects || 'None'}

Target: ${targetSchool}
${additionalInstructions ? `Instructions: ${additionalInstructions}` : ''}
${previousContext}`

  if (section === 'opening') {
    return `${profileSummary}

Write ONLY the OPENING (2-3 sentences) for an SOP to ${targetSchool}.
- Start with an insight, realization, or defining moment
- NO "I am [Name] from [City]"
- Hook the reader immediately
- Show the candidate's mindset`
  }

  if (section === 'journey') {
    return `${profileSummary}

Write ONLY the JOURNEY section (main body) for an SOP to ${targetSchool}.
- Focus on specific stories from key stories above
- Use concrete numbers and outcomes
- Show growth and self-awareness
- Connect experiences to future goals
- About 60% of a ${wordLimit}-word SOP
${previousSections?.opening ? '- Continue naturally from the opening hook above' : ''}`
  }

  if (section === 'whyMba') {
    return `${profileSummary}

Write ONLY the "Why MBA" section for an SOP to ${targetSchool}.
- Identify genuine gaps in skills/knowledge
- Explain what structured learning will add
- Be honest about what you need to grow
- About 15% of a ${wordLimit}-word SOP
${previousSections?.journey ? '- Build on the journey described above - what gaps remain?' : ''}`
  }

  if (section === 'whySchool') {
    return `${profileSummary}

Write ONLY the "Why ${targetSchool}" section.
- Mention SPECIFIC programs, courses, or specializations at ${targetSchool}
- Reference specific faculty, clubs, or initiatives if known
- Explain fit between candidate's goals and school's offerings
- About 15% of a ${wordLimit}-word SOP
${previousSections?.whyMba ? '- Connect this to the MBA goals mentioned above' : ''}`
  }

  if (section === 'closing') {
    return `${profileSummary}

Write ONLY the CLOSING (2-3 sentences) for an SOP to ${targetSchool}.
- Forward-looking and confident
- Reinforce fit with ${targetSchool}
- NOT generic - specific to this candidate
- Leave a memorable impression
- Tie back to the opening hook if possible for a satisfying conclusion
${previousSections?.opening ? `- Reference the opening theme: "${previousSections.opening.substring(0, 100)}..."` : ''}`
  }

  // Full SOP
  return `${profileSummary}

Write a complete SOP for ${targetSchool} (~${wordLimit} words).`
}
