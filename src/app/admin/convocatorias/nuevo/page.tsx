import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createOpportunity } from '@/app/admin/actions'

export default function NuevaConvocatoriaPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full bg-white border shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Crear Convocatoria</h1>
        </div>

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Detalles de la Convocatoria</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createOpportunity} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Convocatoria *</Label>
                <Input id="name" name="name" required placeholder="Ej. Fondo de Innovación Regional 2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea id="description" name="description" required className="min-h-[120px]" placeholder="¿En qué consiste? ¿Quiénes pueden aplicar?" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="organizer">Organizador *</Label>
                  <Input id="organizer" name="organizer" required placeholder="Ej. Alcaldía de Montería" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="close_date">Fecha de Cierre *</Label>
                  <Input id="close_date" name="close_date" type="date" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="benefits">Beneficios / Premio</Label>
                <Input id="benefits" name="benefits" placeholder="Ej. Capital semilla hasta $20M COP" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external_link">Enlace de Postulación</Label>
                <Input id="external_link" name="external_link" type="url" placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Link href="/admin">
                  <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">Publicar Convocatoria</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
