import { InternshipForm } from '@/components/internship-form'

export default function NewInternshipPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Add Internship</h1>
        <p className="text-gray-600 mt-2">Record your internship experience</p>
      </div>

      <InternshipForm />
    </div>
  )
}
