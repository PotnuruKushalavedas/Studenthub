'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Trash2, Edit2, Loader2, BookOpen } from 'lucide-react'
import Link from 'next/link'

type Course = Database['public']['Tables']['courses']['Row']

interface CoursesListProps {
  onEdit?: (course: Course) => void
}

export function CoursesList({ onEdit }: CoursesListProps) {
  const { user } = useAuth()
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchCourses = async () => {
      try {
        const { data, error } = await supabase
          .from('courses')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setCourses(data || [])
      } catch (error) {
        console.error('Failed to fetch courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure? This will also delete associated assignments.')) return

    setDeleting(courseId)
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId)

      if (error) throw error
      setCourses(courses.filter((c) => c.id !== courseId))
    } catch (error) {
      console.error('Failed to delete course:', error)
    } finally {
      setDeleting(null)
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

  if (courses.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No courses yet</p>
          <Link href="/dashboard/courses/new">
            <Button>Add Your First Course</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => (
        <Card key={course.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  {course.course_name}
                </CardTitle>
                <CardDescription>{course.course_code}</CardDescription>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  course.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : course.status === 'enrolled'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {course.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              {course.credits && (
                <div>
                  <span className="text-gray-600">Credits:</span>
                  <p className="font-medium">{course.credits}</p>
                </div>
              )}
              {course.grade && (
                <div>
                  <span className="text-gray-600">Grade:</span>
                  <p className="font-medium">{course.grade}</p>
                </div>
              )}
              {course.semester && (
                <div>
                  <span className="text-gray-600">Semester:</span>
                  <p className="font-medium">{course.semester}</p>
                </div>
              )}
              {course.instructor && (
                <div>
                  <span className="text-gray-600">Instructor:</span>
                  <p className="font-medium text-xs">{course.instructor}</p>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(course)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(course.id)}
                disabled={deleting === course.id}
              >
                {deleting === course.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4 mr-2" />
                )}
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
