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
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-gradient-to-r from-[#014F78] to-[#163A4A] text-white py-16 px-6 relative overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Formación y Cursos</h1>
            <p className="text-[#EAF3F7] max-w-2xl text-lg">Capacítate con los mejores cursos diseñados para potenciar tus habilidades.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {!cursos || cursos.length === 0 ? (
          <div className="text-center py-20 text-[#475569] bg-white rounded-3xl border border-[#E2E8F0]">
             <BookOpen className="w-16 h-16 mx-auto mb-4 text-[#3B82A0]" />
             <h3 className="text-2xl font-bold text-[#163A4A]">No hay cursos publicados</h3>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cursos.map(curso => (
              <Card key={curso.id} className="hover:shadow-xl hover:border-[#3B82A0] transition-all border-[#E2E8F0] flex flex-col bg-white rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl line-clamp-2 text-[#163A4A]">{curso.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-[#475569] text-sm line-clamp-3">{curso.description}</p>
                  
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center text-sm text-[#475569] gap-1">
                      <Clock className="w-4 h-4 text-[#014F78]" />
                      <span>{curso.duration}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#475569] gap-1">
                      <DollarSign className="w-4 h-4 text-[#014F78]" />
                      <span>{curso.price}</span>
                    </div>
                  </div>
                  <div className="text-sm text-[#014F78] font-medium bg-[#EAF3F7] p-2 rounded-xl text-center">
                    Proveedor: {curso.provider}
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-[#E2E8F0]">
                  {curso.external_link && (
                    <a href={curso.external_link} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full bg-[#014F78] hover:bg-[#3B82A0] text-white gap-2 font-semibold shadow-sm">
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
