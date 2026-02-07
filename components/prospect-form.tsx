'use client'

import { useState } from 'react'

interface ProspectFormProps {
  onSubmit: (data: ProspectFormData) => Promise<void>
  initialData?: Partial<ProspectFormData>
  loading?: boolean
  submitLabel?: string
}

export interface ProspectFormData {
  name: string
  company: string
  role: string
  industry?: string
  painPoints?: string
  linkedinUrl?: string
  email?: string
  status?: string
}

export default function ProspectForm({
  onSubmit,
  initialData,
  loading = false,
  submitLabel = 'Add Prospect',
}: ProspectFormProps) {
  const [formData, setFormData] = useState<ProspectFormData>({
    name: initialData?.name || '',
    company: initialData?.company || '',
    role: initialData?.role || '',
    industry: initialData?.industry || '',
    painPoints: initialData?.painPoints || '',
    linkedinUrl: initialData?.linkedinUrl || '',
    email: initialData?.email || '',
    status: initialData?.status || 'new',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await onSubmit(formData)
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="John Doe"
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
            Company <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="company"
            name="company"
            required
            value={formData.company}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Acme Corp"
          />
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
            Role/Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="role"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="VP of Sales"
          />
        </div>

        <div>
          <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
            Industry
          </label>
          <input
            type="text"
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="SaaS"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="john@acme.com"
          />
        </div>

        <div>
          <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn URL
          </label>
          <input
            type="url"
            id="linkedinUrl"
            name="linkedinUrl"
            value={formData.linkedinUrl}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="https://linkedin.com/in/..."
          />
        </div>

        {initialData && (
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="replied">Replied</option>
              <option value="converted">Converted</option>
            </select>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="painPoints" className="block text-sm font-medium text-gray-700 mb-1">
          Pain Points / Notes
        </label>
        <textarea
          id="painPoints"
          name="painPoints"
          rows={4}
          value={formData.painPoints}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="What challenges are they facing? Any specific context..."
        />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Saving...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
