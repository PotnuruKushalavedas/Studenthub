'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  User,
  Briefcase,
  FolderOpen,
  BookOpen,
  ClipboardList,
  BarChart3,
  Settings,
  Calendar,
} from 'lucide-react'

const navigationItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: User, label: 'Profile', href: '/dashboard/profile' },
  { icon: BookOpen, label: 'Courses', href: '/dashboard/courses' },
  { icon: ClipboardList, label: 'Assignments', href: '/dashboard/assignments' },
  { icon: FolderOpen, label: 'Projects', href: '/dashboard/projects' },
  { icon: Briefcase, label: 'Internships', href: '/dashboard/internships' },
  { icon: Calendar, label: 'Attendance', href: '/dashboard/attendance' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard/analytics' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen sticky top-0 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-indigo-600 dark:text-indigo-300 font-bold">S</span>
          </div>
          <span className="text-xl font-bold">StudentHub</span>
        </div>

        <nav className="space-y-2">
          {navigationItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (pathname.startsWith(item.href) && item.href !== '/dashboard')

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300'
                  : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}
