'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Profile } from '@/lib/supabase'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

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

      // Fetch user profile
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()

      if (userProfile) {
        setProfile(userProfile)
      }

      setLoading(false)
    }

    fetchData()
  }, [router])

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
              Daraz Freebie 
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
              {profile?.tokens || 0} 🪙
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

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">
            Your Profile
          </h1>

          <div className="space-y-6">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Username
              </label>
              <p className="text-2xl font-bold text-gray-800">
                {profile?.username || 'N/A'}
              </p>
            </div>

            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email
              </label>
              <p className="text-lg text-gray-700">{user?.email}</p>
            </div>

            <div className="border-t pt-6">
              <label className="block text-gray-600 font-medium mb-2">
                Available Tokens
              </label>
              <div className="text-5xl font-bold text-yellow-600 flex items-center gap-4">
                {profile?.tokens || 0}
                <span className="text-5xl">🪙</span>
              </div>
            </div>

            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mt-6">
              <h3 className="font-semibold text-blue-900 mb-2">How to Earn More Tokens</h3>
              <ul className="text-blue-800 space-y-1">
                <li>• View ads: +1 token per ad</li>
                <li>• Click links: +5 tokens per click</li>
                <li>• Each user can only earn tokens once per ad</li>
              </ul>
            </div>

            <div className="bg-green-50 border-l-4 border-green-500 p-4">
              <h3 className="font-semibold text-green-900 mb-2">How to Use Tokens</h3>
              <ul className="text-green-800 space-y-1">
                <li>• Create ads with your tokens</li>
                <li>• Spend as many tokens as you want per ad</li>
                <li>• More tokens = more visibility</li>
              </ul>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href="/ads"
                className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition text-center"
              >
                Earn More Tokens
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition text-center"
              >
                Create Ad
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
