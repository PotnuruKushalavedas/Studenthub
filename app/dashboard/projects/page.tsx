'use client'

import { useState } from 'react'
import { ProjectsList } from '@/components/projects-list'
import { ProjectForm } from '@/components/project-form'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Plus } from 'lucide-react'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']

export default function ProjectsPage() {
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-gray-600 mt-2">Showcase your work and portfolio projects</p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        </Link>
      </div>

      {editingProject ? (
        <div>
          <ProjectForm projectId={editingProject.id} />
        </div>
      ) : (
        <ProjectsList onEdit={setEditingProject} />
      )}
    </div>
  )
}
