'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProspectList from '@/components/prospect-list'
import Link from 'next/link'

interface Prospect {
  id: string
  name: string
  company: string
  role: string
  status: string
  industry?: string | null
  email?: string | null
  createdAt: string
  emails?: Array<{ id: string; createdAt: string }>
}

export default function ProspectsPage() {
  const router = useRouter()
  const [prospects, setProspects] = useState<Prospect[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProspects()
  }, [])

  const fetchProspects = async () => {
    try {
      const response = await fetch('/api/prospects')
      if (response.ok) {
        const data = await response.json()
        setProspects(data)
      }
    } catch (error) {
      console.error('Error fetching prospects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        setProspects(prospects.filter((p) => p.id !== id))
      }
    } catch (error) {
      console.error('Error deleting prospect:', error)
    }
  }

  const handleStatusChange = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/prospects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      if (response.ok) {
        const updated = await response.json()
        setProspects(prospects.map((p) => (p.id === id ? { ...p, status: updated.status } : p)))
      }
    } catch (error) {
      console.error('Error updating prospect status:', error)
    }
  }

  const handleGenerateEmail = (id: string) => {
    router.push(`/prospects/${id}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prospects...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Prospects</h1>
          <p className="text-gray-600 mt-1">Manage your outreach prospects</p>
        </div>
        <Link
          href="/prospects/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Add Prospect
        </Link>
      </div>

      <ProspectList
        prospects={prospects}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        onGenerateEmail={handleGenerateEmail}
      />
    </div>
  )
}
