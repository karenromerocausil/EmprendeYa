import type { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://emprendeya.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  // Proyectos publicados
  const { data: proyectos } = await supabase
    .from('projects')
    .select('id, updated_at')
    .eq('status', 'publicado')

  const proyectosUrls: MetadataRoute.Sitemap = (proyectos ?? []).map((p) => ({
    url: `${siteUrl}/proyectos/${p.id}`,
    lastModified: p.updated_at,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/proyectos`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${siteUrl}/eventos`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/convocatorias`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${siteUrl}/cursos`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    ...proyectosUrls,
  ]
}
