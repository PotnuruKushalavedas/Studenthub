'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Loader2, Download } from 'lucide-react'
import { toast } from 'sonner'
import jsPDF from 'jspdf'

interface ExportData {
  profile: any
  projects: any[]
  internships: any[]
  courses: any[]
  assignments: any[]
  attendance: any[]
}

export function ExportDataButton() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)

  const fetchAllData = async (): Promise<ExportData | null> => {
    if (!user) return null

    try {
      const [
        { data: profile },
        { data: projects },
        { data: internships },
        { data: courses },
        { data: assignments },
        { data: attendance },
      ] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', user.id).single(),
        supabase.from('projects').select('*').eq('user_id', user.id),
        supabase.from('internships').select('*').eq('user_id', user.id),
        supabase.from('courses').select('*').eq('user_id', user.id),
        supabase.from('assignments').select('*').eq('user_id', user.id),
        supabase.from('attendance').select('*').eq('user_id', user.id),
      ])

      return {
        profile: profile || {},
        projects: projects || [],
        internships: internships || [],
        courses: courses || [],
        assignments: assignments || [],
        attendance: attendance || [],
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      return null
    }
  }

  const generatePDF = async () => {
    const data = await fetchAllData()
    if (!data) {
      toast.error('Failed to fetch your data')
      return
    }

    try {
      const pdf = new jsPDF()
      let yPosition = 20
      const pageHeight = pdf.internal.pageSize.getHeight()
      const margin = 20
      const lineHeight = 7

      const addSection = (title: string) => {
        if (yPosition > pageHeight - 30) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.setFontSize(14)
        pdf.setFont(undefined, 'bold')
        pdf.text(title, margin, yPosition)
        yPosition += 10
        pdf.setFontSize(10)
        pdf.setFont(undefined, 'normal')
      }

      const addText = (label: string, value: any) => {
        if (yPosition > pageHeight - 15) {
          pdf.addPage()
          yPosition = 20
        }
        pdf.text(`${label}: ${value || 'N/A'}`, margin, yPosition)
        yPosition += lineHeight
      }

      // Title
      pdf.setFontSize(18)
      pdf.setFont(undefined, 'bold')
      pdf.text('Student Dashboard Export', margin, yPosition)
      yPosition += 15

      // Profile Section
      addSection('Profile Information')
      if (data.profile) {
        addText('Name', data.profile.full_name)
        addText('Email', data.profile.email)
        addText('Major', data.profile.major)
        addText('GPA', data.profile.gpa)
        addText('Graduation Date', data.profile.graduation_date)
        addText('Location', data.profile.location)
        addText('Phone', data.profile.phone)
        if (data.profile.skills?.length > 0) {
          addText('Skills', data.profile.skills.join(', '))
        }
      }

      // Projects Section
      if (data.projects.length > 0) {
        addSection(`Projects (${data.projects.length})`)
        data.projects.forEach((project, idx) => {
          addText(`Project ${idx + 1}: ${project.title}`, '')
          yPosition += 2
          if (project.description) {
            const lines = pdf.splitTextToSize(project.description, 150)
            lines.forEach((line: string) => {
              if (yPosition > pageHeight - 15) {
                pdf.addPage()
                yPosition = 20
              }
              pdf.text(line, margin + 5, yPosition)
              yPosition += lineHeight
            })
          }
          if (project.technologies?.length > 0) {
            addText('  Technologies', project.technologies.join(', '))
          }
          yPosition += 3
        })
      }

      // Internships Section
      if (data.internships.length > 0) {
        addSection(`Internships (${data.internships.length})`)
        data.internships.forEach((internship, idx) => {
          addText(`Internship ${idx + 1}: ${internship.position} at ${internship.company_name}`, '')
          yPosition += 2
          addText('  Duration', `${internship.start_date} to ${internship.end_date || 'Present'}`)
          if (internship.skills_learned?.length > 0) {
            addText('  Skills Learned', internship.skills_learned.join(', '))
          }
          yPosition += 3
        })
      }

      // Courses Section
      if (data.courses.length > 0) {
        addSection(`Courses (${data.courses.length})`)
        data.courses.forEach((course) => {
          addText(`${course.course_code}: ${course.course_name}`, `Grade: ${course.grade || 'N/A'}`)
        })
      }

      // Attendance Summary
      if (data.attendance.length > 0) {
        addSection('Attendance Summary')
        const courseAttendance: Record<string, { total: number; present: number }> = {}
        data.attendance.forEach((record) => {
          if (!courseAttendance[record.course_id]) {
            courseAttendance[record.course_id] = { total: 0, present: 0 }
          }
          courseAttendance[record.course_id].total += 1
          if (record.status === 'present') courseAttendance[record.course_id].present += 1
        })

        Object.entries(courseAttendance).forEach(([courseId, stats]) => {
          const percentage = ((stats.present / stats.total) * 100).toFixed(1)
          addText(`Course: ${stats.present}/${stats.total} (${percentage}%)`, '')
        })
      }

      // Assignments Summary
      if (data.assignments.length > 0) {
        addSection(`Assignments Summary (${data.assignments.length})`)
        const completed = data.assignments.filter(a => a.status === 'completed').length
        addText('Completed', `${completed}/${data.assignments.length}`)
      }

      // Footer
      const now = new Date()
      pdf.setFontSize(8)
      pdf.text(
        `Generated on ${now.toLocaleDateString()} at ${now.toLocaleTimeString()}`,
        margin,
        pageHeight - 10
      )

      pdf.save(`student-data-${new Date().getTime()}.pdf`)
      toast.success('Data exported successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF')
    }
  }

  const generateJSON = async () => {
    const data = await fetchAllData()
    if (!data) {
      toast.error('Failed to fetch your data')
      return
    }

    try {
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `student-data-${new Date().getTime()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Data exported as JSON!')
    } catch (error) {
      console.error('Error generating JSON:', error)
      toast.error('Failed to generate JSON')
    }
  }

  const handleExportPDF = async () => {
    setLoading(true)
    try {
      await generatePDF()
    } finally {
      setLoading(false)
    }
  }

  const handleExportJSON = async () => {
    setLoading(true)
    try {
      await generateJSON()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex gap-3">
      <Button
        onClick={handleExportPDF}
        disabled={loading}
        className="gap-2"
        variant="outline"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export as PDF
      </Button>
      <Button
        onClick={handleExportJSON}
        disabled={loading}
        className="gap-2"
        variant="outline"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Download className="w-4 h-4" />
        )}
        Export as JSON
      </Button>
    </div>
  )
}
