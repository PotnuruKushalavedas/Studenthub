import { CourseForm } from '@/components/course-form'

export default function NewCoursePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Course</h1>
        <p className="text-gray-600 mt-2">Record a new course enrollment</p>
      </div>

      <CourseForm />
    </div>
  )
}
