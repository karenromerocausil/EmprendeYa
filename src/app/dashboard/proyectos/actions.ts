'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const projectSchema = z.object({
  name: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  short_description: z.string().min(10, "La descripción corta es muy breve"),
  full_description: z.string().optional(),
  category_id: z.string().uuid("Debes seleccionar una categoría válida"),
  stage: z.string().min(1, "Debes seleccionar una etapa"),
  location: z.string().min(1, "La ubicación es obligatoria")
})

export async function createProject(formData: FormData) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const rawData = {
    name: formData.get('name'),
    short_description: formData.get('short_description'),
    full_description: formData.get('full_description'),
    category_id: formData.get('category_id'),
    stage: formData.get('stage'),
    location: formData.get('location'),
  }

  const validatedData = projectSchema.parse(rawData)

  // 1. Insert Project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .insert({
      owner_id: user.id,
      ...validatedData,
      status: 'borrador' // Default status
    })
    .select()
    .single()

  if (projectError || !project) {
    console.error(projectError)
    throw new Error('Error al crear el proyecto')
  }

  // 2. Upload Image if exists
  const mainImage = formData.get('mainImage') as File
  if (mainImage && mainImage.size > 0) {
    const fileExt = mainImage.name.split('.').pop()
    const fileName = `${project.id}-main.${fileExt}`
    const filePath = `${user.id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('project-images')
      .upload(filePath, mainImage)

    if (!uploadError) {
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('project-images')
        .getPublicUrl(filePath)

      // Save to project_images table
      await supabase.from('project_images').insert({
        project_id: project.id,
        url: publicUrl,
        is_main: true
      })
    } else {
      console.error("Upload error:", uploadError)
    }
  }

  revalidatePath('/dashboard/proyectos')
  redirect('/dashboard/proyectos')
}
