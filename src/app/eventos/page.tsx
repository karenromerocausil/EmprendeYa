import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Agenda de Eventos',
  description: 'Descubre talleres, conferencias y eventos de networking para emprendedores en Montería y el Caribe colombiano.',
  openGraph: {
    title: 'Agenda de Eventos – EmprendeYa',
    description: 'No te pierdas las próximas ferias, charlas y actividades de emprendimiento en tu región.',
    type: 'website',
  },
}

export default async function DirectorioEventos() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*, categories(name)')
    .order('event_date', { ascending: true })

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-gradient-to-r from-[#014F78] to-[#163A4A] text-white py-16 px-6 relative overflow-hidden shadow-md">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Agenda de Eventos</h1>
            <p className="text-[#EAF3F7] max-w-2xl text-lg">Descubre talleres, networking y conferencias para potenciar tu emprendimiento.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {!events || events.length === 0 ? (
          <div className="text-center py-20 text-[#475569] bg-white rounded-3xl border border-[#E2E8F0]">
             <Calendar className="w-16 h-16 mx-auto mb-4 text-[#3B82A0]" />
             <h3 className="text-2xl font-bold text-[#163A4A]">No hay eventos próximos</h3>
             <p className="text-[#475569] mt-1">Mantente atento para futuras actualizaciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-lg hover:border-[#3B82A0] transition-all border-[#E2E8F0] flex flex-col bg-white rounded-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2.5 py-1 bg-[#EAF3F7] text-[#014F78] border border-[#3B82A0]/20 rounded-full text-xs font-bold uppercase">
                      {event.status}
                    </span>
                    <span className="text-xs font-medium text-[#475569] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
                      {event.categories?.name || 'General'}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2 text-[#163A4A]">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-[#475569] text-sm line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 pt-4 border-t border-[#E2E8F0]">
                    <div className="flex items-center text-sm text-[#475569] gap-2">
                      <Calendar className="w-4 h-4 text-[#014F78]" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#475569] gap-2">
                      <MapPin className="w-4 h-4 text-[#014F78]" />
                      <span>{event.location} • {event.modality}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-[#E2E8F0]">
                  {event.external_link && (
                    <a href={event.external_link} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full bg-[#014F78] hover:bg-[#3B82A0] text-white font-semibold gap-2 shadow-sm">
                        Más Información <ExternalLink className="w-4 h-4" />
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
