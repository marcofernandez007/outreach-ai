'use client'

import { useState } from 'react'
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

interface ProspectListProps {
  prospects: Prospect[]
  onDelete: (id: string) => Promise<void>
  onStatusChange: (id: string, status: string) => Promise<void>
  onGenerateEmail: (id: string) => void
}

export default function ProspectList({
  prospects,
  onDelete,
  onStatusChange,
  onGenerateEmail,
}: ProspectListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const filteredProspects = prospects.filter((prospect) => {
    const matchesSearch =
      prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || prospect.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prospect?')) {
      setDeletingId(id)
      await onDelete(id)
      setDeletingId(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-gray-100 text-gray-800'
      case 'contacted':
        return 'bg-blue-100 text-blue-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      case 'converted':
        return 'bg-purple-100 text-purple-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search by name or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="replied">Replied</option>
            <option value="converted">Converted</option>
          </select>
        </div>
      </div>

      {/* Prospects List */}
      {filteredProspects.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No prospects found</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredProspects.map((prospect) => (
            <div
              key={prospect.id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{prospect.name}</h3>
                      <p className="text-sm text-gray-600">
                        {prospect.role} at {prospect.company}
                      </p>
                      {prospect.industry && (
                        <p className="text-sm text-gray-500 mt-1">Industry: {prospect.industry}</p>
                      )}
                      {prospect.email && (
                        <p className="text-sm text-gray-500 mt-1">{prospect.email}</p>
                      )}
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        prospect.status
                      )}`}
                    >
                      {prospect.status.charAt(0).toUpperCase() + prospect.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Added {new Date(prospect.createdAt).toLocaleDateString()}</span>
                    {prospect.emails && prospect.emails.length > 0 && (
                      <span>• {prospect.emails.length} email(s) generated</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onGenerateEmail(prospect.id)}
                    className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Generate Email
                  </button>
                  <Link
                    href={`/prospects/${prospect.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    View Details
                  </Link>
                  <select
                    value={prospect.status}
                    onChange={(e) => onStatusChange(prospect.id, e.target.value)}
                    className="px-3 py-2 border border-gray-300 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="replied">Replied</option>
                    <option value="converted">Converted</option>
                  </select>
                  <button
                    onClick={() => handleDelete(prospect.id)}
                    disabled={deletingId === prospect.id}
                    className="px-4 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors disabled:opacity-50"
                  >
                    {deletingId === prospect.id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
