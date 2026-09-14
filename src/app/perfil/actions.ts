'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const name = formData.get('name') as string
  const city = formData.get('city') as string
  const description = formData.get('description') as string

  const { error } = await supabase
    .from('profiles')
    .update({
      name,
      city,
      description,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    return { error: 'No se pudo actualizar el perfil' }
  }

  revalidatePath('/perfil')
  revalidatePath('/dashboard')
  
  return { success: true }
}
