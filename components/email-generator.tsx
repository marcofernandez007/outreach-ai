'use client'

import { useState } from 'react'

interface GeneratedEmail {
  id: string
  subject: string
  body: string
  createdAt: string
}

interface EmailGeneratorProps {
  prospectId: string
  prospectName: string
  onEmailGenerated?: (email: GeneratedEmail) => void
}

export default function EmailGenerator({
  prospectId,
  prospectName,
  onEmailGenerated,
}: EmailGeneratorProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [email, setEmail] = useState<GeneratedEmail | null>(null)
  const [copied, setCopied] = useState(false)

  const generateEmail = async () => {
    setLoading(true)
    setError('')
    setCopied(false)

    try {
      const response = await fetch('/api/generate-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prospectId }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate email')
      }

      const data = await response.json()
      setEmail(data)
      if (onEmailGenerated) {
        onEmailGenerated(data)
      }
    } catch (err) {
      setError('Failed to generate email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (!email) return

    const fullEmail = `Subject: ${email.subject}\n\n${email.body}`
    navigator.clipboard.writeText(fullEmail)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">AI Email Generator</h3>
        <button
          onClick={generateEmail}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Generating...
            </span>
          ) : email ? (
            'Regenerate Email'
          ) : (
            'Generate Email'
          )}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
          {error}
        </div>
      )}

      {email && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900">{email.subject}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Body</label>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-900 whitespace-pre-wrap">{email.body}</p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
          </div>

          <div className="text-xs text-gray-500 text-right">
            Generated {new Date(email.createdAt).toLocaleString()}
          </div>
        </div>
      )}

      {!email && !loading && (
        <div className="text-center py-8 text-gray-500">
          <p>Click &quot;Generate Email&quot; to create a personalized outreach email for {prospectName}</p>
        </div>
      )}
    </div>
  )
}
