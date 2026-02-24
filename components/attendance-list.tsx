'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { Loader2, Trash2, Edit2, Plus } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'

type Attendance = Database['public']['Tables']['attendance']['Row']

interface AttendanceSummary extends Attendance {
  course_name?: string
  attendance_percentage?: number
}

export function AttendanceList() {
  const { user } = useAuth()
  const [attendanceData, setAttendanceData] = useState<AttendanceSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    fetchAttendance()
  }, [user])

  const fetchAttendance = async () => {
    if (!user) return
    try {
      const { data: courses, error: courseError } = await supabase
        .from('courses')
        .select('id, course_name')
        .eq('user_id', user.id)

      if (courseError) throw courseError

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      const attendanceWithCourses = data.map(record => ({
        ...record,
        course_name: courses?.find(c => c.id === record.course_id)?.course_name || 'Unknown Course'
      }))

      setAttendanceData(attendanceWithCourses)
    } catch (err: any) {
      toast.error('Failed to load attendance data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    try {
      const { error } = await supabase
        .from('attendance')
        .delete()
        .eq('id', id)

      if (error) throw error

      setAttendanceData(prev => prev.filter(a => a.id !== id))
      toast.success('Attendance record deleted')
    } catch (err: any) {
      toast.error('Failed to delete record')
    } finally {
      setDeleting(null)
    }
  }

  // Group by course and calculate percentages
  const courseSummary = attendanceData.reduce((acc, record) => {
    const courseId = record.course_id
    if (!acc[courseId]) {
      acc[courseId] = {
        courseName: record.course_name || 'Unknown Course',
        total: 0,
        present: 0,
        records: []
      }
    }
    acc[courseId].total += 1
    if (record.status === 'present') acc[courseId].present += 1
    acc[courseId].records.push(record)
    return acc
  }, {} as Record<string, { courseName: string; total: number; present: number; records: AttendanceSummary[] }>)

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Attendance Tracker</h2>
        <Link href="/dashboard/attendance/new">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Add Attendance
          </Button>
        </Link>
      </div>

      {Object.entries(courseSummary).length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center text-gray-500">
            No attendance records yet. Start by adding your first record.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {Object.entries(courseSummary).map(([courseId, summary]) => {
            const percentage = summary.total > 0 ? (summary.present / summary.total) * 100 : 0
            const isWarning = percentage < 75

            return (
              <Card
                key={courseId}
                className={`${isWarning ? 'border-red-300 bg-red-50' : ''}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{summary.courseName}</CardTitle>
                      <CardDescription>
                        {summary.present} / {summary.total} classes attended
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${isWarning ? 'text-red-600' : 'text-green-600'}`}>
                        {percentage.toFixed(1)}%
                      </div>
                      {isWarning && <p className="text-xs text-red-600">Below 75%</p>}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Progress value={percentage} className="h-2" />
                  </div>

                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {summary.records.map(record => (
                      <div
                        key={record.id}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${record.status === 'present' ? 'bg-green-500' : record.status === 'absent' ? 'bg-red-500' : 'bg-yellow-500'}`}
                          />
                          <span>{new Date(record.date).toLocaleDateString()}</span>
                          <span className="text-gray-600 capitalize">{record.status}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            asChild
                          >
                            <Link href={`/dashboard/attendance/${record.id}/edit`}>
                              <Edit2 className="w-4 h-4" />
                            </Link>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogTitle>Delete Record</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure? This action cannot be undone.
                              </AlertDialogDescription>
                              <div className="flex gap-3 justify-end">
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(record.id)}
                                  disabled={deleting === record.id}
                                >
                                  {deleting === record.id ? 'Deleting...' : 'Delete'}
                                </AlertDialogAction>
                              </div>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
