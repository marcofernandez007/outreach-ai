import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const prospects = await prisma.prospect.findMany({
      where: { userId: session.user.id },
      include: {
        emails: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(prospects)
  } catch (error) {
    console.error('Error fetching prospects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prospects' },
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { name, company, role, industry, painPoints, linkedinUrl, email } = body

    if (!name || !company || !role) {
      return NextResponse.json(
        { error: 'Name, company, and role are required' },
        { status: 400 }
      )
    }

    const prospect = await prisma.prospect.create({
      data: {
        name,
        company,
        role,
        industry: industry || null,
        painPoints: painPoints || null,
        linkedinUrl: linkedinUrl || null,
        email: email || null,
        userId: session.user.id,
      },
    })

    return NextResponse.json(prospect)
  } catch (error) {
    console.error('Error creating prospect:', error)
    return NextResponse.json(
      { error: 'Failed to create prospect' },
      { status: 500 }
    )
  }
}
