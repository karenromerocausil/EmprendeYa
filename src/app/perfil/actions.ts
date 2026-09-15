'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function updateProfile(formData: FormData): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
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
    // En Next.js 16 la acción no puede retornar valores: lanzamos error
    throw new Error('No se pudo actualizar el perfil')
  }

  revalidatePath('/perfil')
  revalidatePath('/dashboard')
}
