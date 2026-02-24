'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Trash2, Edit2, ExternalLink, Github, Loader2 } from 'lucide-react'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectsListProps {
  onEdit?: (project: Project) => void
}

export function ProjectsList({ onEdit }: ProjectsListProps) {
  const { user } = useAuth()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setProjects(data || [])
      } catch (error) {
        console.error('Failed to fetch projects:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    setDeleting(projectId)
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)

      if (error) throw error
      setProjects(projects.filter((p) => p.id !== projectId))
    } catch (error) {
      console.error('Failed to delete project:', error)
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

  if (projects.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No projects yet</p>
          <Link href="/dashboard/projects/new">
            <Button>Create Your First Project</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <Card key={project.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  project.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}
              >
                {project.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {project.technologies && project.technologies.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}

            <div className="flex gap-4 text-sm text-gray-600">
              {project.start_date && (
                <div>
                  <span className="font-medium">Start:</span> {project.start_date}
                </div>
              )}
              {project.end_date && (
                <div>
                  <span className="font-medium">End:</span> {project.end_date}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-4">
              {project.github_link && (
                <a href={project.github_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <Github className="w-4 h-4 mr-2" />
                    GitHub
                  </Button>
                </a>
              )}
              {project.live_link && (
                <a href={project.live_link} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Live
                  </Button>
                </a>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(project)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(project.id)}
                disabled={deleting === project.id}
              >
                {deleting === project.id ? (
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
