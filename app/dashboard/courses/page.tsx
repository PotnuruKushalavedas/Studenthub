'use client'

import { useState } from 'react'
import { CoursesList } from '@/components/courses-list'
import { CourseForm } from '@/components/course-form'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Course = Database['public']['Tables']['courses']['Row']

export default function CoursesPage() {
  const [editingCourse, setEditingCourse] = useState<Course | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Courses</h1>
          <p className="text-gray-600 mt-2">Manage your enrolled courses and grades</p>
        </div>
        <Link href="/dashboard/courses/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Course
          </Button>
        </Link>
      </div>

      {editingCourse ? (
        <div>
          <CourseForm courseId={editingCourse.id} />
        </div>
      ) : (
        <CoursesList onEdit={setEditingCourse} />
      )}
    </div>
  )
}
