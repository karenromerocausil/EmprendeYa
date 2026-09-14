import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Tag, User, ArrowLeft, Mail, CheckCircle2, AlertCircle } from 'lucide-react'
import { solicitarContacto } from './actions'

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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Banner / Header */}
      <div className="bg-indigo-900 w-full h-64 md:h-80 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        {image?.url && (
           <img src={image.url} alt={project.name} className="w-full h-full object-cover opacity-40 mix-blend-overlay" />
        )}
        <div className="absolute top-6 left-6 z-10">
           <Link href="/proyectos">
             <Button variant="ghost" className="text-white hover:bg-white/20 hover:text-white rounded-full">
               <ArrowLeft className="w-5 h-5 mr-2" /> Volver al Directorio
             </Button>
           </Link>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 -mt-32 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            <Card className="shadow-lg border-0 p-2 md:p-4">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                   <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase tracking-wider">
                     {project.stage}
                   </span>
                   <span className="flex items-center text-sm text-slate-500 gap-1">
                     <Tag className="w-4 h-4 text-slate-400" />
                     {project.categories?.name}
                   </span>
                </div>
                
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">{project.name}</h1>
                <p className="text-xl text-slate-600 font-medium mb-8 leading-relaxed">
                  {project.short_description}
                </p>

                <div className="flex items-center gap-2 text-slate-500 mb-8 border-b border-slate-100 pb-8">
                  <MapPin className="w-5 h-5 text-indigo-500" />
                  <span className="text-lg">{project.location}</span>
                </div>

                <div className="prose prose-slate max-w-none">
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">Acerca del Emprendimiento</h3>
                  <div className="whitespace-pre-wrap text-slate-600 leading-relaxed text-lg">
                    {project.full_description || "El emprendedor aún no ha agregado una descripción detallada de este proyecto."}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Call to Action */}
          <div className="space-y-6">
            <Card className="shadow-lg border-0 sticky top-24">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center border-2 border-indigo-100">
                    <User className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Emprendedor</p>
                    <p className="text-lg font-bold text-slate-900">{project.profiles?.name || 'Usuario Anónimo'}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-6">
                  <h4 className="font-semibold text-slate-900 mb-2">¿Te interesa este proyecto?</h4>
                  <p className="text-sm text-slate-500 mb-6">
                    Si eres inversor, puedes solicitar contacto directo con el emprendedor para conocer más sobre sus métricas y necesidades de capital.
                  </p>

                  {user ? (
                    isInvestor ? (
                      alreadyRequested ? (
                        <div className="bg-green-50 text-green-700 p-4 rounded-xl flex items-start gap-3 border border-green-100">
                          <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                          <div className="text-sm font-medium">
                            Ya has enviado una solicitud de contacto. El emprendedor se comunicará contigo pronto.
                          </div>
                        </div>
                      ) : (
                        <form action={async () => {
                          "use server"
                          await solicitarContacto(project.id)
                        }}>
                          <Button type="submit" size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 shadow-md">
                            <Mail className="w-5 h-5 mr-2" />
                            Me Interesa Contactar
                          </Button>
                        </form>
                      )
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 shrink-0 text-amber-500 mt-0.5" />
                        <p className="text-sm text-slate-600">
                          Tu cuenta es de tipo <strong>Emprendedor</strong>. Solo las cuentas de tipo Inversor pueden enviar solicitudes de contacto a otros proyectos.
                        </p>
                      </div>
                    )
                  ) : (
                    <div className="space-y-3">
                      <Link href="/login">
                        <Button className="w-full bg-slate-900 hover:bg-slate-800 text-white">Inicia Sesión para Contactar</Button>
                      </Link>
                      <Link href="/register">
                        <Button variant="outline" className="w-full">Crear una cuenta de Inversor</Button>
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
