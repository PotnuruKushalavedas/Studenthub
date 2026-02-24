'use client'

import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div className="text-center max-w-2xl">
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto bg-indigo-600 rounded-lg flex items-center justify-center mb-4">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-300">S</span>
          </div>
          <h1 className="text-5xl font-bold text-gray-800 dark:text-gray-200 mb-4">StudentHub</h1>
          <p className="text-xl text-gray-700 dark:text-gray-300 mb-8">
            Manage your academic journey. Track projects, internships, courses, and assignments in one place.
          </p>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-gray-800 dark:text-gray-100 shadow rounded-xl">
              <h3 className="font-semibold mb-2">Profile Management</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Showcase your academic achievements</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-gray-800 dark:text-gray-100 shadow rounded-xl">
              <h3 className="font-semibold mb-2">Project & Internship Tracking</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Build your professional portfolio</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 text-gray-800 dark:text-gray-100 shadow rounded-xl">
              <h3 className="font-semibold mb-2">Academic Analytics</h3>
              <p className="text-sm text-gray-500 dark:text-gray-300">Track your progress and GPA</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Sign In
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/signup')}
              className="border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              Create Account
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
