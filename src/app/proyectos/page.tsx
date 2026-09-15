import type { Metadata } from 'next'
import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MapPin, Tag, Search, Rocket } from 'lucide-react'
import { Input } from '@/components/ui/input'

export const metadata: Metadata = {
  title: 'Directorio de Proyectos',
  description: 'Descubre los emprendimientos más innovadores de Montería y la región Caribe. Busca por sector, etapa y ubicación.',
  openGraph: {
    title: 'Directorio de Proyectos – EmprendeYa',
    description: 'Explora proyectos locales innovadores y conecta con emprendedores de la región.',
    type: 'website',
  },
}

// Nota: Al usar <select> nativos simplificamos el form en Server Components para evitar client-side state
export default async function DirectorioProyectos(props: {
  searchParams: Promise<{ q?: string; sector?: string; etapa?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()
  
  let query = supabase
    .from('projects')
    .select('*, categories(name)')
    .eq('status', 'publicado')
    .order('created_at', { ascending: false })

  if (searchParams.q) query = query.ilike('name', `%${searchParams.q}%`)
  if (searchParams.sector) query = query.eq('category_id', searchParams.sector)
  if (searchParams.etapa) query = query.eq('stage', searchParams.etapa)

  const { data: projects } = await query

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  const projectIds = projects?.map(p => p.id) || []
  const { data: images } = projectIds.length > 0 
    ? await supabase.from('project_images').select('*').in('project_id', projectIds).eq('is_main', true)
    : { data: [] }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-indigo-900 text-white py-16 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">Directorio de Proyectos</h1>
            <p className="text-indigo-200 max-w-2xl text-lg">Descubre emprendimientos locales innovadores, conecta con sus fundadores y apoya el talento de la región.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-indigo-400 text-indigo-400 hover:bg-indigo-800 hover:text-white">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <form className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input name="q" defaultValue={searchParams.q || ''} placeholder="Buscar por nombre..." className="pl-10 h-11" />
          </div>
          <div className="w-full md:w-64">
            <select name="sector" defaultValue={searchParams.sector || ''} className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todos los Sectores</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-64">
            <select name="etapa" defaultValue={searchParams.etapa || ''} className="w-full h-11 px-3 py-2 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Todas las Etapas</option>
              <option value="Idea">Idea / Prototipo</option>
              <option value="MVP">MVP (Mínimo Viable)</option>
              <option value="Traccion">Con Tracción</option>
              <option value="Escalamiento">Escalamiento</option>
            </select>
          </div>
          <Button type="submit" className="h-11 bg-indigo-600 hover:bg-indigo-700 w-full md:w-auto px-8">Buscar</Button>
          <Link href="/proyectos" className="w-full md:w-auto">
             <Button type="button" variant="ghost" className="h-11 w-full text-slate-500">Limpiar</Button>
          </Link>
        </form>

        {/* Results */}
        {!projects || projects.length === 0 ? (
          <div className="text-center py-24 text-slate-500 bg-white rounded-3xl border border-dashed border-slate-200">
             <Rocket className="w-16 h-16 mx-auto mb-4 text-slate-300" />
             <h3 className="text-2xl font-semibold text-slate-700">No se encontraron proyectos</h3>
             <p className="mt-2">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(project => {
              const mainImage = images?.find(img => img.project_id === project.id)?.url
              return (
                <Card key={project.id} className="overflow-hidden hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-slate-100 flex flex-col bg-white">
                  <div className="h-48 bg-slate-100 relative w-full overflow-hidden flex items-center justify-center">
                    {mainImage ? (
                      <img src={mainImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <span className="text-slate-300 font-medium">Sin Imagen</span>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-white/95 backdrop-blur text-indigo-700 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                        {project.stage}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-1 font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2">{project.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <Tag className="w-4 h-4 text-indigo-400" />
                      <span className="line-clamp-1">{project.categories?.name || 'Varios'}</span>
                    </div>
                    <div className="flex items-center text-sm text-slate-500 gap-2">
                      <MapPin className="w-4 h-4 text-indigo-400" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-slate-50">
                     <Link href={`/proyectos/${project.id}`} className="w-full">
                       <Button className="w-full bg-indigo-50 hover:bg-indigo-600 hover:text-white text-indigo-700 transition-colors font-semibold">
                         Ver Detalles
                       </Button>
                     </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}
