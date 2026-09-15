import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { PlusCircle, Image as ImageIcon, MapPin, Tag } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ProyectosPage() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Get user profile
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  
  if (profile?.role !== 'emprendedor') {
    redirect('/dashboard')
  }

  // Fetch user projects
  const { data: projects } = await supabase
    .from('projects')
    .select('*, categories(name)')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  // Fetch images for these projects
  const projectIds = projects?.map(p => p.id) || []
  const { data: images } = await supabase
    .from('project_images')
    .select('*')
    .in('project_id', projectIds)
    .eq('is_main', true)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'publicado': return <span className="px-2.5 py-1 bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/30 rounded-full text-xs font-bold">Publicado</span>;
      case 'oculto': return <span className="px-2.5 py-1 bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] rounded-full text-xs font-semibold">Oculto</span>;
      default: return <span className="px-2.5 py-1 bg-[#EAF3F7] text-[#014F78] border border-[#3B82A0]/20 rounded-full text-xs font-bold">Borrador</span>;
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-12">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#E2E8F0]">
          <div>
            <h1 className="text-3xl font-bold text-[#163A4A]">Mis Proyectos</h1>
            <p className="text-[#475569] mt-1">Gestiona los emprendimientos que has creado</p>
          </div>
          <div className="flex gap-3">
             <Link href="/dashboard">
               <Button variant="outline" className="border-[#E2E8F0] text-[#014F78] hover:bg-[#EAF3F7]">Volver</Button>
             </Link>
             <Link href="/dashboard/proyectos/nuevo">
               <Button className="bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold gap-2 shadow-sm">
                 <PlusCircle className="w-4 h-4" />
                 Nuevo Proyecto
               </Button>
             </Link>
          </div>
        </div>

        {(!projects || projects.length === 0) ? (
          <div className="bg-white border border-[#E2E8F0] border-dashed rounded-2xl p-12 text-center">
            <div className="w-16 h-16 bg-[#EEF5E5] text-[#447A00] rounded-full flex items-center justify-center mx-auto mb-4">
              <PlusCircle className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#163A4A] mb-2">Aún no tienes proyectos</h2>
            <p className="text-[#475569] max-w-md mx-auto mb-6">Crea tu primer proyecto para que los inversores puedan descubrir tu emprendimiento y conectar contigo.</p>
            <Link href="/dashboard/proyectos/nuevo">
              <Button className="bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold shadow-md">Crear mi primer proyecto</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => {
              const mainImage = images?.find(img => img.project_id === project.id)?.url
              return (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg hover:border-[#6FAE2A] transition-all border-[#E2E8F0] flex flex-col bg-white rounded-2xl">
                  <div className="h-48 bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
                    {mainImage ? (
                      <img src={mainImage} alt={project.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="w-12 h-12 text-slate-300" />
                    )}
                    <div className="absolute top-3 right-3">
                      {getStatusBadge(project.status)}
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-1">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{project.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="flex items-center text-xs text-slate-500 gap-2">
                      <Tag className="w-4 h-4" />
                      <span>{project.categories?.name || 'Sin categoría'}</span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{project.location || 'Ubicación no definida'}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-50 gap-2">
                     <Button variant="outline" className="w-full">Editar</Button>
                     <Button variant="secondary" className="w-full">Ver Detalles</Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
