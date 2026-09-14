import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FolderKanban, Calendar, Target, BookOpen, Users, ShieldAlert, LayoutDashboard } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') redirect('/dashboard')

  // Fetch counts for summary cards
  const [{ count: projectsCount }, { count: eventsCount }, { count: oppsCount }, { count: coursesCount }, { count: usersCount }] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('opportunities').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Proyectos', value: projectsCount ?? 0, icon: FolderKanban, color: 'text-indigo-600', bg: 'bg-indigo-50', href: '/admin/proyectos' },
    { label: 'Eventos', value: eventsCount ?? 0, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/eventos' },
    { label: 'Convocatorias', value: oppsCount ?? 0, icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/convocatorias' },
    { label: 'Cursos', value: coursesCount ?? 0, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-50', href: '/admin/cursos' },
    { label: 'Usuarios', value: usersCount ?? 0, icon: Users, color: 'text-violet-600', bg: 'bg-violet-50', href: '/admin/usuarios' },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Admin Sidebar Header */}
      <div className="bg-slate-900 text-white p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-indigo-400" />
          <span className="text-xl font-bold tracking-tight">Panel de Administración</span>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2">
            <LayoutDashboard className="w-4 h-4" /> Ir al Dashboard
          </Button>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">Resumen General</h1>
          <p className="text-slate-500 mt-1">Gestiona todo el contenido de la plataforma desde aquí.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
            <Link href={href} key={label}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-slate-100 bg-white">
                <CardContent className="pt-6 pb-5">
                  <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-extrabold text-slate-900">{value}</p>
                  <p className="text-slate-500 text-sm font-medium mt-1">{label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/eventos/nuevo">
              <Button className="w-full h-14 bg-blue-600 hover:bg-blue-700 gap-3 text-base">
                <Calendar className="w-5 h-5" /> Crear Evento
              </Button>
            </Link>
            <Link href="/admin/convocatorias/nuevo">
              <Button className="w-full h-14 bg-emerald-600 hover:bg-emerald-700 gap-3 text-base">
                <Target className="w-5 h-5" /> Crear Convocatoria
              </Button>
            </Link>
            <Link href="/admin/cursos/nuevo">
              <Button className="w-full h-14 bg-amber-600 hover:bg-amber-700 gap-3 text-base">
                <BookOpen className="w-5 h-5" /> Crear Curso
              </Button>
            </Link>
            <Link href="/admin/proyectos">
              <Button variant="outline" className="w-full h-14 gap-3 text-base border-slate-200">
                <FolderKanban className="w-5 h-5" /> Moderar Proyectos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
