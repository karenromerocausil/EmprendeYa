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
    <div className="min-h-screen bg-[#F8FAFC]">
      <header className="bg-gradient-to-r from-[#014F78] to-[#163A4A] text-white py-16 px-6 relative overflow-hidden shadow-md">
        <div className="absolute inset-0 opacity-15 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight text-white">Directorio de Proyectos</h1>
            <p className="text-[#EAF3F7] max-w-2xl text-lg">Descubre emprendimientos locales innovadores, conecta con sus fundadores y apoya el talento de la región.</p>
          </div>
          <Link href="/">
             <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">Volver al Inicio</Button>
          </Link>
        </div>
      </header>

      <main id="main-content" className="max-w-7xl mx-auto px-6 py-12">
        {/* Filters */}
        <form className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-[#E2E8F0] flex flex-col md:flex-row gap-4 mb-12">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#475569] w-5 h-5" />
            <Input name="q" defaultValue={searchParams.q || ''} placeholder="Buscar por nombre..." className="pl-10 h-11 border-[#E2E8F0] focus-visible:ring-[#447A00]" />
          </div>
          <div className="w-full md:w-64">
            <select name="sector" defaultValue={searchParams.sector || ''} className="w-full h-11 px-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm outline-none focus:ring-2 focus:ring-[#447A00] text-[#163A4A]">
              <option value="">Todos los Sectores</option>
              {categories?.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="w-full md:w-64">
            <select name="etapa" defaultValue={searchParams.etapa || ''} className="w-full h-11 px-3 py-2 bg-white border border-[#E2E8F0] rounded-md text-sm outline-none focus:ring-2 focus:ring-[#447A00] text-[#163A4A]">
              <option value="">Todas las Etapas</option>
              <option value="Idea">Idea / Prototipo</option>
              <option value="MVP">MVP (Mínimo Viable)</option>
              <option value="Traccion">Con Tracción</option>
              <option value="Escalamiento">Escalamiento</option>
            </select>
          </div>
          <Button type="submit" className="h-11 bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold w-full md:w-auto px-8 shadow-sm">Buscar</Button>
          <Link href="/proyectos" className="w-full md:w-auto">
             <Button type="button" variant="ghost" className="h-11 w-full text-[#475569] hover:bg-[#EAF3F7]">Limpiar</Button>
          </Link>
        </form>

        {/* Results */}
        {!projects || projects.length === 0 ? (
          <div className="text-center py-24 text-[#475569] bg-white rounded-3xl border border-dashed border-[#E2E8F0]">
             <Rocket className="w-16 h-16 mx-auto mb-4 text-[#3B82A0]" />
             <h3 className="text-2xl font-semibold text-[#163A4A]">No se encontraron proyectos</h3>
             <p className="mt-2 text-[#475569]">Intenta ajustar tus filtros de búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map(project => {
              const mainImage = images?.find(img => img.project_id === project.id)?.url
              return (
                <Card key={project.id} className="overflow-hidden hover:-translate-y-1 hover:shadow-xl hover:border-[#6FAE2A] transition-all duration-300 border-[#E2E8F0] flex flex-col bg-white">
                  <div className="h-48 bg-[#F8FAFC] relative w-full overflow-hidden flex items-center justify-center">
                    {mainImage ? (
                      <img src={mainImage} alt={project.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
                    ) : (
                      <span className="text-[#475569]/60 font-medium">Sin Imagen</span>
                    )}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/20 rounded-full text-xs font-bold shadow-sm uppercase tracking-wider">
                        {project.stage}
                      </span>
                    </div>
                  </div>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl line-clamp-1 font-bold text-[#163A4A] group-hover:text-[#014F78] transition-colors">{project.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-2 text-[#475569]">{project.short_description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1 space-y-3">
                    <div className="flex items-center text-sm text-[#475569] gap-2">
                      <Tag className="w-4 h-4 text-[#3B82A0]" />
                      <span className="line-clamp-1">{project.categories?.name || 'Varios'}</span>
                    </div>
                    <div className="flex items-center text-sm text-[#475569] gap-2">
                      <MapPin className="w-4 h-4 text-[#3B82A0]" />
                      <span className="line-clamp-1">{project.location}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="pt-4 border-t border-[#E2E8F0]">
                     <Link href={`/proyectos/${project.id}`} className="w-full">
                       <Button className="w-full bg-[#EEF5E5] hover:bg-[#447A00] text-[#447A00] hover:text-white transition-all font-semibold shadow-none hover:shadow-md">
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
