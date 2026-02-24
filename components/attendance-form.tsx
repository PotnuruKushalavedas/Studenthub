'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type Course = Database['public']['Tables']['courses']['Row']
type Attendance = Database['public']['Tables']['attendance']['Row']

interface AttendanceFormProps {
  recordId?: string
  isEditing?: boolean
}

export function AttendanceForm({ recordId, isEditing = false }: AttendanceFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    course_id: '',
    date: new Date().toISOString().split('T')[0],
    status: 'present',
  })

  useEffect(() => {
    if (!user) return
    fetchData()
  }, [user])

  const fetchData = async () => {
    if (!user) return
    try {
      const { data: coursesData, error: courseError } = await supabase
        .from('courses')
        .select('*')
        .eq('user_id', user.id)
        .order('course_name')

      if (courseError) throw courseError
      setCourses(coursesData || [])

      if (isEditing && recordId) {
        const { data: recordData, error: recordError } = await supabase
          .from('attendance')
          .select('*')
          .eq('id', recordId)
          .single()

        if (recordError) throw recordError
        if (recordData) {
          setFormData({
            course_id: recordData.course_id,
            date: recordData.date,
            status: recordData.status,
          })
        }
      }
    } catch (err: any) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !formData.course_id) {
      toast.error('Please fill in all fields')
      return
    }

    setSaving(true)
    try {
      if (isEditing && recordId) {
        const { error } = await supabase
          .from('attendance')
          .update({
            course_id: formData.course_id,
            date: formData.date,
            status: formData.status,
          })
          .eq('id', recordId)

        if (error) throw error
        toast.success('Attendance record updated')
      } else {
        const { error } = await supabase
          .from('attendance')
          .insert({
            user_id: user.id,
            course_id: formData.course_id,
            date: formData.date,
            status: formData.status,
          })

        if (error) throw error
        toast.success('Attendance record added')
      }

      router.push('/dashboard/attendance')
    } catch (err: any) {
      toast.error(err.message || 'Failed to save attendance record')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditing ? 'Edit Attendance' : 'Add Attendance Record'}</CardTitle>
        <CardDescription>
          {isEditing ? 'Update the attendance record' : 'Mark your attendance for a class'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Course</label>
            <Select
              value={formData.course_id}
              onValueChange={(value) => setFormData({ ...formData, course_id: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.course_name} ({course.course_code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Date</label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={formData.status}
              onValueChange={(value) => setFormData({ ...formData, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="present">Present</SelectItem>
                <SelectItem value="absent">Absent</SelectItem>
                <SelectItem value="late">Late</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/dashboard/attendance')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="gap-2"
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? 'Update' : 'Add'} Record
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
