'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      if (!session) {
        router.push('/auth/login')
      }
    }

    checkAuth()
  }, [router])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-600">Daraz Freebie</h1>
          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Dashboard
            </Link>
            <Link
              href="/ads"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Browse Ads
            </Link>
            <Link
              href="/profile"
              className="text-gray-600 hover:text-indigo-600 font-medium"
            >
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Earn Tokens
            </h2>
            <p className="text-gray-600 mb-6">
              View other people's advertisements and earn tokens for each view.
              Click on links to earn bonus tokens!
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                1 token per ad view
              </li>
              <li className="flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                5 bonus tokens per click
              </li>
              <li className="flex items-center">
                <span className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                Unlimited earning potential
              </li>
            </ul>
            <Link
              href="/ads"
              className="inline-block bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Start Earning
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Run Ads
            </h2>
            <p className="text-gray-600 mb-6">
              Use your tokens to promote your business or links. Your ads will
              be shown to other users on the platform.
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                Set your own budget in tokens
              </li>
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                Track your ad performance
              </li>
              <li className="flex items-center">
                <span className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 text-sm">
                  ✓
                </span>
                Promote any link instantly
              </li>
            </ul>
            <Link
              href="/dashboard"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition"
            >
              Create Ad
            </Link>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">1</div>
              <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
              <p className="text-gray-600">
                Create an account and get 10 starting tokens
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">2</div>
              <h3 className="text-lg font-semibold mb-2">Earn Tokens</h3>
              <p className="text-gray-600">
                Browse ads, earn tokens by viewing and clicking
              </p>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">3</div>
              <h3 className="text-lg font-semibold mb-2">Advertise</h3>
              <p className="text-gray-600">
                Spend tokens to run your own ads to other users
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
