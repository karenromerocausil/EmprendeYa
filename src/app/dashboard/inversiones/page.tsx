import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Rocket, ExternalLink } from 'lucide-react'

export default async function InversionesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'inversor') redirect('/dashboard')

  // Fetch outgoing requests for this investor
  const { data: solicitudes } = await supabase
    .from('contact_requests')
    .select(`
      id, status, created_at,
      projects(id, name)
    `)
    .eq('investor_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="rounded-full bg-white border hover:bg-slate-100 shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Mis Intereses</h1>
            <p className="text-slate-500">Historial de proyectos que has solicitado contactar</p>
          </div>
        </div>

        {(!solicitudes || solicitudes.length === 0) ? (
          <div className="bg-white border border-slate-200 border-dashed rounded-2xl p-12 text-center">
             <Rocket className="w-12 h-12 text-slate-300 mx-auto mb-4" />
             <h2 className="text-xl font-semibold text-slate-900 mb-2">Aún no has interactuado con proyectos</h2>
             <p className="text-slate-500 max-w-md mx-auto mb-6">Explora el directorio y encuentra emprendimientos innovadores para apoyar.</p>
             <Link href="/proyectos">
               <Button className="bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold">Explorar Directorio</Button>
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((sol: any) => (
              <Card key={sol.id} className="border-[#E2E8F0] hover:shadow-md transition-shadow bg-white rounded-2xl">
                <CardHeader className="pb-3 border-b border-[#E2E8F0] flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-[#163A4A]">{sol.projects?.name}</CardTitle>
                    <CardDescription className="text-[#475569]">
                      Solicitado el {new Date(sol.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {sol.status === 'pendiente' && <span className="px-3 py-1 bg-[#EAF3F7] text-[#014F78] border border-[#3B82A0]/20 rounded-full text-xs font-bold uppercase">En espera</span>}
                  {sol.status === 'aceptada' && <span className="px-3 py-1 bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/20 rounded-full text-xs font-bold uppercase">Aceptada</span>}
                  {sol.status === 'rechazada' && <span className="px-3 py-1 bg-red-50 text-red-700 border border-red-200 rounded-full text-xs font-bold uppercase">Rechazada</span>}
                </CardHeader>
                <CardContent className="pt-4 flex justify-end">
                  <Link href={`/proyectos/${sol.projects?.id}`}>
                    <Button variant="outline" className="gap-2 border-[#E2E8F0] text-[#014F78] hover:bg-[#EAF3F7]">
                      Ver Proyecto <ExternalLink className="w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
