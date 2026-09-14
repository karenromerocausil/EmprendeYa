'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function solicitarContacto(projectId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Debes iniciar sesión para contactar emprendedores." }
  }

  // Verificar que sea inversor
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'inversor') {
    return { error: "Solo los inversores pueden enviar solicitudes de contacto." }
  }

  const { error } = await supabase
    .from('contact_requests')
    .insert({
      project_id: projectId,
      investor_id: user.id,
      status: 'pendiente'
    })

  if (error) {
    if (error.code === '23505') { // Unique violation
      return { error: 'Ya has enviado una solicitud a este proyecto.' }
    }
    console.error(error)
    return { error: 'Error al enviar la solicitud.' }
  }

  revalidatePath(`/proyectos/${projectId}`)
  return { success: true }
}
