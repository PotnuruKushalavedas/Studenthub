import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          bio: string | null
          profile_image_url: string | null
          phone: string | null
          location: string | null
          gpa: number | null
          graduation_date: string | null
          major: string | null
          skills: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          bio?: string | null
          profile_image_url?: string | null
          phone?: string | null
          location?: string | null
          gpa?: number | null
          graduation_date?: string | null
          major?: string | null
          skills?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          profile_image_url?: string | null
          phone?: string | null
          location?: string | null
          gpa?: number | null
          graduation_date?: string | null
          major?: string | null
          skills?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          technologies: string[]
          github_link: string | null
          live_link: string | null
          image_url: string | null
          start_date: string | null
          end_date: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          technologies?: string[]
          github_link?: string | null
          live_link?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          technologies?: string[]
          github_link?: string | null
          live_link?: string | null
          image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      internships: {
        Row: {
          id: string
          user_id: string
          company_name: string
          position: string
          description: string | null
          start_date: string
          end_date: string | null
          is_ongoing: boolean
          location: string | null
          skills_learned: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          company_name: string
          position: string
          description?: string | null
          start_date: string
          end_date?: string | null
          is_ongoing?: boolean
          location?: string | null
          skills_learned?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          company_name?: string
          position?: string
          description?: string | null
          start_date?: string
          end_date?: string | null
          is_ongoing?: boolean
          location?: string | null
          skills_learned?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      courses: {
        Row: {
          id: string
          user_id: string
          course_code: string
          course_name: string
          credits: number | null
          grade: string | null
          semester: string | null
          instructor: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_code: string
          course_name: string
          credits?: number | null
          grade?: string | null
          semester?: string | null
          instructor?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_code?: string
          course_name?: string
          credits?: number | null
          grade?: string | null
          semester?: string | null
          instructor?: string | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      assignments: {
        Row: {
          id: string
          user_id: string
          course_id: string
          title: string
          description: string | null
          due_date: string
          submission_date: string | null
          grade: number | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          title: string
          description?: string | null
          due_date: string
          submission_date?: string | null
          grade?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          title?: string
          description?: string | null
          due_date?: string
          submission_date?: string | null
          grade?: number | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      attendance: {
        Row: {
          id: string
          user_id: string
          course_id: string
          date: string
          status: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          course_id: string
          date: string
          status: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          course_id?: string
          date?: string
          status?: string
          created_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string
          total_projects: number
          completed_projects: number
          total_internships: number
          current_gpa: number | null
          total_assignments: number
          completed_assignments: number
          avg_attendance: number | null
          productivity_score: number
          last_updated: string
        }
        Insert: {
          id?: string
          user_id: string
          total_projects?: number
          completed_projects?: number
          total_internships?: number
          current_gpa?: number | null
          total_assignments?: number
          completed_assignments?: number
          avg_attendance?: number | null
          productivity_score?: number
          last_updated?: string
        }
        Update: {
          id?: string
          user_id?: string
          total_projects?: number
          completed_projects?: number
          total_internships?: number
          current_gpa?: number | null
          total_assignments?: number
          completed_assignments?: number
          avg_attendance?: number | null
          productivity_score?: number
          last_updated?: string
        }
      }
    }
    Views: {}
    Functions: {}
    Enums: {}
  }
}
