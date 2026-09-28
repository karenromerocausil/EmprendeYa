import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, Lightbulb, Calendar, BookOpen, Target, Sparkles } from 'lucide-react'
import { Navbar } from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'Inicio',
  description: 'INNOVA LINK es la plataforma de innovación y emprendimiento de Montería. Publica tu proyecto, conecta con inversores y accede a eventos, convocatorias y cursos.',
  openGraph: {
    title: 'INNOVA LINK – Conectando Innovación y Crecimiento',
    description: 'Conecta tus ideas con el éxito. La plataforma de referencia para emprendedores e inversores en la región.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-[#F8FAFC]">
      <Navbar />


      {/* Hero Section */}
      <main id="main-content" className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 bg-gradient-to-br from-[#EEF5E5] via-[#F8FAFC] to-[#EAF3F7]">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEF5E5] text-[#447A00] border border-[#6FAE2A]/30 text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4 shadow-sm">
          <Sparkles className="w-4 h-4 text-[#447A00]" />
          <span>La red de emprendimiento e innovación</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-[#163A4A] tracking-tight max-w-4xl mb-6 animate-in fade-in slide-in-from-bottom-6 duration-500 leading-tight">
          Conecta tus ideas con <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#447A00] via-[#014F78] to-[#3B82A0]">el éxito</span>
        </h1>
        
        <p className="text-lg md:text-xl text-[#475569] max-w-2xl mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 leading-relaxed">
          Centralizamos oportunidades, eventos, convocatorias y formación para emprendedores. Publica tu proyecto y encuentra inversores estratégicos para impulsar tu crecimiento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          <Link href="/proyectos">
            <Button size="lg" className="h-14 px-8 text-lg bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold w-full sm:w-auto shadow-lg shadow-[#447A00]/25 transition-all hover:scale-[1.02]">
              Explorar Proyectos
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
          <Link href="/register">
            <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto bg-white border-[#E2E8F0] text-[#014F78] hover:bg-[#EAF3F7] font-semibold transition-all">
              Registrar mi Emprendimiento
            </Button>
          </Link>
        </div>
      </main>

      {/* Features Section */}
      <section className="py-20 bg-white border-t border-[#E2E8F0]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          <Link href="/proyectos" className="group p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:shadow-xl hover:border-[#6FAE2A] transition-all text-left">
            <div className="w-14 h-14 bg-[#EEF5E5] text-[#447A00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Lightbulb className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#163A4A] mb-3">Proyectos Locales</h3>
            <p className="text-[#475569] text-sm leading-relaxed">Descubre los emprendimientos más innovadores de la región y conecta con sus creadores.</p>
          </Link>

          <Link href="/eventos" className="group p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:shadow-xl hover:border-[#3B82A0] transition-all text-left">
            <div className="w-14 h-14 bg-[#EAF3F7] text-[#014F78] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Calendar className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#163A4A] mb-3">Eventos</h3>
            <p className="text-[#475569] text-sm leading-relaxed">No te pierdas networking, ferias y charlas pensadas para tu crecimiento y conexiones.</p>
          </Link>

          <Link href="/convocatorias" className="group p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:shadow-xl hover:border-[#6FAE2A] transition-all text-left">
            <div className="w-14 h-14 bg-[#EEF5E5] text-[#447A00] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#163A4A] mb-3">Convocatorias</h3>
            <p className="text-[#475569] text-sm leading-relaxed">Accede a fondos, concursos y programas de apoyo institucional y de capital semilla.</p>
          </Link>

          <Link href="/cursos" className="group p-8 rounded-3xl bg-[#F8FAFC] border border-[#E2E8F0] hover:bg-white hover:shadow-xl hover:border-[#3B82A0] transition-all text-left">
            <div className="w-14 h-14 bg-[#EAF3F7] text-[#014F78] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
              <BookOpen className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-[#163A4A] mb-3">Cursos</h3>
            <p className="text-[#475569] text-sm leading-relaxed">Capacítate continuamente con la oferta formativa especializada para fundadores y equipos.</p>
          </Link>

        </div>
      </section>
    </div>
  )
}
