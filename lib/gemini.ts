import { GoogleGenerativeAI } from '@google/generative-ai'

if (!process.env.GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set')
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function generateEmail(prospectData: {
  name: string
  company: string
  role: string
  industry?: string | null
  painPoints?: string | null
}) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

  const prompt = `Generate a professional but friendly cold outreach email for:
- Name: ${prospectData.name}
- Company: ${prospectData.company}
- Role: ${prospectData.role}
${prospectData.industry ? `- Industry: ${prospectData.industry}` : ''}
${prospectData.painPoints ? `- Pain Points: ${prospectData.painPoints}` : ''}

Write a personalized email that:
1. Has a compelling subject line
2. Opens with a personalized hook
3. Briefly explains how we can help with their specific challenges
4. Ends with a soft call-to-action
5. Keeps a professional but conversational tone
6. Is concise (150-250 words)

Return the response in this JSON format:
{
  "subject": "email subject line",
  "body": "email body text"
}`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()

  // Try to parse JSON from the response
  try {
    // Remove markdown code blocks if present
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        subject: parsed.subject,
        body: parsed.body,
      }
    }
  } catch (e) {
    console.error('Failed to parse Gemini response as JSON:', e)
  }

  // Fallback: try to extract subject and body manually
  const subjectMatch = text.match(/[Ss]ubject:?\s*(.+?)(?:\n|$)/)
  const subject = subjectMatch ? subjectMatch[1].trim() : 'Personalized Outreach'

  // Remove subject line from body if present
  let body = text.replace(/[Ss]ubject:?\s*.+?(?:\n|$)/, '').trim()
  
  // Clean up any JSON artifacts
  body = body.replace(/\{[\s\S]*"subject"[\s\S]*?\}/, '').trim()
  body = body.replace(/```json[\s\S]*?```/, '').trim()
  body = body.replace(/```[\s\S]*?```/, '').trim()

  return { subject, body }
}
