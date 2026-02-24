'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { BookOpen, FolderOpen, Briefcase, BarChart3, Plus } from 'lucide-react'
import Link from 'next/link'

type Analytics = Database['public']['Tables']['analytics']['Row']
type Profile = Database['public']['Tables']['profiles']['Row']

export default function DashboardPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [analyticsRes, profileRes] = await Promise.all([
          supabase
            .from('analytics')
            .select('*')
            .eq('user_id', user.id)
            .single(),
          supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single(),
        ])

        if (analyticsRes.data) setAnalytics(analyticsRes.data)
        if (profileRes.data) setProfile(profileRes.data)
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-black">Welcome, {profile?.full_name || 'Student'}!</h1>
        <p className="text-gray-500 dark:text-black mt-2">Here's your academic dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300">GPA</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile?.gpa?.toFixed(2) || 'N/A'}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Out of 10.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <FolderOpen className="w-4 h-4" />
              Projects
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_projects || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analytics?.completed_projects || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Briefcase className="w-4 h-4" />
              Internships
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.total_internships || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total experiences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.completed_assignments || 0}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              / {analytics?.total_assignments || 0} total
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription className="dark:text-gray-400">Get started with common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/dashboard/projects">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </Link>
            <Link href="/dashboard/internships">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Internship
              </Button>
            </Link>
            <Link href="/dashboard/courses">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </Link>
            <Link href="/dashboard/assignments">
              <Button variant="outline" className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Assignment
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Productivity Score */}
      <Card>
        <CardHeader>
          <CardTitle>Productivity Score</CardTitle>
          <CardDescription className="dark:text-gray-400">Your overall academic productivity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                {analytics?.productivity_score?.toFixed(1) || '0'}%
              </div>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Based on completed projects, assignments, and attendance
              </p>
            </div>
            <BarChart3 className="w-16 h-16 text-blue-200" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
