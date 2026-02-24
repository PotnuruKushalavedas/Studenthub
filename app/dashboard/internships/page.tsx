'use client'

import { useState } from 'react'
import { InternshipsList } from '@/components/internships-list'
import { InternshipForm } from '@/components/internship-form'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Internship = Database['public']['Tables']['internships']['Row']

export default function InternshipsPage() {
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Internships</h1>
          <p className="text-gray-600 mt-2">Track your work experience and internships</p>
        </div>
        <Link href="/dashboard/internships/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Internship
          </Button>
        </Link>
      </div>

      {editingInternship ? (
        <div>
          <InternshipForm internshipId={editingInternship.id} />
        </div>
      ) : (
        <InternshipsList onEdit={setEditingInternship} />
      )}
    </div>
  )
}
