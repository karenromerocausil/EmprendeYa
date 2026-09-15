import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { login } from '@/app/auth/actions'
import { Sparkles } from 'lucide-react'

export default async function LoginPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[#EEF5E5] via-[#F8FAFC] to-[#EAF3F7] p-4">
      <div className="mb-6">
        <img src="/innova-icon.png" alt="INNOVA LINK" className="h-14 w-auto object-contain" />
      </div>

      <Card className="w-full max-w-md shadow-xl border border-[#E2E8F0] border-t-4 border-t-[#447A00] bg-white/95 backdrop-blur-sm rounded-2xl">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-2xl font-bold tracking-tight text-center text-[#163A4A]">Bienvenido</CardTitle>
          <CardDescription className="text-center text-[#475569] text-sm">
            Ingresa tus credenciales para acceder a INNOVA LINK
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={login} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#163A4A] font-medium">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" required className="h-11 border-[#E2E8F0] focus-visible:ring-[#447A00]" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-[#163A4A] font-medium">Contraseña</Label>
                <Link href="#" className="text-sm font-medium text-[#014F78] hover:text-[#3B82A0] hover:underline transition-colors">
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>
              <Input id="password" name="password" type="password" required className="h-11 border-[#E2E8F0] focus-visible:ring-[#447A00]" />
            </div>
            {searchParams?.message && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                {searchParams.message}
              </div>
            )}
            <Button type="submit" className="w-full h-11 bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold shadow-md shadow-[#447A00]/20 transition-all hover:shadow-lg active:scale-[0.98]">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center border-t border-[#E2E8F0] pt-6">
          <div className="text-sm text-[#475569]">
            ¿No tienes una cuenta?{' '}
            <Link href="/register" className="font-semibold text-[#014F78] hover:text-[#3B82A0] hover:underline transition-colors">
              Regístrate aquí
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
