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

    const { content, schoolName, wordLimit } = await request.json()

    if (!content || content.trim().length < 100) {
      return NextResponse.json(
        { error: 'SOP content is too short to analyze' },
        { status: 400 }
      )
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `You are an expert MBA admissions consultant who has reviewed thousands of SOPs for top B-schools like IIMs, ISB, XLRI, SP Jain, and other premier institutions.

Analyze the given SOP and provide a detailed assessment. Be constructive but honest.

RESPOND IN THIS EXACT JSON FORMAT:
{
  "overallScore": <number 1-100>,
  "summary": "<2-3 sentence summary of the SOP quality>",
  "scores": {
    "opening": { "score": <1-10>, "comment": "<brief comment>" },
    "storytelling": { "score": <1-10>, "comment": "<brief comment>" },
    "specificity": { "score": <1-10>, "comment": "<brief comment>" },
    "whyMba": { "score": <1-10>, "comment": "<brief comment>" },
    "whySchool": { "score": <1-10>, "comment": "<brief comment>" },
    "authenticity": { "score": <1-10>, "comment": "<brief comment>" },
    "structure": { "score": <1-10>, "comment": "<brief comment>" },
    "language": { "score": <1-10>, "comment": "<brief comment>" }
  },
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": [
    { "issue": "<what's wrong>", "suggestion": "<how to fix>", "priority": "high|medium|low" },
    { "issue": "<what's wrong>", "suggestion": "<how to fix>", "priority": "high|medium|low" }
  ],
  "cliches": ["<cliche phrase found>", "<another cliche>"],
  "wordCountAnalysis": "<comment on word count vs limit>",
  "admissionChance": "<low|medium|high|very high> - <1 sentence reasoning>"
}

SCORING CRITERIA:
- Opening (1-10): Does it hook the reader? Avoids "I am X from Y"?
- Storytelling (1-10): Are there compelling, specific stories with outcomes?
- Specificity (1-10): Are there concrete numbers, names, achievements?
- Why MBA (1-10): Are genuine gaps and growth areas identified?
- Why School (1-10): Is there school-specific content (programs, faculty, culture)?
- Authenticity (1-10): Does it sound like a real person, not a template?
- Structure (1-10): Clear flow from hook → journey → why MBA → why school → closing?
- Language (1-10): Professional but personal? No corporate buzzwords?

Be specific in your feedback. Point to exact issues and give actionable suggestions.`
        },
        {
          role: 'user',
          content: `Analyze this SOP for ${schoolName}. Word limit: ${wordLimit} words.

SOP Content:
${content}`
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
      response_format: { type: 'json_object' }
    })

    const analysisText = response.choices[0]?.message?.content
    if (!analysisText) {
      throw new Error('No analysis generated')
    }

    const analysis = JSON.parse(analysisText)

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Error analyzing SOP:', error)
    return NextResponse.json(
      { error: 'Failed to analyze SOP' },
      { status: 500 }
    )
  }
}
