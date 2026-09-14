-- Insertar categorías base para usar en proyectos, eventos, convocatorias y cursos
INSERT INTO categories (name) VALUES
('Tecnología y Software'),
('Salud y Bienestar'),
('Educación'),
('Sostenibilidad y Medio Ambiente'),
('Comercio Electrónico'),
('Alimentación y Gastronomía'),
('Moda y Diseño'),
('Turismo y Hospitalidad'),
('Agricultura y Agrotech'),
('Fintech')
ON CONFLICT (name) DO NOTHING;
