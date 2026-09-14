import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { createProject } from '@/app/dashboard/proyectos/actions'
import { ArrowLeft, UploadCloud } from 'lucide-react'

export default async function NuevoProyectoPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'emprendedor') redirect('/dashboard')

  const { data: categories } = await supabase.from('categories').select('*').order('name')

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/dashboard/proyectos">
            <Button variant="ghost" size="icon" className="rounded-full bg-white border hover:bg-slate-100 shadow-sm">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Crear Nuevo Proyecto</h1>
            <p className="text-slate-500">Completa la información para que los inversores te descubran</p>
          </div>
        </div>

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Detalles del Emprendimiento</CardTitle>
            <CardDescription>
              Asegúrate de incluir una descripción clara y una buena imagen principal.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createProject} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="name">Nombre del Proyecto *</Label>
                  <Input id="name" name="name" required placeholder="Ej. EcoTech Solutions" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="short_description">Descripción Corta (Elevator Pitch) *</Label>
                  <Input id="short_description" name="short_description" required placeholder="Una frase que resuma el valor de tu proyecto" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category_id">Categoría / Sector *</Label>
                  <Select name="category_id" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un sector" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories?.map(cat => (
                        <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="stage">Etapa del Proyecto *</Label>
                  <Select name="stage" required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la etapa actual" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Idea">Idea / Prototipo</SelectItem>
                      <SelectItem value="MVP">MVP (Producto Mínimo Viable)</SelectItem>
                      <SelectItem value="Traccion">Con Tracción / Ventas iniciales</SelectItem>
                      <SelectItem value="Escalamiento">Escalamiento</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Ubicación (Ciudad/País) *</Label>
                  <Input id="location" name="location" required placeholder="Ej. Montería, Colombia" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="full_description">Descripción Completa</Label>
                  <Textarea 
                    id="full_description" 
                    name="full_description" 
                    placeholder="Explica el problema, la solución, modelo de negocio y proyecciones..."
                    className="min-h-[150px]"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label>Imagen Principal</Label>
                  <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:bg-slate-50 transition-colors">
                    <UploadCloud className="w-10 h-10 text-slate-400 mx-auto mb-4" />
                    <Input 
                      type="file" 
                      id="mainImage" 
                      name="mainImage" 
                      accept="image/png, image/jpeg, image/webp"
                      className="max-w-xs mx-auto file:bg-indigo-50 file:text-indigo-700 file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4 file:font-semibold hover:file:bg-indigo-100 cursor-pointer"
                    />
                    <p className="text-xs text-slate-500 mt-2">Formatos permitidos: JPG, PNG, WEBP (Max 5MB)</p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Link href="/dashboard/proyectos">
                  <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Guardar como Borrador</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
