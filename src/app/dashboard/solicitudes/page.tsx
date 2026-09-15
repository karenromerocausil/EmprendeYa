import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, User, Clock, CheckCircle2, XCircle } from 'lucide-react'

export default async function SolicitudesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'emprendedor') redirect('/dashboard')

  // Fetch incoming requests for this user's projects
  const { data: solicitudes } = await supabase
    .from('contact_requests')
    .select(`
      id, status, created_at,
      projects!inner(name, owner_id),
      profiles!investor_id(name, city)
    `)
    .eq('projects.owner_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full bg-[#EAF3F7] border border-[#3B82A0]/30 shadow-sm text-[#014F78] hover:bg-[#014F78] hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Bandeja de Inversores</h1>
            <p className="text-slate-500">Solicitudes de contacto recibidas en tus proyectos</p>
          </div>
        </div>

        {(!solicitudes || solicitudes.length === 0) ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center">
             <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h2 className="text-xl font-semibold text-slate-900 mb-2">Aún no tienes solicitudes</h2>
             <p className="text-slate-500 max-w-md mx-auto">Cuando un inversor se interese en alguno de tus proyectos, aparecerá aquí su solicitud de contacto.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((sol: any) => (
              <Card key={sol.id} className="border-slate-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-slate-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-slate-900">
                        {sol.profiles?.name || 'Inversor Anónimo'}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mt-1">
                        Proyecto: <strong className="text-[#014F78]">{sol.projects?.name}</strong>
                      </CardDescription>
                    </div>
                    {sol.status === 'pendiente' && <span className="px-3 py-1 bg-[#EAF3F7] text-[#014F78] border border-[#3B82A0]/20 rounded-full text-xs font-bold uppercase">Pendiente</span>}
                    {sol.status === 'aceptada' && <span className="px-3 py-1 bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/20 rounded-full text-xs font-bold uppercase">Aceptada</span>}
                    {sol.status === 'rechazada' && <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase">Rechazada</span>}
                  </div>
                </CardHeader>
                <CardContent className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-[#475569]">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(sol.created_at).toLocaleDateString()}</span>
                    <span>📍 {sol.profiles?.city || 'Ubicación no especificada'}</span>
                  </div>
                  
                  {sol.status === 'pendiente' ? (
                    <div className="flex gap-2 w-full sm:w-auto">
                      <Button variant="outline" className="w-full sm:w-auto text-red-600 hover:bg-red-50 hover:text-red-700 border-[#E2E8F0]">Rechazar</Button>
                      <Button className="w-full sm:w-auto bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold">Aceptar y Ver Contacto</Button>
                    </div>
                  ) : sol.status === 'aceptada' ? (
                    <Button variant="secondary" className="w-full sm:w-auto bg-[#EAF3F7] text-[#014F78] hover:bg-[#3B82A0] hover:text-white">Ver Datos de Contacto</Button>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
