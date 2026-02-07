import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
      include: {
        emails: {
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    return NextResponse.json(prospect)
  } catch (error) {
    console.error('Error fetching prospect:', error)
    return NextResponse.json(
      { error: 'Failed to fetch prospect' },
      { status: 500 }
    )
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await req.json()
    const { name, company, role, industry, painPoints, linkedinUrl, email, status } = body

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    const updated = await prisma.prospect.update({
      where: { id: id },
      data: {
        name: name || prospect.name,
        company: company || prospect.company,
        role: role || prospect.role,
        industry: industry !== undefined ? industry : prospect.industry,
        painPoints: painPoints !== undefined ? painPoints : prospect.painPoints,
        linkedinUrl: linkedinUrl !== undefined ? linkedinUrl : prospect.linkedinUrl,
        email: email !== undefined ? email : prospect.email,
        status: status || prospect.status,
      },
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating prospect:', error)
    return NextResponse.json(
      { error: 'Failed to update prospect' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    const prospect = await prisma.prospect.findFirst({
      where: {
        id: id,
        userId: session.user.id,
      },
    })

    if (!prospect) {
      return NextResponse.json({ error: 'Prospect not found' }, { status: 404 })
    }

    await prisma.prospect.delete({
      where: { id: id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting prospect:', error)
    return NextResponse.json(
      { error: 'Failed to delete prospect' },
      { status: 500 }
    )
  }
}
