'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

async function assertAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'admin') throw new Error('Unauthorized')
  return supabase
}

export async function createEvent(formData: FormData) {
  const supabase = await assertAdmin()

  const { error } = await supabase.from('events').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    event_date: formData.get('event_date') as string,
    location: formData.get('location') as string,
    modality: formData.get('modality') as string,
    external_link: formData.get('external_link') as string,
    status: 'activo',
  })

  if (error) throw new Error(`Error al crear evento: ${error.message}`)
  revalidatePath('/eventos')
  revalidatePath('/admin')
  redirect('/admin/eventos')
}

export async function createOpportunity(formData: FormData) {
  const supabase = await assertAdmin()

  const { error } = await supabase.from('opportunities').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    organizer: formData.get('organizer') as string,
    close_date: formData.get('close_date') as string,
    benefits: formData.get('benefits') as string,
    external_link: formData.get('external_link') as string,
    status: 'activa',
  })

  if (error) throw new Error(`Error al crear convocatoria: ${error.message}`)
  revalidatePath('/convocatorias')
  revalidatePath('/admin')
  redirect('/admin/convocatorias')
}

export async function createCourse(formData: FormData) {
  const supabase = await assertAdmin()

  const { error } = await supabase.from('courses').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    provider: formData.get('provider') as string,
    duration: formData.get('duration') as string,
    price: formData.get('price') as string,
    external_link: formData.get('external_link') as string,
  })

  if (error) throw new Error(`Error al crear curso: ${error.message}`)
  revalidatePath('/cursos')
  revalidatePath('/admin')
  redirect('/admin/cursos')
}

export async function moderateProject(formData: FormData) {
  const supabase = await assertAdmin()
  const projectId = formData.get('projectId') as string
  const newStatus = formData.get('status') as string

  const { error } = await supabase.from('projects').update({ status: newStatus }).eq('id', projectId)
  if (error) throw new Error(`Error al moderar: ${error.message}`)
  revalidatePath('/admin/proyectos')
  revalidatePath('/proyectos')
}
