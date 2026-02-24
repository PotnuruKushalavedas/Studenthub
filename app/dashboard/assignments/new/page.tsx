import { AssignmentForm } from '@/components/assignment-form'

export default function NewAssignmentPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Assignment</h1>
        <p className="text-gray-600 mt-2">Record a new assignment</p>
      </div>

      <AssignmentForm />
    </div>
  )
}
