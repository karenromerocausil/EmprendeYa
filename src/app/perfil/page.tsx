import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { updateProfile } from '@/app/perfil/actions'
import { UserCircle, MapPin, AlignLeft } from 'lucide-react'
import Link from 'next/link'

export default async function PerfilPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (error || !user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-slate-900">Mi Perfil</h1>
          <Link href="/dashboard">
            <Button variant="outline">Volver al Panel</Button>
          </Link>
        </div>

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Información Pública</CardTitle>
            <CardDescription>
              Estos datos serán visibles para otros usuarios en la plataforma.
              Tu rol actual es: <span className="font-semibold uppercase">{profile?.role}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={updateProfile} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center gap-2">
                  <UserCircle className="w-4 h-4 text-slate-500" />
                  Nombre Completo
                </Label>
                <Input 
                  id="name" 
                  name="name" 
                  defaultValue={profile?.name || ''} 
                  placeholder="Ej. Juan Pérez" 
                  required 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city" className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  Ciudad
                </Label>
                <Input 
                  id="city" 
                  name="city" 
                  defaultValue={profile?.city || ''} 
                  placeholder="Ej. Montería" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="flex items-center gap-2">
                  <AlignLeft className="w-4 h-4 text-slate-500" />
                  Acerca de mí
                </Label>
                <Textarea 
                  id="description" 
                  name="description" 
                  defaultValue={profile?.description || ''} 
                  placeholder="Cuéntanos sobre ti, tu experiencia y tus objetivos..."
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full sm:w-auto bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold shadow-md">
                Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
