'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Database } from '@/lib/supabase'
import { Trash2, Edit2, Loader2, Building2, Calendar } from 'lucide-react'
import Link from 'next/link'

type Internship = Database['public']['Tables']['internships']['Row']

interface InternshipsListProps {
  onEdit?: (internship: Internship) => void
}

export function InternshipsList({ onEdit }: InternshipsListProps) {
  const { user } = useAuth()
  const [internships, setInternships] = useState<Internship[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return

    const fetchInternships = async () => {
      try {
        const { data, error } = await supabase
          .from('internships')
          .select('*')
          .eq('user_id', user.id)
          .order('start_date', { ascending: false })

        if (error) throw error
        setInternships(data || [])
      } catch (error) {
        console.error('Failed to fetch internships:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchInternships()
  }, [user])

  const handleDelete = async (internshipId: string) => {
    if (!confirm('Are you sure you want to delete this internship?')) return

    setDeleting(internshipId)
    try {
      const { error } = await supabase
        .from('internships')
        .delete()
        .eq('id', internshipId)

      if (error) throw error
      setInternships(internships.filter((i) => i.id !== internshipId))
    } catch (error) {
      console.error('Failed to delete internship:', error)
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

  if (internships.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <p className="text-gray-500 mb-4">No internships yet</p>
          <Link href="/dashboard/internships/new">
            <Button>Add Your First Internship</Button>
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {internships.map((internship) => (
        <Card key={internship.id}>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  {internship.position}
                </CardTitle>
                <CardDescription>{internship.company_name}</CardDescription>
              </div>
              {internship.is_ongoing && (
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                  Ongoing
                </span>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {internship.description && (
              <p className="text-gray-700">{internship.description}</p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{internship.start_date}</span>
                {internship.end_date && <span>to {internship.end_date}</span>}
              </div>
              {internship.location && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Location:</span> {internship.location}
                </div>
              )}
            </div>

            {internship.skills_learned && internship.skills_learned.length > 0 && (
              <div>
                <p className="text-sm font-medium mb-2">Skills Learned:</p>
                <div className="flex flex-wrap gap-2">
                  {internship.skills_learned.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(internship)}
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700"
                onClick={() => handleDelete(internship.id)}
                disabled={deleting === internship.id}
              >
                {deleting === internship.id ? (
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
