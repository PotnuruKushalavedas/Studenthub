import { AttendanceForm } from '@/components/attendance-form'

interface EditAttendancePageProps {
  params: Promise<{ id: string }>
}

export default async function EditAttendancePage({ params }: EditAttendancePageProps) {
  const { id } = await params
  return (
    <div className="p-8 max-w-2xl">
      <AttendanceForm recordId={id} isEditing={true} />
    </div>
  )
}
