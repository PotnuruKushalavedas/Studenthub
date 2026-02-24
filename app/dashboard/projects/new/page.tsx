import { ProjectForm } from '@/components/project-form'

export default function NewProjectPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Create New Project</h1>
        <p className="text-gray-600 mt-2">Add your project details below</p>
      </div>

      <ProjectForm />
    </div>
  )
}
