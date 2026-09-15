import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, ExternalLink, DollarSign, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Formación y Cursos',
  description: 'Capacita tu emprendimiento con cursos online y presenciales disponibles para emprendedores. Aprende marketing, finanzas, tecnología y más.',
  openGraph: {
    title: 'Formación y Cursos – EmprendeYa',
    description: 'Accede a la oferta formativa más completa para emprendedores en Colombia.',
    type: 'website',
  },
}

export default async function DirectorioCursos() {
  const supabase = await createClient()
  
  const { data: cursos } = await supabase
    .from('courses')
    .select('*, categories(name)')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-amber-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Formación y Cursos</h1>
            <p className="text-amber-200 max-w-2xl text-lg">Capacítate con los mejores cursos diseñados para potenciar tus habilidades.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-amber-400 text-amber-400 hover:bg-amber-800 hover:text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {!cursos || cursos.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
             <BookOpen className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-2xl font-semibold text-slate-700">No hay cursos publicados</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(curso => (
              <Card key={curso.id} className="hover:shadow-xl transition-shadow border-slate-100 flex flex-col bg-white">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2">{curso.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-slate-600 text-sm line-clamp-3">{curso.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600 gap-1">
                      <Clock className="w-4 h-4 text-amber-500" />
                      <span>{curso.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 gap-1">
                      <DollarSign className="w-4 h-4 text-amber-500" />
                      <span>{curso.price}</span>
                    </div>
                  </div>
                  <div className="text-sm text-slate-500 font-medium bg-slate-50 p-2 rounded text-center">
                    Proveedor: {curso.provider}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-slate-50">
                  {curso.external_link && (
                    <a href={curso.external_link} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full bg-amber-600 hover:bg-amber-700 gap-2">
                        Inscribirse <ExternalLink className="w-4 h-4" />
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
