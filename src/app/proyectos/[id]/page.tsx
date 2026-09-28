import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Tag, User, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { solicitarContacto } from './actions'
import { Navbar } from '@/components/Navbar'

export default async function ProyectoDetallePage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // 1. Fetch Project Details
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*, profiles(name, role), categories(name)')
    .eq('id', params.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // 2. Security Check: Only published projects can be viewed by others
  if (project.status !== 'publicado' && project.owner_id !== user?.id) {
    notFound()
  }

  // 3. Fetch user profile to check if they are an investor
  let isInvestor = false
  let alreadyRequested = false

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    isInvestor = profile?.role === 'inversor'
    
    // Check if a request already exists
    if (isInvestor) {
      const { data: req } = await supabase
        .from('contact_requests')
        .select('id, status')
        .eq('project_id', project.id)
        .eq('investor_id', user.id)
        .single()
      
      if (req) alreadyRequested = true
    }
  }

  // 4. Fetch Main Image
  const { data: image } = await supabase
    .from('project_images')
    .select('url')
    .eq('project_id', project.id)
    .eq('is_main', true)
    .single()

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <Navbar />
      {/* Banner / Header */}
      <div className="bg-gradient-to-r from-[#014F78] to-[#163A4A] w-full h-64 md:h-80 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        {image?.url && (
           <img src={image.url} alt={project.name} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        )}
        <div className="absolute top-6 left-6 z-10">
           <Link href="/proyectos">
             <Button className="bg-white text-[#014F78] hover:bg-[#EEF5E5] font-bold shadow-md border-0 rounded-full px-5 transition-colors">
               <ArrowLeft className="w-5 h-5 mr-2 text-[#014F78]" /> Volver al Directorio
             </Button>
           </Link>
        </div>
      </div>


      <main className="max-w-5xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border border-[#E2E8F0] bg-white p-2 md:p-4 rounded-2xl">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/20 rounded-full text-xs font-bold uppercase tracking-wider">
                     {project.stage}
                   </span>
                   <span className="flex items-center text-sm text-[#475569] gap-1">
                     <Tag className="w-4 h-4 text-[#3B82A0]" />
                     {project.categories?.name}
                   </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold text-[#163A4A] tracking-tight mb-4">{project.name}</h1>
                <p className="text-xl text-[#475569] font-medium mb-8 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="flex items-center gap-2 text-[#475569] mb-8 border-b border-[#E2E8F0] pb-8">
                  <MapPin className="w-5 h-5 text-[#3B82A0]" />
                  <span className="text-lg">{project.location}</span>
                </div>

                <div className="prose prose-slate max-w-none">
                  <h3 className="text-2xl font-bold text-[#163A4A] mb-4">Acerca del Emprendimiento</h3>
                  <div className="whitespace-pre-wrap text-[#475569] leading-relaxed text-lg">
                    {project.full_description || "El emprendedor aún no ha agregado una descripción detallada de este proyecto."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Call to Action */}
          <div className="space-y-6">
            <Card className="shadow-lg border border-[#E2E8F0] bg-white sticky top-24 rounded-2xl">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-[#EAF3F7] rounded-full flex items-center justify-center border-2 border-[#E2E8F0]">
                    <User className="w-6 h-6 text-[#014F78]" />
                  </div>
                  <div>
                    <p className="text-sm text-[#475569] font-medium uppercase tracking-wider">Emprendedor</p>
                    <p className="text-lg font-bold text-[#163A4A]">{project.profiles?.name || 'Usuario Anónimo'}</p>
                  </div>
                </div>

                <div className="border-t border-[#E2E8F0] pt-6">
                  <h4 className="font-semibold text-[#163A4A] mb-2">¿Te interesa este proyecto?</h4>
                  <p className="text-sm text-[#475569] mb-6">
                    Si eres inversor, puedes solicitar contacto directo con el emprendedor para conocer más sobre sus métricas y necesidades de capital.
                  </p>

                  {user ? (
                    isInvestor ? (
                      alreadyRequested ? (
                        <div className="bg-[#EEF5E5] text-[#447A00] p-4 rounded-xl flex items-start gap-3 border border-[#6FAE2A]/20">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5 text-[#447A00]" />
                          <div className="text-sm font-medium">
                            Ya has enviado una solicitud de contacto. El emprendedor se comunicará contigo pronto.
                          </div>
                        </div>
                      ) : (
                        <form action={async () => {
                          "use server"
                          await solicitarContacto(project.id)
                        }}>
                          <Button type="submit" size="lg" className="w-full bg-[#447A00] hover:bg-[#6FAE2A] text-white shadow-md shadow-[#447A00]/20 font-semibold transition-all">
                            <Mail className="w-5 h-5 mr-2" />
                            Me Interesa Contactar
                          </Button>
                        </form>
                      )
                    ) : (
                      <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0] flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-[#3B82A0] mt-0.5" />
                        <p className="text-sm text-[#475569]">
                          Tu cuenta es de tipo <strong>Emprendedor</strong>. Solo las cuentas de tipo Inversor pueden enviar solicitudes de contacto a otros proyectos.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-3">
                      <Link href="/login">
                        <Button className="w-full bg-[#014F78] hover:bg-[#3B82A0] text-white font-semibold">Inicia Sesión para Contactar</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" className="w-full border-[#E2E8F0] text-[#014F78] hover:bg-[#EAF3F7]">Crear una cuenta de Inversor</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

        </div>
      </main>
    </div>
  )
}
