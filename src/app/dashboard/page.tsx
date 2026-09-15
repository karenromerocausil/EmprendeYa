import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { signout } from '@/app/auth/actions'
import { Button } from '@/components/ui/button'
import { LogOut, User, FolderKanban, Star } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Panel de Control',
  description: 'Gestiona tu perfil, proyectos y oportunidades en INNOVA LINK.',
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
        <div className="bg-gradient-to-r from-[#447A00] via-[#014F78] to-[#163A4A] p-8 rounded-2xl text-white shadow-md">
          <h2 className="text-2xl font-bold mb-2">¡Hola, {profile?.name || user.email}! 👋</h2>
          <p className="text-[#EAF3F7] mb-4">
            Has iniciado sesión con el rol de: <span className="font-bold bg-white/20 px-3 py-1 rounded-full uppercase text-xs tracking-wider ml-2">{profile?.role || 'Desconocido'}</span>
          </p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           <div className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#3B82A0] transition-all group">
              <div className="w-12 h-12 bg-[#EAF3F7] text-[#014F78] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <User className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-[#163A4A]">Mi Perfil</h3>
              <p className="text-[#475569] text-sm mb-6 line-clamp-2">Completa tu información personal, foto de perfil e intereses.</p>
              <Link href="/perfil">
                <Button variant="secondary" className="w-full bg-[#EAF3F7] text-[#014F78] hover:bg-[#3B82A0] hover:text-white font-semibold">Editar Perfil</Button>
              </Link>
           </div>

           {profile?.role === 'emprendedor' && (
             <div className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#6FAE2A] transition-all group">
               <div className="w-12 h-12 bg-[#EEF5E5] text-[#447A00] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <FolderKanban className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-[#163A4A]">Mis Proyectos</h3>
               <p className="text-[#475569] text-sm mb-6 line-clamp-2">Gestiona tus emprendimientos y visualiza solicitudes de inversores.</p>
               <Link href="/dashboard/proyectos">
                 <Button className="w-full bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold">Ir a Proyectos</Button>
               </Link>
             </div>
           )}

           {profile?.role === 'inversor' && (
             <div className="bg-white p-6 border border-[#E2E8F0] rounded-2xl shadow-sm hover:shadow-md hover:border-[#3B82A0] transition-all group">
               <div className="w-12 h-12 bg-[#EAF3F7] text-[#014F78] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                 <Star className="h-6 w-6" />
               </div>
               <h3 className="text-xl font-bold mb-2 text-[#163A4A]">Mis Inversiones</h3>
               <p className="text-[#475569] text-sm mb-6 line-clamp-2">Revisa los emprendimientos en los que has mostrado interés.</p>
               <Link href="/dashboard/inversiones">
                 <Button className="w-full bg-[#014F78] hover:bg-[#3B82A0] text-white font-semibold">Ver Proyectos</Button>
               </Link>
             </div>
           )}
        </div>
      </div>
    </div>
  )
}
