import { ProfileForm } from '@/components/profile-form'

export default function ProfilePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your personal information</p>
      </div>

      <ProfileForm />
    </div>
  )
}
