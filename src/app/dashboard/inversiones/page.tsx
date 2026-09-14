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
               <Button className="bg-indigo-600 hover:bg-indigo-700">Explorar Directorio</Button>
             </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {solicitudes.map((sol: any) => (
              <Card key={sol.id} className="border-slate-100 hover:shadow-md transition-shadow">
                <CardHeader className="pb-3 border-b border-slate-50 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-slate-900">{sol.projects?.name}</CardTitle>
                    <CardDescription>
                      Solicitado el {new Date(sol.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  {sol.status === 'pendiente' && <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase">En espera</span>}
                  {sol.status === 'aceptada' && <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">Aceptada</span>}
                  {sol.status === 'rechazada' && <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold uppercase">Rechazada</span>}
                </CardHeader>
                <CardContent className="pt-4 flex justify-end">
                  <Link href={`/proyectos/${sol.projects?.id}`}>
                    <Button variant="outline" className="gap-2">
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
