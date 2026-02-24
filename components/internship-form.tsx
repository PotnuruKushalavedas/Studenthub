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

type Internship = Database['public']['Tables']['internships']['Row']

interface InternshipFormProps {
  internshipId?: string
}

export function InternshipForm({ internshipId }: InternshipFormProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(!!internshipId)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Internship>>({
    company_name: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_ongoing: false,
    location: '',
    skills_learned: [],
  })

  useEffect(() => {
    if (!internshipId || !user) return

    const fetchInternship = async () => {
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('id', internshipId)
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

    fetchInternship()
  }, [internshipId, user])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    setError(null)

    try {
      if (internshipId) {
        const { error } = await supabase
          .from('internships')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', internshipId)

        if (error) throw error
      } else {
        const { error } = await supabase
          .from('internships')
          .insert({
            ...formData,
            user_id: user.id,
          } as any)

        if (error) throw error
      }

      router.push('/dashboard/internships')
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
        <CardTitle>{internshipId ? 'Edit Internship' : 'Add Internship'}</CardTitle>
        <CardDescription>
          {internshipId ? 'Update your internship details' : 'Record your internship experience'}
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
            <label className="text-sm font-medium">Company Name *</label>
            <Input
              value={formData.company_name || ''}
              onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
              placeholder="Tech Company Inc."
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Position *</label>
            <Input
              value={formData.position || ''}
              onChange={(e) => setFormData({ ...formData, position: e.target.value })}
              placeholder="Software Engineer Intern"
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your responsibilities and achievements..."
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start Date *</label>
              <Input
                type="date"
                value={formData.start_date || ''}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">End Date</label>
              <Input
                type="date"
                value={formData.end_date || ''}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                disabled={formData.is_ongoing}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="ongoing"
              checked={formData.is_ongoing || false}
              onChange={(e) => setFormData({ ...formData, is_ongoing: e.target.checked })}
              className="rounded"
            />
            <label htmlFor="ongoing" className="text-sm font-medium cursor-pointer">
              I'm currently in this internship
            </label>
          </div>

          <div>
            <label className="text-sm font-medium">Location</label>
            <Input
              value={formData.location || ''}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="City, State"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Skills Learned (comma-separated)</label>
            <Input
              value={formData.skills_learned?.join(', ') || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  skills_learned: e.target.value.split(',').map((s) => s.trim()),
                })
              }
              placeholder="Python, Data Analysis, SQL"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link href="/dashboard/internships" className="flex-1">
            <Button variant="outline" className="w-full">
              <ChevronLeft className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </Link>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {saving ? 'Saving...' : internshipId ? 'Update Internship' : 'Add Internship'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
