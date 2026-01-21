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

    const { profile, sections, targetRole, additionalInfo } = await request.json()

    const cvHtml = await generateCV(profile, sections, targetRole, additionalInfo)

    return NextResponse.json({ cv: cvHtml })
  } catch (error) {
    console.error('Error generating CV:', error)
    return NextResponse.json(
      { error: 'Failed to generate CV' },
      { status: 500 }
    )
  }
}

async function generateCV(
  profile: {
    personalInfo: { fullName?: string; email?: string; phone?: string; city?: string; state?: string; linkedIn?: string }
    academics: Array<{ level: string; institution: string; stream_branch: string; percentage_cgpa: string; year_of_completion: string }>
    entranceScores: Array<{ examName: string; overallPercentile: string; year: string }>
    workExperience: Array<{ companyName: string; designation: string; industry: string; startDate: string; endDate: string; isCurrentRole: boolean; responsibilities: string; achievements: string }>
    activities: Array<{ name: string; type: string; level: string; description: string; achievements: string }>
    achievements: Array<{ title: string; year: string; description: string }>
    certifications: Array<{ name: string; issuingOrganization: string; year: string }>
    careerGoals: { whyMba?: string; shortTermGoals?: string; longTermGoals?: string; preferredSpecialization?: string[] }
    additionalInfo: { hobbies?: string; skills?: string; languages?: string }
  },
  sections: string[],
  targetRole: string,
  additionalInfo: string
): Promise<string> {
  
  // Generate professional summary using AI if needed
  let summary = ''
  if (sections.includes('summary')) {
    const summaryResponse = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content: `Write a 2-line professional summary for a CV. Be extremely concise. No "I" statements.
${targetRole ? `Target role: ${targetRole}` : ''}`
        },
        {
          role: 'user',
          content: `Create a 2-line summary for:
Name: ${profile.personalInfo.fullName}
Education: ${profile.academics.filter(a => a.institution).map(a => `${a.stream_branch} from ${a.institution}`).join(', ')}
Experience: ${profile.workExperience.filter(w => w.companyName).map(w => `${w.designation} at ${w.companyName}`).join(', ') || 'Fresh graduate'}
${additionalInfo ? `Context: ${additionalInfo}` : ''}`
        }
      ],
      temperature: 0.7,
      max_tokens: 100,
    })
    summary = summaryResponse.choices[0]?.message?.content || ''
  }

  // Calculate content density to fit on one page
  const experienceCount = profile.workExperience.filter(w => w.companyName).length
  const activityCount = profile.activities.filter(a => a.name).length
  const achievementCount = profile.achievements.filter(a => a.title).length
  
  // Adjust font sizes based on content amount
  const contentDensity = experienceCount + activityCount + achievementCount
  const baseFontSize = contentDensity > 8 ? 10 : contentDensity > 5 ? 11 : 12
  const sectionTitleSize = baseFontSize + 1
  
  // Contact info
  const contactParts = []
  if (profile.personalInfo.phone) contactParts.push(profile.personalInfo.phone)
  if (profile.personalInfo.email) contactParts.push(profile.personalInfo.email)
  if (profile.personalInfo.linkedIn) {
    const linkedInHandle = profile.personalInfo.linkedIn.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '').replace(/\/$/, '')
    contactParts.push(`linkedin.com/in/${linkedInHandle}`)
  }
  if (profile.personalInfo.city) {
    contactParts.push(`${profile.personalInfo.city}${profile.personalInfo.state ? ', ' + profile.personalInfo.state : ''}`)
  }

  // Build CV HTML - Clean single page format
  let cvHtml = `
    <div style="font-family: 'Times New Roman', Times, serif; max-width: 800px; margin: 0 auto; padding: 30px 40px; color: #000; line-height: 1.4;">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 15px;">
        <h1 style="font-size: 18px; font-weight: bold; margin: 0 0 6px 0; text-transform: uppercase; letter-spacing: 1px;">
          ${profile.personalInfo.fullName || 'Your Name'}
        </h1>
        <div style="font-size: 11px; color: #333;">
          ${contactParts.join(' | ')}
        </div>
      </div>
  `

  // Professional Summary
  if (sections.includes('summary') && summary) {
    cvHtml += `
      <div style="margin-bottom: 12px;">
        <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Summary</div>
        <div style="font-size: ${baseFontSize}px; text-align: justify;">${summary}</div>
      </div>
    `
  }

  // Education - Single line format
  if (sections.includes('education')) {
    const education = profile.academics.filter(a => a.institution)
    if (education.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Education</div>
          ${education.map(edu => {
            const levelLabel = edu.level === 'class_10' ? 'Class X' : 
                              edu.level === 'class_12' ? 'Class XII' : 
                              edu.level === 'graduation' ? 'B.Tech' : 
                              edu.level === 'post_graduation' ? 'M.Tech' : edu.stream_branch
            return `
              <div style="font-size: ${baseFontSize}px; margin-bottom: 2px; display: flex; justify-content: space-between;">
                <span><strong>${levelLabel}${edu.stream_branch && edu.level === 'graduation' ? ' - ' + edu.stream_branch : ''}</strong>, ${edu.institution}</span>
                <span>${edu.percentage_cgpa || ''}${edu.year_of_completion ? ' | ' + edu.year_of_completion : ''}</span>
              </div>
            `
          }).join('')}
        </div>
      `
    }
  }

  // Test Scores (CAT, GMAT, etc.) - inline
  if (sections.includes('scores')) {
    const scores = profile.entranceScores.filter(s => s.overallPercentile)
    if (scores.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Test Scores</div>
          <div style="font-size: ${baseFontSize}px;">
            ${scores.map(s => `<strong>${s.examName}:</strong> ${s.overallPercentile} percentile${s.year ? ' (' + s.year + ')' : ''}`).join(' | ')}
          </div>
        </div>
      `
    }
  }

  // Work Experience
  if (sections.includes('experience')) {
    const experience = profile.workExperience.filter(w => w.companyName)
    if (experience.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Experience</div>
          ${experience.map(exp => {
            const dateRange = formatDateRange(exp.startDate, exp.endDate, exp.isCurrentRole)
            const responsibilities = exp.responsibilities ? exp.responsibilities.split('\n').filter(r => r.trim()).slice(0, 3) : []
            
            return `
              <div style="margin-bottom: 8px;">
                <div style="font-size: ${baseFontSize}px; display: flex; justify-content: space-between;">
                  <span><strong>${exp.designation}</strong>, ${exp.companyName}</span>
                  <span>${dateRange}</span>
                </div>
                ${responsibilities.length > 0 ? `
                  <ul style="margin: 2px 0 0 18px; padding: 0; font-size: ${baseFontSize - 1}px;">
                    ${responsibilities.map(r => `<li style="margin-bottom: 1px;">${r.trim()}</li>`).join('')}
                  </ul>
                ` : ''}
              </div>
            `
          }).join('')}
        </div>
      `
    }
  }

  // Leadership & Activities
  if (sections.includes('activities')) {
    const activities = profile.activities.filter(a => a.name)
    if (activities.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Leadership & Activities</div>
          ${activities.map(act => `
            <div style="font-size: ${baseFontSize}px; margin-bottom: 4px;">
              <strong>${act.name}</strong>${act.level ? ' (' + act.level + ')' : ''}${act.description ? ' - ' + act.description : ''}
            </div>
          `).join('')}
        </div>
      `
    }
  }

  // Achievements
  if (sections.includes('achievements')) {
    const achievements = profile.achievements.filter(a => a.title)
    if (achievements.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Achievements</div>
          <ul style="margin: 0 0 0 18px; padding: 0; font-size: ${baseFontSize}px;">
            ${achievements.map(a => `
              <li style="margin-bottom: 2px;">${a.title}${a.year ? ' (' + a.year + ')' : ''}${a.description ? ' - ' + a.description : ''}</li>
            `).join('')}
          </ul>
        </div>
      `
    }
  }

  // Certifications
  if (sections.includes('certifications')) {
    const certs = profile.certifications.filter(c => c.name)
    if (certs.length > 0) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Certifications</div>
          <div style="font-size: ${baseFontSize}px;">
            ${certs.map(c => `${c.name}${c.issuingOrganization ? ' - ' + c.issuingOrganization : ''}`).join(' | ')}
          </div>
        </div>
      `
    }
  }

  // Skills
  if (sections.includes('skills')) {
    const skills = profile.additionalInfo?.skills || profile.careerGoals?.preferredSpecialization?.join(', ') || ''
    const hobbies = profile.additionalInfo?.hobbies || ''
    
    if (skills || hobbies) {
      cvHtml += `
        <div style="margin-bottom: 12px;">
          <div style="font-size: ${sectionTitleSize}px; font-weight: bold; text-transform: uppercase; margin-bottom: 4px;">Skills & Interests</div>
          <div style="font-size: ${baseFontSize}px;">
            ${skills ? `<strong>Skills:</strong> ${skills}` : ''}
            ${skills && hobbies ? '<br>' : ''}
            ${hobbies ? `<strong>Interests:</strong> ${hobbies}` : ''}
          </div>
        </div>
      `
    }
  }

  cvHtml += `</div>`

  return cvHtml
}

function formatDateRange(start: string, end: string, isCurrent: boolean): string {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
  }

  const startFormatted = formatDate(start)
  const endFormatted = isCurrent ? 'Present' : formatDate(end)

  if (startFormatted && endFormatted) {
    return `${startFormatted} - ${endFormatted}`
  }
  return startFormatted || endFormatted || ''
}
