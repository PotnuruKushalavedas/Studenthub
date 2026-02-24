'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Trash2, Edit2, Loader2, Calendar, CheckCircle2, Clock } from 'lucide-react'
import Link from 'next/link'

type Assignment = Database['public']['Tables']['assignments']['Row']
type Course = Database['public']['Tables']['courses']['Row']

interface AssignmentsListProps {
  onEdit?: (assignment: Assignment) => void
}

export function AssignmentsList({ onEdit }: AssignmentsListProps) {
  const { user } = useAuth()
  const [assignments, setAssignments] = useState<(Assignment & { course?: Course })[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchAssignments = async () => {
      try {
        const { data, error } = await supabase
          .from('assignments')
          .select('*, courses:course_id(course_name)')
          .eq('user_id', user.id)
          .order('due_date', { ascending: true })

        if (error) throw error
        setAssignments(data || [])
      } catch (error) {
        console.error('Failed to fetch assignments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssignments()
  }, [user])

  const handleDelete = async (assignmentId: string) => {
    if (!confirm('Are you sure you want to delete this assignment?')) return

    setDeleting(assignmentId)
    try {
      const { error } = await supabase
        .from('assignments')
        .delete()
        .eq('id', assignmentId)

      if (error) throw error
      setAssignments(assignments.filter((a) => a.id !== assignmentId))
    } catch (error) {
      console.error('Failed to delete assignment:', error)
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

  if (assignments.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No assignments yet</p>
          <Link href="/dashboard/assignments/new">
            <Button>Add Your First Assignment</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  const upcomingAssignments = assignments.filter((a) => a.status === 'pending')
  const completedAssignments = assignments.filter((a) => a.status === 'submitted')

  return (
    <div className="space-y-6">
      {upcomingAssignments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upcoming</h3>
          {upcomingAssignments.map((assignment) => (
            <Card key={assignment.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="w-5 h-5 text-orange-500" />
                      {assignment.title}
                    </CardTitle>
                    <CardDescription>
                      {Array.isArray(assignment.courses) ? assignment.courses[0]?.course_name : (assignment.courses as any)?.course_name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {assignment.description && <p className="text-gray-700">{assignment.description}</p>}
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  Due: {new Date(assignment.due_date).toLocaleDateString()}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(assignment)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(assignment.id)}
                    disabled={deleting === assignment.id}
                  >
                    {deleting === assignment.id ? (
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
      )}

      {completedAssignments.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Completed</h3>
          {completedAssignments.map((assignment) => (
            <Card key={assignment.id} className="opacity-75">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                      {assignment.title}
                    </CardTitle>
                    <CardDescription>
                      {Array.isArray(assignment.courses) ? assignment.courses[0]?.course_name : (assignment.courses as any)?.course_name}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Submitted:</span> {assignment.submission_date ? new Date(assignment.submission_date).toLocaleDateString() : 'N/A'}
                  </div>
                  {assignment.grade && (
                    <div>
                      <span className="font-medium">Grade:</span> {assignment.grade}%
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-4">
                  <Button variant="ghost" size="sm" onClick={() => onEdit?.(assignment)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDelete(assignment.id)}
                    disabled={deleting === assignment.id}
                  >
                    {deleting === assignment.id ? (
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
      )}
    </div>
  )
}
