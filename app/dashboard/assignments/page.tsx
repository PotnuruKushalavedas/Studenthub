'use client'

import { useState } from 'react'
import { AssignmentsList } from '@/components/assignments-list'
import { AssignmentForm } from '@/components/assignment-form'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Assignment = Database['public']['Tables']['assignments']['Row']

export default function AssignmentsPage() {
  const [editingAssignment, setEditingAssignment] = useState<Assignment | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Assignments</h1>
          <p className="text-gray-600 mt-2">Track your assignments and grades</p>
        </div>
        <Link href="/dashboard/assignments/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Assignment
          </Button>
        </Link>
      </div>

      {editingAssignment ? (
        <div>
          <AssignmentForm assignmentId={editingAssignment.id} />
        </div>
      ) : (
        <AssignmentsList onEdit={setEditingAssignment} />
      )}
    </div>
  )
}
