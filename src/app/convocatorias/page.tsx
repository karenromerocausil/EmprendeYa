import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Target, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Convocatorias y Apoyos',
  description: 'Encuentra financiamiento, concursos y programas de aceleración disponibles para emprendedores colombianos. Actúliza tu aplicación antes de que cierren.',
  openGraph: {
    title: 'Convocatorias y Apoyos – EmprendeYa',
    description: 'Accede a fondos, becas y convocatorias abiertas para emprendedores de la región Caribe.',
    type: 'website',
  },
}

export default async function DirectorioConvocatorias() {
  const supabase = await createClient()
  
  const { data: oportunidades } = await supabase
    .from('opportunities')
    .select('*, categories(name)')
    .order('close_date', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-emerald-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Convocatorias y Apoyos</h1>
            <p className="text-emerald-200 max-w-2xl text-lg">Encuentra financiamiento, concursos y programas de aceleración.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-emerald-400 text-emerald-400 hover:bg-emerald-800 hover:text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {!oportunidades || oportunidades.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
             <Target className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-2xl font-semibold text-slate-700">No hay convocatorias activas</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {oportunidades.map(op => (
              <Card key={op.id} className="hover:shadow-lg transition-shadow border-slate-100 flex flex-col bg-white border-l-4 border-l-emerald-500">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                      {op.status}
                    </span>
                  </div>
                  <CardTitle className="text-2xl text-slate-900">{op.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-slate-600">{op.description}</p>
                  
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <p className="text-sm"><strong>Organizador:</strong> {op.organizer}</p>
                    <p className="text-sm"><strong>Cierre:</strong> {new Date(op.close_date).toLocaleDateString()}</p>
                    <p className="text-sm"><strong>Beneficios:</strong> {op.benefits}</p>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-slate-50">
                  {op.external_link && (
                    <a href={op.external_link} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full bg-emerald-600 hover:bg-emerald-700 gap-2 font-semibold">
                        Postularse / Detalles <ExternalLink className="w-4 h-4" />
                      </Button>
                    </a>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
