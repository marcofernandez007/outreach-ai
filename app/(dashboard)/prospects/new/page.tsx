'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import ProspectForm, { ProspectFormData } from '@/components/prospect-form'
import Link from 'next/link'

export default function NewProspectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (data: ProspectFormData) => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/prospects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create prospect')
      }

      router.push('/prospects')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/prospects"
          className="text-gray-600 hover:text-gray-900"
        >
          ← Back to Prospects
        </Link>
      </div>
      
      <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Add New Prospect</h1>
        <p className="text-gray-600 mb-6">
          Enter the prospect&apos;s information to start generating personalized outreach emails
        </p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <ProspectForm
          onSubmit={handleSubmit}
          loading={loading}
          submitLabel="Add Prospect"
        />
      </div>
    </div>
  )
}
