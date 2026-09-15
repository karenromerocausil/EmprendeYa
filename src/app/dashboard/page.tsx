import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut, User, FolderKanban, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Panel de Control',
  description: 'Gestiona tu perfil, proyectos y oportunidades en EmprendeYa.',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  // Get profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div id="main-content" className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Panel de Control</h1>
            <p className="text-slate-500 mt-1">Gestiona tu perfil y oportunidades</p>
          </div>
          <form action={signout}>
            <Button variant="outline" type="submit" className="gap-2 font-medium">
              <LogOut className="h-4 w-4" />
              Cerrar Sesión
            </Button>
          </form>
        </div>
        
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-500 to-blue-600 p-8 rounded-2xl text-white shadow-md">
          <h2 className="text-2xl font-semibold mb-2">¡Hola, {profile?.name || user.email}! 👋</h2>
          <p className="text-indigo-100 mb-4">
            Has iniciado sesión con el rol de: <span className="font-bold bg-white/20 px-3 py-1 rounded-full uppercase text-xs tracking-wider ml-2">{profile?.role || 'Desconocido'}</span>
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-900">Mi Perfil</h3>
              <p className="text-slate-500 text-sm mb-6 line-clamp-2">Completa tu información personal, foto de perfil e intereses.</p>
              <Button variant="secondary" className="w-full">Editar Perfil</Button>
           </div>

           {profile?.role === 'emprendedor' && (
             <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <FolderKanban className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-slate-900">Mis Proyectos</h3>
               <p className="text-slate-500 text-sm mb-6 line-clamp-2">Gestiona tus emprendimientos y visualiza solicitudes de inversores.</p>
               <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Ir a Proyectos</Button>
             </div>
           )}

           {profile?.role === 'inversor' && (
             <div className="bg-white p-6 border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
               <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Star className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-semibold mb-2 text-slate-900">Guardados</h3>
               <p className="text-slate-500 text-sm mb-6 line-clamp-2">Revisa los emprendimientos en los que has mostrado interés.</p>
               <Button className="w-full bg-indigo-600 hover:bg-indigo-700">Ver Proyectos</Button>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
