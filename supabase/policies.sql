-- Habilitar RLS en las tablas principales
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Políticas para Profiles
-- 1. Cualquiera puede leer perfiles públicos (o solo registrados, dependiendo la regla estricta)
CREATE POLICY "Perfiles visibles para todos" ON profiles
FOR SELECT USING (true);

-- 2. El usuario solo puede actualizar su propio perfil
CREATE POLICY "Usuario actualiza su propio perfil" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Políticas para Projects
-- 1. Cualquiera puede ver proyectos 'publicados'
CREATE POLICY "Proyectos publicados son públicos" ON projects
FOR SELECT USING (status = 'publicado');

-- 2. Emprendedores pueden ver, actualizar y borrar sus propios proyectos sin importar el estado
CREATE POLICY "Propietario gestiona sus proyectos" ON projects
FOR ALL USING (auth.uid() = owner_id);

-- Políticas para Contact Requests
-- 1. Inversores pueden ver sus propias solicitudes enviadas
CREATE POLICY "Inversores ven sus solicitudes" ON contact_requests
FOR SELECT USING (auth.uid() = investor_id);

-- 2. Emprendedores pueden ver las solicitudes recibidas a sus proyectos
CREATE POLICY "Emprendedores ven solicitudes de sus proyectos" ON contact_requests
FOR SELECT USING (
  project_id IN (
    SELECT id FROM projects WHERE owner_id = auth.uid()
  )
);

-- 3. Inversores pueden insertar solicitudes de contacto
CREATE POLICY "Inversores pueden crear solicitudes" ON contact_requests
FOR INSERT WITH CHECK (auth.uid() = investor_id);
