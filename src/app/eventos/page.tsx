import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock, ExternalLink } from 'lucide-react'

export default async function DirectorioEventos() {
  const supabase = await createClient()
  
  const { data: events } = await supabase
    .from('events')
    .select('*, categories(name)')
    .order('event_date', { ascending: true })

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-blue-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Agenda de Eventos</h1>
            <p className="text-blue-200 max-w-2xl text-lg">Descubre talleres, networking y conferencias para potenciar tu emprendimiento.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-blue-400 text-blue-400 hover:bg-blue-800 hover:text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {!events || events.length === 0 ? (
          <div className="text-center py-20 text-slate-500 bg-white rounded-3xl border border-slate-200">
             <Calendar className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-2xl font-semibold text-slate-700">No hay eventos próximos</h3>
             <p>Mantente atento para futuras actualizaciones.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map(event => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow border-slate-100 flex flex-col bg-white">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs font-bold uppercase">
                      {event.status}
                    </span>
                    <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {event.categories?.name || 'General'}
                    </span>
                  </div>
                  <CardTitle className="text-xl line-clamp-2">{event.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <p className="text-slate-600 text-sm line-clamp-3">{event.description}</p>
                  
                  <div className="space-y-2 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <Calendar className="w-4 h-4 text-blue-500" />
                      <span>{new Date(event.event_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-600 gap-2">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span>{event.location} • {event.modality}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-4 border-t border-slate-50">
                  {event.external_link && (
                    <a href={event.external_link} target="_blank" rel="noreferrer" className="w-full">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 gap-2">
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
