import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function Navbar() {
  return (
    <header className="px-6 py-3 grid grid-cols-2 md:grid-cols-3 items-center bg-white/95 backdrop-blur-md sticky top-0 z-50 border-b border-[#E2E8F0] shadow-sm">
      <div className="flex items-center">
        <Link href="/" className="flex items-center gap-2 group">
          <img src="/innova-icon.png" alt="INNOVA LINK" className="h-14 w-auto object-contain transition-transform group-hover:scale-105" />
        </Link>
      </div>
      <nav className="hidden md:flex items-center justify-center gap-8 text-sm font-semibold text-[#475569]" aria-label="Navegación principal">
        <Link href="/proyectos" className="hover:text-[#014F78] transition-colors">Proyectos</Link>
        <Link href="/eventos" className="hover:text-[#014F78] transition-colors">Eventos</Link>
        <Link href="/convocatorias" className="hover:text-[#014F78] transition-colors">Convocatorias</Link>
        <Link href="/cursos" className="hover:text-[#014F78] transition-colors">Cursos</Link>
      </nav>
      <div className="flex items-center justify-end gap-3">
        <Link href="/login">
          <Button variant="ghost" className="hidden sm:inline-flex text-[#014F78] hover:bg-[#EAF3F7] font-semibold">
            Iniciar Sesión
          </Button>
        </Link>
        <Link href="/register">
          <Button className="bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold shadow-md shadow-[#447A00]/20 transition-all hover:scale-[1.02]">
            Comenzar
          </Button>
        </Link>
      </div>
    </header>
  )
}
