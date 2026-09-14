import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft } from 'lucide-react'
import { createEvent } from '@/app/admin/actions'

export default function NuevoEventoPage() {
  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin">
            <Button variant="ghost" size="icon" className="rounded-full bg-white border shadow-sm">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">Crear Evento</h1>
        </div>

        <Card className="shadow-sm border-slate-100">
          <CardHeader>
            <CardTitle>Detalles del Evento</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={createEvent} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Evento *</Label>
                <Input id="name" name="name" required placeholder="Ej. Feria de Emprendimiento Montería 2026" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Descripción *</Label>
                <Textarea id="description" name="description" required className="min-h-[120px]" placeholder="Describe el evento, objetivos, ponentes, etc." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Fecha y Hora *</Label>
                  <Input id="event_date" name="event_date" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="modality">Modalidad</Label>
                  <select name="modality" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="Presencial">Presencial</option>
                    <option value="Virtual">Virtual</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Ubicación</Label>
                <Input id="location" name="location" placeholder="Ej. Centro de Convenciones de Montería" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="external_link">Enlace Externo (Inscripciones)</Label>
                <Input id="external_link" name="external_link" type="url" placeholder="https://..." />
              </div>
              <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                <Link href="/admin">
                  <Button variant="outline" type="button">Cancelar</Button>
                </Link>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Publicar Evento</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
