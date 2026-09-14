-- Crear un bucket público para las imágenes de los proyectos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas de seguridad para el bucket 'project-images'

-- 1. Cualquiera puede ver las imágenes (lectura pública)
CREATE POLICY "Imágenes públicas" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-images');

-- 2. Solo usuarios autenticados pueden subir imágenes
CREATE POLICY "Autenticados pueden subir imágenes" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'project-images' AND auth.role() = 'authenticated');

-- 3. Los usuarios pueden actualizar/eliminar sus propias imágenes
CREATE POLICY "Usuarios gestionan sus propias imágenes" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'project-images' AND auth.uid() = owner);

CREATE POLICY "Usuarios eliminan sus propias imágenes" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'project-images' AND auth.uid() = owner);
