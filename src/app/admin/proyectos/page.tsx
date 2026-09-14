import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, PlusCircle } from 'lucide-react'
import { moderateProject } from '@/app/admin/actions'

export default async function AdminProyectosPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  const { data: projects } = await supabase
    .from('projects')
    .select('*, profiles(name), categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="rounded-full bg-white border shadow-sm">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-slate-900">Moderar Proyectos</h1>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr>
                <th className="text-left p-4 font-semibold text-slate-600">Proyecto</th>
                <th className="text-left p-4 font-semibold text-slate-600">Emprendedor</th>
                <th className="text-left p-4 font-semibold text-slate-600">Categoría</th>
                <th className="text-left p-4 font-semibold text-slate-600">Estado</th>
                <th className="text-left p-4 font-semibold text-slate-600">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {projects?.map(project => (
                <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <div className="font-semibold text-slate-900">{project.name}</div>
                    <div className="text-slate-500 text-xs mt-1">{project.location}</div>
                  </td>
                  <td className="p-4 text-slate-600">{project.profiles?.name}</td>
                  <td className="p-4 text-slate-600">{project.categories?.name}</td>
                  <td className="p-4">
                    {project.status === 'publicado' && <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">Publicado</span>}
                    {project.status === 'borrador' && <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold">Borrador</span>}
                    {project.status === 'oculto' && <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold">Oculto</span>}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {project.status !== 'publicado' && (
                        <form action={moderateProject}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <input type="hidden" name="status" value="publicado" />
                          <Button type="submit" size="sm" className="bg-green-600 hover:bg-green-700 h-8 text-xs">Publicar</Button>
                        </form>
                      )}
                      {project.status !== 'oculto' && (
                        <form action={moderateProject}>
                          <input type="hidden" name="projectId" value={project.id} />
                          <input type="hidden" name="status" value="oculto" />
                          <Button type="submit" size="sm" variant="outline" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50">Ocultar</Button>
                        </form>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {(!projects || projects.length === 0) && (
            <div className="text-center py-12 text-slate-400">No hay proyectos registrados.</div>
          )}
        </div>
      </div>
    </div>
  )
}
