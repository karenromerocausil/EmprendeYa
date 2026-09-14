import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { signup } from '@/app/auth/actions'

export default async function RegisterPage(props: {
  searchParams: Promise<{ message: string }>
}) {
  const searchParams = await props.searchParams

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600 bg-white/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl font-bold tracking-tight text-center text-gray-900">Crea tu cuenta</CardTitle>
          <CardDescription className="text-center text-gray-500 text-sm">
            Únete a EmprendeYa como Emprendedor o Inversor
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={signup} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700 font-medium">Correo Electrónico</Label>
              <Input id="email" name="email" type="email" placeholder="ejemplo@correo.com" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-700 font-medium">Contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-gray-700 font-medium">Tipo de Cuenta</Label>
              <Select name="role" defaultValue="emprendedor" required>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona tu perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="emprendedor">Emprendedor (Tengo un proyecto)</SelectItem>
                  <SelectItem value="inversor">Inversor (Busco proyectos)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {searchParams?.message && (
              <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg animate-in fade-in slide-in-from-top-1">
                {searchParams.message}
              </div>
            )}
            <Button type="submit" className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
              Registrarme
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 text-center border-t border-gray-100 pt-6">
          <div className="text-sm text-gray-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline transition-colors">
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
