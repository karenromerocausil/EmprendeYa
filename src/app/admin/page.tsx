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
    { label: 'Proyectos', value: projectsCount ?? 0, icon: FolderKanban, color: 'text-[#447A00]', bg: 'bg-[#EEF5E5]', href: '/admin/proyectos' },
    { label: 'Eventos', value: eventsCount ?? 0, icon: Calendar, color: 'text-[#014F78]', bg: 'bg-[#EAF3F7]', href: '/admin/eventos' },
    { label: 'Convocatorias', value: oppsCount ?? 0, icon: Target, color: 'text-[#447A00]', bg: 'bg-[#EEF5E5]', href: '/admin/convocatorias' },
    { label: 'Cursos', value: coursesCount ?? 0, icon: BookOpen, color: 'text-[#3B82A0]', bg: 'bg-[#EAF3F7]', href: '/admin/cursos' },
    { label: 'Usuarios', value: usersCount ?? 0, icon: Users, color: 'text-[#014F78]', bg: 'bg-[#EAF3F7]', href: '/admin/usuarios' },
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Admin Sidebar Header */}
      <div className="bg-[#163A4A] text-white p-6 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-3">
          <ShieldAlert className="w-6 h-6 text-[#6FAE2A]" />
          <span className="text-xl font-bold tracking-tight">Panel de Administración</span>
        </div>
        <Link href="/dashboard">
          <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10 gap-2">
            <LayoutDashboard className="w-4 h-4" /> Ir al Dashboard
          </Button>
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-12 space-y-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[#163A4A]">Resumen General</h1>
          <p className="text-[#475569] mt-1">Gestiona todo el contenido de la plataforma desde aquí.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
            <Link href={href} key={label}>
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer border-[#E2E8F0] hover:border-[#6FAE2A] bg-white rounded-2xl">
                <CardContent className="pt-6 pb-5">
                  <div className={`w-12 h-12 ${bg} ${color} rounded-2xl flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <p className="text-3xl font-extrabold text-[#163A4A]">{value}</p>
                  <p className="text-[#475569] text-sm font-medium mt-1">{label}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-[#163A4A] mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/admin/eventos/nuevo">
              <Button className="w-full h-14 bg-[#014F78] hover:bg-[#3B82A0] text-white font-semibold gap-3 text-base shadow-sm">
                <Calendar className="w-5 h-5" /> Crear Evento
              </Button>
            </Link>
            <Link href="/admin/convocatorias/nuevo">
              <Button className="w-full h-14 bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold gap-3 text-base shadow-sm">
                <Target className="w-5 h-5" /> Crear Convocatoria
              </Button>
            </Link>
            <Link href="/admin/cursos/nuevo">
              <Button className="w-full h-14 bg-[#3B82A0] hover:bg-[#014F78] text-white font-semibold gap-3 text-base shadow-sm">
                <BookOpen className="w-5 h-5" /> Crear Curso
              </Button>
            </Link>
            <Link href="/admin/proyectos">
              <Button variant="outline" className="w-full h-14 gap-3 text-base border-[#E2E8F0] text-[#163A4A] hover:bg-[#EEF5E5] font-semibold">
                <FolderKanban className="w-5 h-5 text-[#447A00]" /> Moderar Proyectos
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
