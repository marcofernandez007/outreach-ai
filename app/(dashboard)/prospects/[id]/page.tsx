'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import ProspectForm, { ProspectFormData } from '@/components/prospect-form'
import EmailGenerator from '@/components/email-generator'

interface GeneratedEmail {
  id: string
  subject: string
  body: string
  createdAt: string
}

interface Prospect {
  id: string
  name: string
  company: string
  role: string
  industry?: string | null
  painPoints?: string | null
  linkedinUrl?: string | null
  email?: string | null
  status: string
  createdAt: string
  emails: GeneratedEmail[]
}

export default function ProspectDetailPage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const router = useRouter()
  const [prospect, setProspect] = useState<Prospect | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`/api/prospects/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setProspect(data)
        } else {
          router.push('/prospects')
        }
      } catch (error) {
        console.error('Error fetching prospect:', error)
        router.push('/prospects')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [params.id, router])

  const handleUpdate = async (data: ProspectFormData) => {
    setUpdating(true)

    try {
      const response = await fetch(`/api/prospects/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const updated = await response.json()
        setProspect(updated)
        setEditing(false)
      }
    } catch (error) {
      console.error('Error updating prospect:', error)
    } finally {
      setUpdating(false)
    }
  }

  const handleEmailGenerated = (email: GeneratedEmail) => {
    if (prospect) {
      setProspect({
        ...prospect,
        emails: [email, ...prospect.emails],
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading prospect...</p>
        </div>
      </div>
    )
  }

  if (!prospect) {
    return null
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/prospects" className="text-gray-600 hover:text-gray-900">
          ← Back to Prospects
        </Link>
      </div>

      {/* Prospect Info Card */}
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{prospect.name}</h1>
            <p className="text-lg text-gray-600 mt-1">
              {prospect.role} at {prospect.company}
            </p>
          </div>
          <button
            onClick={() => setEditing(!editing)}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editing ? (
          <ProspectForm
            onSubmit={handleUpdate}
            initialData={{
              name: prospect.name,
              company: prospect.company,
              role: prospect.role,
              industry: prospect.industry || undefined,
              painPoints: prospect.painPoints || undefined,
              linkedinUrl: prospect.linkedinUrl || undefined,
              email: prospect.email || undefined,
              status: prospect.status,
            }}
            loading={updating}
            submitLabel="Update Prospect"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <span
                className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                  prospect.status === 'new'
                    ? 'bg-gray-100 text-gray-800'
                    : prospect.status === 'contacted'
                    ? 'bg-blue-100 text-blue-800'
                    : prospect.status === 'replied'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-purple-100 text-purple-800'
                }`}
              >
                {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
              </span>
            </div>
            {prospect.industry && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                <p className="text-gray-900">{prospect.industry}</p>
              </div>
            )}
            {prospect.email && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <p className="text-gray-900">{prospect.email}</p>
              </div>
            )}
            {prospect.linkedinUrl && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                <a
                  href={prospect.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Profile
                </a>
              </div>
            )}
            {prospect.painPoints && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pain Points / Notes
                </label>
                <p className="text-gray-900 whitespace-pre-wrap">{prospect.painPoints}</p>
              </div>
            )}
            <div className="md:col-span-2 text-sm text-gray-500">
              Added {new Date(prospect.createdAt).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Email Generator */}
      <EmailGenerator
        prospectId={prospect.id}
        prospectName={prospect.name}
        onEmailGenerated={handleEmailGenerated}
      />

      {/* Email History */}
      {prospect.emails.length > 0 && (
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Email History</h2>
          <div className="space-y-6">
            {prospect.emails.map((email) => (
              <div key={email.id} className="border border-gray-200 rounded-lg p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <p className="text-gray-900 font-medium">{email.subject}</p>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Body</label>
                  <p className="text-gray-900 whitespace-pre-wrap">{email.body}</p>
                </div>
                <div className="text-xs text-gray-500">
                  Generated {new Date(email.createdAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
