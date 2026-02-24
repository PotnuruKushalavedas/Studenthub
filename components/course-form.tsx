'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Course = Database['public']['Tables']['courses']['Row']

interface CourseFormProps {
  courseId?: string
}

export function CourseForm({ courseId }: CourseFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(!!courseId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Course>>({
    course_code: '',
    course_name: '',
    credits: undefined,
    grade: '',
    semester: '',
    instructor: '',
    status: 'enrolled',
  })

  useEffect(() => {
    if (!courseId || !user) return

    const fetchCourse = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setFormData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchCourse()
  }, [courseId, user])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      if (courseId) {
        const { error } = await supabase
          .from('courses')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', courseId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('courses')
          .insert({
            ...formData,
            user_id: user.id,
          } as any)

        if (error) throw error
      }

      router.push('/dashboard/courses')
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
        <CardTitle>{courseId ? 'Edit Course' : 'Add Course'}</CardTitle>
        <CardDescription>
          {courseId ? 'Update your course information' : 'Record a new course'}
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
            <label className="text-sm font-medium">Course Code *</label>
            <Input
              value={formData.course_code || ''}
              onChange={(e) => setFormData({ ...formData, course_code: e.target.value })}
              placeholder="CS 101"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Course Name *</label>
            <Input
              value={formData.course_name || ''}
              onChange={(e) => setFormData({ ...formData, course_name: e.target.value })}
              placeholder="Introduction to Computer Science"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Credits</label>
              <Input
                type="number"
                value={formData.credits || ''}
                onChange={(e) => setFormData({ ...formData, credits: e.target.value ? parseInt(e.target.value) : undefined })}
                placeholder="3"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Grade</label>
              <select
                value={formData.grade || ''}
                onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="">Select grade...</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="B-">B-</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="C-">C-</option>
                <option value="D">D</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Semester</label>
              <Input
                value={formData.semester || ''}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                placeholder="Spring 2024"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Status</label>
              <select
                value={formData.status || 'enrolled'}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="enrolled">Enrolled</option>
                <option value="completed">Completed</option>
                <option value="dropped">Dropped</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Instructor</label>
            <Input
              value={formData.instructor || ''}
              onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
              placeholder="Dr. John Doe"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/dashboard/courses" className="flex-1">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : courseId ? 'Update Course' : 'Add Course'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
