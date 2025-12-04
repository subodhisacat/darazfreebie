'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { getAvailableAds, logAdClick } from '@/lib/adService'
import Link from 'next/link'
import type { Ad } from '@/lib/supabase'

export default function BrowseAds() {
  const router = useRouter()
  const [ads, setAds] = useState<Ad[]>([])
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [tokens, setTokens] = useState(0)
  const [lastInteractionTime, setLastInteractionTime] = useState<number>(0)
  const [cooldownRemaining, setCooldownRemaining] = useState<number>(0)

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

      // Fetch user tokens
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setTokens(profile.tokens)
      }

      // Fetch available ads (exclude already clicked ads)
      const availableAds = await getAvailableAds(session.user.id)
      setAds(availableAds)
      setLoading(false)
    }

    fetchData()
  }, [router])

  const handleClickLink = async (ad: Ad) => {
    if (!user) return

    const now = Date.now()
    const timeSinceLastInteraction = now - lastInteractionTime
    if (timeSinceLastInteraction < 10000) {
      setCooldownRemaining(Math.ceil((10000 - timeSinceLastInteraction) / 1000))
      return
    }

    try {
      // ✅ Log click & reward ONLY 1 token in backend
      await logAdClick(ad.id, user.id)

      setLastInteractionTime(now)

      // ✅ Remove ad immediately from UI (cannot be reused)
      setAds(prev => prev.filter(item => item.id !== ad.id))

      // ✅ Refresh tokens
      const { data: profile } = await supabase
        .from('profiles')
        .select('tokens')
        .eq('id', user.id)
        .single()

      if (profile) {
        setTokens(profile.tokens)
      }

      // ✅ Open Daraz Link
      window.open(ad.link, '_blank')

    } catch (error) {
      console.error('Error clicking ad:', error)
    }

    setCooldownRemaining(0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading ads...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-8">
            <Link href="/ads" className="text-2xl font-bold text-indigo-600">
              Daraz Freebie 
            </Link>
            <div className="flex gap-4">
              <Link href="/ads" className="text-gray-600 hover:text-indigo-600 font-medium">
                Browse Ads
              </Link>
              <Link href="/dashboard" className="text-gray-600 hover:text-indigo-600 font-medium">
                My Ads
              </Link>
              <Link href="/profile" className="text-gray-600 hover:text-indigo-600 font-medium">
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
        <h1 className="text-3xl font-bold text-gray-800 mb-8">
          Browse Ads & Earn Tokens
        </h1>

        {ads.length === 0 ? (
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <p className="text-gray-600 text-lg">
              No ads available at the moment. Check back later!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map((ad) => (
              <div
                key={ad.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-xl font-bold text-gray-800 flex-1">
                      {ad.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    by {(ad as any).profiles?.username || 'Anonymous'}
                  </p>

                  <p className="text-gray-700 mb-4">{ad.description}</p>

                  {/* ✅ SINGLE BUTTON ONLY */}
                  <div className="flex gap-3 mb-4">
                    <button
                      onClick={() => handleClickLink(ad)}
                      disabled={cooldownRemaining > 0}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white font-bold py-2 px-4 rounded-lg transition"
                    >
                      {cooldownRemaining > 0 ? `Wait ${cooldownRemaining}s` : 'Open Ad (+1 🪙)'}
                    </button>
                  </div>

                  <a
                    href={ad.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium break-all"
                  >
                    {ad.link}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
