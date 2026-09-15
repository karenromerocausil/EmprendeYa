-- ============================================================
-- FASE 7: Políticas RLS Completas - EmprendeYa
-- Ejecutar en el SQL Editor de Supabase DESPUÉS de policies.sql
-- ============================================================

-- --------------------------------------------------------
-- HABILITAR RLS en tablas faltantes
-- --------------------------------------------------------
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------
-- CATEGORIES (solo lectura pública; escritura solo admins)
-- --------------------------------------------------------
CREATE POLICY "Categorías visibles para todos" ON categories
  FOR SELECT USING (true);

CREATE POLICY "Solo admins crean categorías" ON categories
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Solo admins actualizan categorías" ON categories
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Solo admins eliminan categorías" ON categories
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- PROJECT_IMAGES
-- --------------------------------------------------------

-- Cualquiera puede ver imágenes de proyectos publicados
CREATE POLICY "Imágenes de proyectos publicados son públicas" ON project_images
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE status = 'publicado'
    )
  );

-- Dueño del proyecto puede ver imágenes de sus propios proyectos (borradores/ocultos)
CREATE POLICY "Propietario ve imágenes de sus proyectos" ON project_images
  FOR SELECT USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Solo el dueño del proyecto puede insertar imágenes
CREATE POLICY "Propietario puede subir imágenes" ON project_images
  FOR INSERT WITH CHECK (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Solo el dueño del proyecto puede eliminar imágenes
CREATE POLICY "Propietario puede eliminar imágenes" ON project_images
  FOR DELETE USING (
    project_id IN (
      SELECT id FROM projects WHERE owner_id = auth.uid()
    )
  );

-- Admins pueden gestionar todas las imágenes
CREATE POLICY "Admins gestionan imágenes" ON project_images
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- EVENTS
-- --------------------------------------------------------

-- Cualquiera puede leer eventos
CREATE POLICY "Eventos visibles para todos" ON events
  FOR SELECT USING (true);

-- Solo admins pueden crear, editar y borrar eventos
CREATE POLICY "Solo admins gestionan eventos" ON events
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- OPPORTUNITIES (Convocatorias)
-- --------------------------------------------------------

-- Cualquiera puede leer convocatorias
CREATE POLICY "Convocatorias visibles para todos" ON opportunities
  FOR SELECT USING (true);

-- Solo admins pueden crear, editar y borrar convocatorias
CREATE POLICY "Solo admins gestionan convocatorias" ON opportunities
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- COURSES
-- --------------------------------------------------------

-- Cualquiera puede leer cursos
CREATE POLICY "Cursos visibles para todos" ON courses
  FOR SELECT USING (true);

-- Solo admins pueden crear, editar y borrar cursos
CREATE POLICY "Solo admins gestionan cursos" ON courses
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- FAVORITES
-- --------------------------------------------------------

-- Los usuarios solo ven sus propios favoritos
CREATE POLICY "Usuarios ven sus propios favoritos" ON favorites
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden insertar sus propios favoritos
CREATE POLICY "Usuarios agregan favoritos" ON favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Los usuarios pueden eliminar sus propios favoritos
CREATE POLICY "Usuarios eliminan sus propios favoritos" ON favorites
  FOR DELETE USING (auth.uid() = user_id);

-- --------------------------------------------------------
-- REPORTS (Reportes de contenido)
-- --------------------------------------------------------

-- Los usuarios autenticados pueden reportar
CREATE POLICY "Usuarios autenticados pueden reportar" ON reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

-- Los usuarios pueden ver sus propios reportes
CREATE POLICY "Usuarios ven sus propios reportes" ON reports
  FOR SELECT USING (auth.uid() = reporter_id);

-- Solo admins pueden ver y gestionar todos los reportes
CREATE POLICY "Admins gestionan todos los reportes" ON reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- NOTIFICATIONS
-- --------------------------------------------------------

-- Los usuarios solo ven sus propias notificaciones
CREATE POLICY "Usuarios ven sus notificaciones" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Los usuarios pueden marcar sus notificaciones como leídas (UPDATE)
CREATE POLICY "Usuarios actualizan sus notificaciones" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Admins pueden ver todas las notificaciones
CREATE POLICY "Admins ven todas las notificaciones" ON notifications
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- CONTACT_REQUESTS (complementar las existentes)
-- --------------------------------------------------------

-- Admins pueden ver y gestionar todas las solicitudes
CREATE POLICY "Admins gestionan solicitudes de contacto" ON contact_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- --------------------------------------------------------
-- PROJECTS (complementar la existente para admins)
-- --------------------------------------------------------

-- Admins pueden gestionar todos los proyectos
CREATE POLICY "Admins gestionan todos los proyectos" ON projects
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins pueden ver y gestionar todos los perfiles
CREATE POLICY "Admins gestionan todos los perfiles" ON profiles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
