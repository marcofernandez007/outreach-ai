import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateEmail } from '@/lib/gemini'

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { prospectId } = body

    if (!prospectId) {
      return NextResponse.json(
        { error: 'Prospect ID is required' },
        { status: 400 }
      )
    }

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: prospectId,
        userId: session.user.id,
      },
    })

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    // Generate email using Gemini
    const emailData = await generateEmail({
      name: prospect.name,
      company: prospect.company,
      role: prospect.role,
      industry: prospect.industry,
      painPoints: prospect.painPoints,
    })

    // Save to database
    const generatedEmail = await prisma.generatedEmail.create({
      data: {
        subject: emailData.subject,
        body: emailData.body,
        prospectId: prospect.id,
      },
    })

    return NextResponse.json(generatedEmail)
  } catch (error) {
    console.error('Error generating email:', error)
    return NextResponse.json(
      { error: 'Failed to generate email. Please try again.' },
      { status: 500 }
    )
  }
}
