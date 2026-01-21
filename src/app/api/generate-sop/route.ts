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

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your environment variables.' },
        { status: 500 }
      )
    }

    const { profile, targetSchool, wordLimit, tone, keyStories, additionalInstructions } = await request.json()

    // Build the prompt
    const prompt = buildSOPPrompt(profile, targetSchool, wordLimit, tone, keyStories, additionalInstructions)

    // Generate SOP using OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert MBA admissions consultant who writes SOPs that sound like the candidate wrote them personally - authentic, reflective, and specific.

CRITICAL RULES - NEVER VIOLATE THESE:
1. NEVER start with "I am [Name] from [City]" - this is lazy writing
2. NEVER use phrases like "I am eager to pursue", "I have always been passionate", "Since childhood", "I firmly believe"
3. NEVER write generic statements - every sentence must be specific to THIS candidate
4. NEVER list achievements like a resume - weave them into a narrative
5. NEVER use corporate buzzwords like "synergy", "leverage", "cutting-edge", "propel"

DATA SELECTION - BE HIGHLY SELECTIVE:
You will receive the candidate's complete profile data. DO NOT use everything. Be strategic:
- ONLY use data points that genuinely strengthen the narrative
- SKIP mediocre achievements, generic responsibilities, or filler content
- PRIORITIZE: Unique experiences, quantifiable impact, leadership moments, unconventional paths, genuine struggles/pivots
- IGNORE: Generic job descriptions, routine activities, achievements without context/impact
- If academics are average, don't emphasize them - focus on work/extracurriculars instead
- If work experience is entry-level, highlight growth trajectory or unique projects
- Cherry-pick 2-3 STRONGEST stories rather than mentioning everything superficially
- A great SOP with 3 powerful examples beats a mediocre one covering 10 things

WHAT MAKES DATA WORTH INCLUDING:
✓ Specific numbers and outcomes (revenue, users, growth %)
✓ Leadership or ownership of something
✓ Unique/unconventional experiences
✓ Genuine pivots, failures, or learnings
✓ Activities showing sustained commitment (not one-off events)
✓ Awards/recognition at state/national/international level
✗ Generic responsibilities ("managed team", "handled clients")
✗ Participation certificates or college-level awards (unless exceptional)
✗ Hobbies without depth or relevance
✗ Certifications that don't add to the narrative

WRITING STYLE:
- Start with a hook - an insight, realization, or defining moment
- Write in first person with a reflective, mature tone
- Use SHORT, PUNCHY sentences mixed with longer ones for rhythm
- Be SPECIFIC - use numbers, names, outcomes (e.g., "20,000 subscribers in 3 months" not "significant growth")
- Show self-awareness - acknowledge gaps, pivots, and learnings honestly
- ${tone === 'professional' ? 'Maintain a composed, thoughtful tone' : tone === 'conversational' ? 'Write like talking to a mentor - warm but substantive' : tone === 'confident' ? 'Be assertive about achievements without arrogance' : 'Be reflective and show genuine growth'}

STRUCTURE:
1. Opening (2-3 sentences): A compelling hook that reveals something about the candidate's mindset
2. Journey (60% of SOP): 2-3 specific stories with concrete outcomes - NOT a chronological resume
3. Why MBA (15%): Genuine gaps identified, what they need to learn
4. Why This School (15%): Specific programs, faculty, culture - NOT generic praise
5. Closing (2-3 sentences): Forward-looking, confident but not arrogant

The SOP should read like the candidate's authentic voice, not an AI-generated document.
Word limit: approximately ${wordLimit} words`
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: Math.min(wordLimit * 3, 4000), // Approximate tokens needed
    })

    const content = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ content })
  } catch (error) {
    console.error('Error generating SOP:', error)
    
    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: `OpenAI API error: ${error.message}` },
        { status: error.status || 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate SOP. Please try again.' },
      { status: 500 }
    )
  }
}

function buildSOPPrompt(
  profile: {
    personalInfo: { fullName: string; city: string; state: string }
    academics: Array<{ level: string; institution: string; stream_branch: string; percentage_cgpa: string; year_of_completion: string }>
    entranceScores: Array<{ examName: string; overallPercentile: string; year: string }>
    workExperience: Array<{ companyName: string; designation: string; industry: string; startDate: string; endDate: string; isCurrentRole: boolean; responsibilities: string; achievements: string }>
    activities: Array<{ name: string; type: string; level: string; description: string; achievements: string }>
    achievements: Array<{ title: string; year: string; description: string }>
    certifications: Array<{ name: string; issuingOrganization: string }>
    careerGoals: { whyMba: string; shortTermGoals: string; longTermGoals: string; preferredSpecialization: string[] }
    additionalInfo: { hobbies: string; socialProjects: string; otherInfo: string }
  },
  targetSchool: string,
  wordLimit: number,
  tone: string,
  keyStories: string,
  additionalInstructions: string
): string {
  const graduation = profile.academics.find(a => a.level === 'graduation')
  const catScore = profile.entranceScores.find(s => s.examName === 'CAT')
  const currentJob = profile.workExperience.find(w => w.isCurrentRole) || profile.workExperience[0]
  const totalWorkExp = profile.workExperience.length

  let prompt = `Write a Statement of Purpose (SOP) for ${profile.personalInfo.fullName} applying to ${targetSchool}.

## KEY STORIES & ACHIEVEMENTS TO HIGHLIGHT (MOST IMPORTANT - USE THESE):
${keyStories || 'No specific stories provided - use the profile data below.'}

## CANDIDATE PROFILE:

### Personal Background:
- Name: ${profile.personalInfo.fullName}
- Location: ${profile.personalInfo.city}, ${profile.personalInfo.state}

### Education:
${profile.academics.filter(a => a.institution).map(a => `- ${a.level}: ${a.stream_branch} from ${a.institution} (${a.percentage_cgpa}, ${a.year_of_completion})`).join('\n')}

### Entrance Scores:
${profile.entranceScores.filter(s => s.overallPercentile).map(s => `- ${s.examName} ${s.year}: ${s.overallPercentile} percentile`).join('\n')}

### Work Experience (${totalWorkExp} ${totalWorkExp === 1 ? 'role' : 'roles'}):
${profile.workExperience.map(w => `
**${w.designation} at ${w.companyName}** (${w.industry})
${w.startDate} - ${w.isCurrentRole ? 'Present' : w.endDate}
Responsibilities: ${w.responsibilities}
Key Achievements: ${w.achievements}
`).join('\n')}

### Extra-Curricular & Co-Curricular Activities:
${profile.activities.length > 0 ? profile.activities.map(a => `- ${a.name} (${a.level} level): ${a.description} ${a.achievements ? `Achievement: ${a.achievements}` : ''}`).join('\n') : 'None mentioned'}

### Awards & Achievements:
${profile.achievements.length > 0 ? profile.achievements.map(a => `- ${a.title} (${a.year}): ${a.description}`).join('\n') : 'None mentioned'}

### Certifications:
${profile.certifications.length > 0 ? profile.certifications.map(c => `- ${c.name} by ${c.issuingOrganization}`).join('\n') : 'None mentioned'}

### Career Goals:
- Why MBA: ${profile.careerGoals.whyMba}
- Short-term Goals (2-3 years): ${profile.careerGoals.shortTermGoals}
- Long-term Goals (5-10 years): ${profile.careerGoals.longTermGoals}
- Preferred Specialization: ${profile.careerGoals.preferredSpecialization.join(', ') || 'Not specified'}

### Additional Information:
- Hobbies: ${profile.additionalInfo.hobbies || 'Not specified'}
- Social Projects: ${profile.additionalInfo.socialProjects || 'None mentioned'}
- Other: ${profile.additionalInfo.otherInfo || 'None'}

## REQUIREMENTS:
- Target School: ${targetSchool}
- Word Limit: Approximately ${wordLimit} words
- Tone: ${tone}
${additionalInstructions ? `- Additional Instructions: ${additionalInstructions}` : ''}

## WRITING INSTRUCTIONS:
1. START with an insight or realization - NOT "I am [Name] from [City]"
2. PRIORITIZE the key stories provided above (if any) - they are the candidate's unique differentiators
3. BE SELECTIVE: Scan all the data above and ONLY use what genuinely strengthens the profile
   - Pick 2-3 strongest stories/achievements to develop deeply
   - Skip anything generic, mediocre, or that doesn't add value
   - Quality over quantity - a focused SOP beats a scattered one
4. Write in first person with a reflective, mature voice
5. Use specific numbers and outcomes (e.g., "20,000 subscribers" not "significant following")
6. Show the candidate's thought process and self-awareness
7. For "Why ${targetSchool}" - mention specific programs, faculty, clubs, or initiatives at this school
8. End with a forward-looking statement that feels genuine, not generic
9. Keep it around ${wordLimit} words

REMEMBER: 
- The SOP should sound like the candidate wrote it themselves - authentic, specific, and reflective
- NOT everything in the profile needs to be mentioned - use only what makes the candidate shine
- If some sections are weak (average academics, generic work), don't highlight them - pivot to strengths

Write the complete SOP now:`

  return prompt
}
