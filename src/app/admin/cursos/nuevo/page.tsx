import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createCourse } from '@/app/admin/actions'

export default function NuevoCursoPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full bg-[#EAF3F7] border border-[#3B82A0]/30 shadow-sm text-[#014F78] hover:bg-[#014F78] hover:text-white transition-all">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Crear Curso</h1>
        </div>

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Detalles del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createCourse} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Curso *</Label>
                <Input id="name" name="name" required placeholder="Ej. Finanzas para Emprendedores" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea id="description" name="description" required className="min-h-[120px]" placeholder="¿Qué aprenderá el estudiante?" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="provider">Proveedor / Institución *</Label>
                  <Input id="provider" name="provider" required placeholder="Ej. SENA, Unicor..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duración</Label>
                  <Input id="duration" name="duration" placeholder="Ej. 40 horas" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Precio</Label>
                  <Input id="price" name="price" placeholder="Ej. Gratuito / $150.000" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="external_link">Enlace de Inscripción</Label>
                <Input id="external_link" name="external_link" type="url" placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Link href="/admin">
                  <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" className="bg-[#447A00] hover:bg-[#6FAE2A] text-white font-semibold shadow-md shadow-[#447A00]/20">Publicar Curso</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
