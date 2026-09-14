import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Lightbulb, Calendar, BookOpen, Target, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Navbar */}
      <header className="px-6 py-4 flex items-center justify-between bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">EmprendeYa</span>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/proyectos" className="hover:text-indigo-600 transition-colors">Proyectos</Link>
          <Link href="/eventos" className="hover:text-indigo-600 transition-colors">Eventos</Link>
          <Link href="/convocatorias" className="hover:text-indigo-600 transition-colors">Convocatorias</Link>
          <Link href="/cursos" className="hover:text-indigo-600 transition-colors">Cursos</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" className="hidden sm:inline-flex">Iniciar Sesión</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-indigo-600 hover:bg-indigo-700">Comenzar</Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-br from-indigo-50 via-white to-blue-50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
          <Sparkles className="w-4 h-4" />
          <span>La red de emprendimiento de Montería</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
          Conecta tus ideas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">el éxito</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
          Centralizamos oportunidades, eventos, convocatorias y cursos para emprendedores. Publica tu proyecto y encuentra inversores dispuestos a apoyarte.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <Link href="/proyectos">
            <Button size="lg" className="h-14 px-8 text-lg bg-indigo-600 hover:bg-indigo-700 w-full sm:w-auto shadow-lg hover:shadow-indigo-500/25 transition-all">
              Explorar Proyectos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white hover:bg-slate-50">
              Registrar mi Emprendimiento
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <Link href="/proyectos" className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-indigo-100 transition-all text-left">
            <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Proyectos Locales</h3>
            <p className="text-slate-600">Descubre los emprendimientos más innovadores de la región y conecta con sus creadores.</p>
          </Link>

          <Link href="/eventos" className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-blue-100 transition-all text-left">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Eventos</h3>
            <p className="text-slate-600">No te pierdas de networking, ferias y charlas pensadas para tu crecimiento.</p>
          </Link>

          <Link href="/convocatorias" className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-emerald-100 transition-all text-left">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Convocatorias</h3>
            <p className="text-slate-600">Accede a fondos, concursos y programas de apoyo del gobierno e instituciones.</p>
          </Link>

          <Link href="/cursos" className="group p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-xl hover:border-amber-100 transition-all text-left">
            <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Cursos</h3>
            <p className="text-slate-600">Capacítate constantemente con la oferta formativa disponible para emprendedores.</p>
          </Link>

        </div>
      </section>
    </div>
  )
}
