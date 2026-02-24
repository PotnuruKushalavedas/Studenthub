'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Assignment = Database['public']['Tables']['assignments']['Row']
type Course = Database['public']['Tables']['courses']['Row']

interface AssignmentFormProps {
  assignmentId?: string
}

export function AssignmentForm({ assignmentId }: AssignmentFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(!!assignmentId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [formData, setFormData] = useState<Partial<Assignment>>({
    title: '',
    description: '',
    course_id: '',
    due_date: '',
    submission_date: '',
    grade: undefined,
    status: 'pending',
  })

  useEffect(() => {
    if (!user) return

    const fetchData = async () => {
      try {
        const [coursesRes, assignmentRes] = await Promise.all([
          supabase
            .from('courses')
            .select('*')
            .eq('user_id', user.id),
          assignmentId
            ? supabase
                .from('assignments')
                .select('*')
                .eq('id', assignmentId)
                .eq('user_id', user.id)
                .single()
            : Promise.resolve({ data: null }),
        ])

        if (coursesRes.data) setCourses(coursesRes.data)
        if (assignmentRes.data) setFormData(assignmentRes.data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [user, assignmentId])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      if (assignmentId) {
        const { error } = await supabase
          .from('assignments')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', assignmentId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('assignments')
          .insert({
            ...formData,
            user_id: user.id,
          } as any)

        if (error) throw error
      }

      router.push('/dashboard/assignments')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="animate-spin" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{assignmentId ? 'Edit Assignment' : 'Add Assignment'}</CardTitle>
        <CardDescription>
          {assignmentId ? 'Update your assignment details' : 'Record a new assignment'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Course *</label>
            <select
              value={formData.course_id || ''}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              required
            >
              <option value="">Select a course...</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.course_name} ({course.course_code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">Assignment Title *</label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Homework 1"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Assignment details..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Due Date *</label>
            <Input
              type="datetime-local"
              value={formData.due_date || ''}
              onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Submission Date</label>
              <Input
                type="datetime-local"
                value={formData.submission_date || ''}
                onChange={(e) => setFormData({ ...formData, submission_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">Grade (%)</label>
              <Input
                type="number"
                min="0"
                max="100"
                value={formData.grade || ''}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value ? parseFloat(e.target.value) : undefined })}
                placeholder="95"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status || 'pending'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/dashboard/assignments" className="flex-1">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : assignmentId ? 'Update Assignment' : 'Add Assignment'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
