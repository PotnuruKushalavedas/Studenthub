'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Loader2 } from 'lucide-react'

type Course = Database['public']['Tables']['courses']['Row']
type Assignment = Database['public']['Tables']['assignments']['Row']
type Project = Database['public']['Tables']['projects']['Row']
type Attendance = Database['public']['Tables']['attendance']['Row']

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

interface AnalyticsData {
  projectCompletion: number
  assignmentCompletion: number
  attendanceRate: number
  totalProjects: number
  completedProjects: number
  totalAssignments: number
  completedAssignments: number
  totalInternships: number
  totalAttendance: number
  attendedClasses: number
}

export default function AnalyticsPage() {
  const { user } = useAuth()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [courseData, setCourseData] = useState<any[]>([])
  const [assignmentData, setAssignmentData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        // Fetch all necessary data in parallel
        const [coursesRes, assignmentsRes, projectsRes, attendanceRes, internshipsRes] = await Promise.all([
          supabase
            .from('courses')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('assignments')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('projects')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('attendance')
            .select('*')
            .eq('user_id', user.id),
          supabase
            .from('internships')
            .select('*')
            .eq('user_id', user.id),
        ])

        // Calculate real analytics from actual data
        const courses = coursesRes.data || []
        const assignments = assignmentsRes.data || []
        const projects = projectsRes.data || []
        const attendance = attendanceRes.data || []
        const internships = internshipsRes.data || []

        // Calculate completion rates
        const totalProjects = projects.length
        const completedProjects = projects.filter((p: Project) => p.status === 'completed').length
        const projectCompletion = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0

        const totalAssignments = assignments.length
        const completedAssignments = assignments.filter((a: Assignment) => a.status === 'completed').length
        const assignmentCompletion = totalAssignments > 0 ? Math.round((completedAssignments / totalAssignments) * 100) : 0

        const totalAttendance = attendance.length
        const attendedClasses = attendance.filter((a: Attendance) => a.status === 'present').length
        const attendanceRate = totalAttendance > 0 ? Math.round((attendedClasses / totalAttendance) * 100) : 0

        setAnalytics({
          projectCompletion,
          assignmentCompletion,
          attendanceRate,
          totalProjects,
          completedProjects,
          totalAssignments,
          completedAssignments,
          totalInternships: internships.length,
          totalAttendance,
          attendedClasses,
        })

        // Build grade distribution chart
        if (courses.length > 0) {
          const gradeDistribution = courses.reduce((acc: any, course: Course) => {
            const grade = course.grade || 'No Grade'
            const existing = acc.find((item: any) => item.name === grade)
            if (existing) existing.value++
            else acc.push({ name: grade, value: 1 })
            return acc
          }, [])
          setCourseData(gradeDistribution)
        }

        // Build assignment trend chart
        if (assignments.length > 0) {
          const submissionTrend = assignments.reduce((acc: any, assignment: Assignment) => {
            const month = new Date(assignment.created_at).toLocaleDateString('en-US', {
              month: 'short',
            })
            const existing = acc.find((item: any) => item.month === month)
            if (existing) existing.assignments++
            else acc.push({ month, assignments: 1 })
            return acc
          }, [])
          setAssignmentData(submissionTrend)
        }
      } catch (error) {
        console.error('Failed to fetch analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600 mt-2">Track your academic performance and progress</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Assignment Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics?.assignmentCompletion || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics?.completedAssignments || 0} of {analytics?.totalAssignments || 0} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{analytics?.attendanceRate || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics?.attendedClasses || 0} of {analytics?.totalAttendance || 0} classes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Project Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{analytics?.projectCompletion || 0}%</div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics?.completedProjects || 0} of {analytics?.totalProjects || 0} projects
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Internships</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.totalInternships || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Total experiences</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {assignmentData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Assignment Submissions</CardTitle>
              <CardDescription>Assignments created over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={assignmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="assignments"
                    stroke="#3b82f6"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {courseData.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Distribution of course grades</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={courseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {courseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Productivity Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Breakdown</CardTitle>
          <CardDescription>Your academic performance across key areas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Project Completion</span>
                <span className="text-sm font-semibold text-amber-600">{analytics?.projectCompletion || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analytics?.projectCompletion || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics?.completedProjects || 0} of {analytics?.totalProjects || 0} projects completed
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Assignment Completion</span>
                <span className="text-sm font-semibold text-blue-600">{analytics?.assignmentCompletion || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analytics?.assignmentCompletion || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics?.completedAssignments || 0} of {analytics?.totalAssignments || 0} assignments completed
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Class Attendance</span>
                <span className="text-sm font-semibold text-emerald-600">{analytics?.attendanceRate || 0}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-400 to-emerald-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${analytics?.attendanceRate || 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {analytics?.attendedClasses || 0} of {analytics?.totalAttendance || 0} classes attended
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
