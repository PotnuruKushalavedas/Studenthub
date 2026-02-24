'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Database } from '@/lib/supabase'
import { Loader2, ChevronLeft } from 'lucide-react'
import Link from 'next/link'

type Project = Database['public']['Tables']['projects']['Row']

interface ProjectFormProps {
  projectId?: string
}

export function ProjectForm({ projectId }: ProjectFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(!!projectId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    technologies: [],
    github_link: '',
    live_link: '',
    status: 'ongoing',
    start_date: '',
    end_date: '',
  })

  useEffect(() => {
    if (!projectId || !user) return

    const fetchProject = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('id', projectId)
          .eq('user_id', user.id)
          .single()

        if (error) throw error
        setFormData(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [projectId, user])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      if (projectId) {
        const { error } = await supabase
          .from('projects')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', projectId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('projects')
          .insert({
            ...formData,
            user_id: user.id,
          } as any)

        if (error) throw error
      }

      router.push('/dashboard/projects')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>{projectId ? 'Edit Project' : 'Create New Project'}</CardTitle>
        <CardDescription>
          {projectId ? 'Update your project details' : 'Add a new project to your portfolio'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Project Title *</label>
            <Input
              value={formData.title || ''}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="My Awesome Project"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what your project does..."
              rows={4}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Technologies (comma-separated)</label>
            <Input
              value={formData.technologies?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  technologies: e.target.value.split(',').map((t) => t.trim()),
                })
              }
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date</label>
              <Input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">GitHub Link</label>
            <Input
              type="url"
              value={formData.github_link || ''}
              onChange={(e) => setFormData({ ...formData, github_link: e.target.value })}
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Live Link</label>
            <Input
              type="url"
              value={formData.live_link || ''}
              onChange={(e) => setFormData({ ...formData, live_link: e.target.value })}
              placeholder="https://myproject.com"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Status</label>
            <select
              value={formData.status || 'ongoing'}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="paused">Paused</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/dashboard/projects" className="flex-1">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : projectId ? 'Update Project' : 'Create Project'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
