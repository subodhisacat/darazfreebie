'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { createAd, getUserAds } from '@/lib/adService'
import Link from 'next/link'
import type { Ad } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [tokens, setTokens] = useState(0)
  const [ads, setAds] = useState<Ad[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    link: '',
    tokens: '5',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)

      // Fetch user profile and tokens
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setTokens(profile.tokens)
      }

      // Fetch user ads
      const userAds = await getUserAds(session.user.id)
      setAds(userAds)
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleInputChange = (
    e: any,
    field: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  const handleCreateAd = async (e: any) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!formData.link || !formData.tokens) {
      setError('Please fill in link and tokens')
      return
    }

    const tokensToSpend = parseInt(formData.tokens)

    if (tokensToSpend > tokens) {
      setError('You dont have enough tokens')
      return
    }

    try {
      await createAd(
        user.id,
        formData.title,
        formData.description,
        formData.link,
        tokensToSpend
      )

      setSuccess('Ad created successfully!')
      setFormData({ title: '', description: '', link: '', tokens: '5' })
      setShowForm(false)

      // Refresh tokens and ads
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', user.id)
        .single()

      if (profile) {
        setTokens(profile.tokens)
      }

      const userAds = await getUserAds(user.id)
      setAds(userAds)

      setTimeout(() => setSuccess(''), 3000)
    } catch (error: any) {
      setError(error.message)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              href="/"
              className="text-2xl font-bold text-indigo-600"
            >
              Token Ads
            </Link>
            <div className="flex gap-4">
              <Link
                href="/ads"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Browse Ads
              </Link>
              <Link
                href="/dashboard"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                My Ads
              </Link>
              <Link
                href="/profile"
                className="text-gray-600 hover:text-indigo-600 font-medium"
              >
                Profile
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-2xl font-bold text-yellow-600">
              {tokens} 🪙
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Ads</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
          >
            {showForm ? 'Cancel' : 'Create New Ad'}
          </button>
        </div>

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}

        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Create New Ad
            </h2>
            <form onSubmit={handleCreateAd} className="space-y-4">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Ad Title (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Enter your ad title"
                  value={formData.title}
                  onChange={(e) => handleInputChange(e, 'title')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Description (Optional)
                </label>
                <textarea
                  placeholder="Describe your ad"
                  value={formData.description}
                  onChange={(e) => handleInputChange(e, 'description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Link
                </label>
                <input
                  type="url"
                  placeholder="https://example.com"
                  value={formData.link}
                  onChange={(e) => handleInputChange(e, 'link')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Tokens to Spend (Available: {tokens} 🪙)
                </label>
                <input
                  type="number"
                  min="1"
                  max={tokens}
                  value={formData.tokens}
                  onChange={(e) => handleInputChange(e, 'tokens')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition"
              >
                Create Ad
              </button>
            </form>
          </div>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.length === 0 ? (
            <div className="col-span-full bg-white rounded-lg shadow-lg p-8 text-center">
              <p className="text-gray-600 text-lg">
                You haven't created any ads yet. Create one to get started!
              </p>
            </div>
          ) : (
            ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">
                    {ad.title}
                  </h2>
                  <p className="text-gray-700 mb-4">{ad.description}</p>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Spent:</p>
                    <p className="text-2xl font-bold text-yellow-600">
                      {ad.tokens_spent} 🪙
                    </p>
                  </div>
                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium break-all"
                  >
                    {ad.link}
                  </a>
                  <p className="text-xs text-gray-500 mt-4">
                    Created:{' '}
                    {new Date(ad.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
