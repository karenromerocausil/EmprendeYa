-- =============================================================
-- INNOVA LINK – Seed de Datos de Demostración
-- Ejecutar en: Supabase → SQL Editor
-- =============================================================

-- Paso 1: Asegurar categorías base
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

-- =============================================================
-- EVENTOS (3 ejemplos)
-- =============================================================
INSERT INTO events (name, description, event_date, location, modality, organizer, external_link, status, category_id)
SELECT
  'Feria de Emprendimiento Montería 2026',
  'El evento de emprendimiento más importante de la región Caribe. Conecta emprendedores, inversores y entidades de apoyo en un espacio de networking, showcases de proyectos y conferencias magistrales con referentes nacionales.',
  NOW() + INTERVAL '20 days',
  'Centro de Convenciones de Montería, Cra. 2 #69-130',
  'Presencial',
  'Cámara de Comercio de Montería',
  'https://www.camaramonteria.gov.co',
  'próximo',
  (SELECT id FROM categories WHERE name = 'Tecnología y Software')
UNION ALL
SELECT
  'Bootcamp de Innovación Agro-Tech',
  'Tres días intensivos de formación práctica en tecnologías para el campo: drones agrícolas, sensores IoT, análisis de datos para cosechas y financiamiento verde. Dirigido a productores y emprendedores rurales del departamento de Córdoba.',
  NOW() + INTERVAL '35 days',
  'Universidad de Córdoba, Campus Berastegui',
  'Híbrido',
  'Universidad de Córdoba – Facultad de Ingeniería',
  'https://www.unicordoba.edu.co',
  'próximo',
  (SELECT id FROM categories WHERE name = 'Agricultura y Agrotech')
UNION ALL
SELECT
  'Demo Day INNOVA LINK – Ronda de Inversión',
  'Jornada de pitches donde los 10 mejores proyectos de la plataforma presentan ante un panel de ángeles inversionistas y fondos de capital semilla. Cupos limitados para observadores. Transmisión en vivo disponible.',
  NOW() + INTERVAL '45 days',
  'Hotel Sinu, Montería',
  'Híbrido',
  'INNOVA LINK',
  'https://innovalink.co/demoday',
  'próximo',
  (SELECT id FROM categories WHERE name = 'Fintech')
ON CONFLICT DO NOTHING;

-- =============================================================
-- CONVOCATORIAS (3 ejemplos)
-- =============================================================
INSERT INTO opportunities (name, description, organizer, open_date, close_date, benefits, external_link, status, category_id)
SELECT
  'Fondo de Innovación Regional Córdoba 2026',
  'La Gobernación de Córdoba abre convocatoria para financiar proyectos de innovación con impacto social y económico en el departamento. Se priorizan iniciativas en tecnología, agro y economía circular con capacidad de generar empleo local.',
  'Gobernación de Córdoba – Secretaría de Desarrollo Económico',
  NOW() - INTERVAL '5 days',
  NOW() + INTERVAL '60 days',
  'Capital semilla de hasta $50.000.000 COP + mentoría durante 6 meses + red de aliados regionales',
  'https://www.cordoba.gov.co/convocatorias',
  'abierta',
  (SELECT id FROM categories WHERE name = 'Tecnología y Software')
UNION ALL
SELECT
  'Reto Emprendedor SENA 2026 – Región Caribe',
  'El SENA lanza su convocatoria anual para apoyar emprendimientos formalizados con menos de 3 años de operación. Los ganadores acceden a créditos condonables, capacitaciones especializadas y visibilidad en ferias nacionales.',
  'SENA – Centro de Comercio y Servicios Montería',
  NOW() - INTERVAL '10 days',
  NOW() + INTERVAL '30 days',
  'Crédito condonable hasta $30.000.000 COP + 4 meses de acompañamiento técnico gratuito',
  'https://www.sena.edu.co/reto-emprendedor',
  'abierta',
  (SELECT id FROM categories WHERE name = 'Comercio Electrónico')
UNION ALL
SELECT
  'Convocatoria EcoInnova – Emprendimiento Verde',
  'Programa de aceleración para startups con modelos de negocio sostenibles: energías renovables, gestión de residuos, agricultura orgánica y ecoturismo. Financiado por cooperación internacional.',
  'Fondo Acción Colombia – Alianza Verde',
  NOW() + INTERVAL '15 days',
  NOW() + INTERVAL '75 days',
  'Hasta $80.000.000 COP + acceso a mercados internacionales + certificación en sostenibilidad',
  'https://www.fondoaccion.org/ecoinnnova',
  'próxima',
  (SELECT id FROM categories WHERE name = 'Sostenibilidad y Medio Ambiente')
ON CONFLICT DO NOTHING;

-- =============================================================
-- CURSOS (4 ejemplos)
-- =============================================================
INSERT INTO courses (name, description, provider, modality, price, duration, level, external_link, category_id)
SELECT
  'Finanzas para Emprendedores desde Cero',
  'Aprende a manejar el dinero de tu negocio: flujo de caja, punto de equilibrio, estados financieros básicos e indicadores clave. Curso práctico con casos reales de emprendimientos colombianos.',
  'SENA – Sofía Plus',
  'Virtual',
  'Gratuito',
  '40 horas',
  'Básico',
  'https://sofia.sena.edu.co',
  (SELECT id FROM categories WHERE name = 'Fintech')
UNION ALL
SELECT
  'Marketing Digital para Negocios Locales',
  'Domina las herramientas de marketing digital: redes sociales, pauta en Meta y Google, email marketing, SEO local y creación de contenido. Diseñado especialmente para negocios en ciudades intermedias de Colombia.',
  'Universidad de Córdoba – Educación Continua',
  'Virtual',
  '$120.000 COP',
  '32 horas',
  'Básico',
  'https://www.unicordoba.edu.co/educacion-continua',
  (SELECT id FROM categories WHERE name = 'Comercio Electrónico')
UNION ALL
SELECT
  'Pitch Perfecto: Presenta tu Startup a Inversores',
  'Técnicas de presentación, storytelling financiero y construcción de un deck de inversión efectivo. Al finalizar tendrás un pitch pulido listo para presentar ante inversores ángel y fondos de capital semilla.',
  'Endeavor Colombia',
  'Virtual',
  '$250.000 COP',
  '16 horas',
  'Intermedio',
  'https://www.endeavor.org.co/pitch',
  (SELECT id FROM categories WHERE name = 'Tecnología y Software')
UNION ALL
SELECT
  'Agricultura Inteligente: Tecnología para el Campo',
  'Introducción al uso de drones, sensores remotos, aplicaciones de gestión agrícola y acceso a mercados digitales. Ideal para productores agrícolas y emprendedores rurales del Caribe colombiano.',
  'Ministerio de Agricultura – Agronet',
  'Presencial',
  'Gratuito',
  '60 horas',
  'Básico',
  'https://www.agronet.gov.co/cursos',
  (SELECT id FROM categories WHERE name = 'Agricultura y Agrotech')
ON CONFLICT DO NOTHING;

-- =============================================================
-- PROYECTOS
-- Los proyectos necesitan un owner_id real de la tabla profiles.
-- Este bloque detecta automáticamente el primer emprendedor existente.
-- =============================================================
DO $$
DECLARE
  v_owner UUID;
  v_cat_tech UUID;
  v_cat_agro UUID;
  v_cat_food UUID;
  v_cat_edu  UUID;
BEGIN
  SELECT id INTO v_owner FROM profiles WHERE role = 'emprendedor' LIMIT 1;

  IF v_owner IS NULL THEN
    RAISE NOTICE 'No se encontro ningun emprendedor. Crea un usuario con rol emprendedor primero y vuelve a ejecutar.';
    RETURN;
  END IF;

  SELECT id INTO v_cat_tech FROM categories WHERE name = 'Tecnología y Software';
  SELECT id INTO v_cat_agro FROM categories WHERE name = 'Agricultura y Agrotech';
  SELECT id INTO v_cat_food FROM categories WHERE name = 'Alimentación y Gastronomía';
  SELECT id INTO v_cat_edu  FROM categories WHERE name = 'Educación';

  INSERT INTO projects (owner_id, name, short_description, full_description, category_id, stage, location, status)
  VALUES
  (
    v_owner,
    'AgroSmart Córdoba',
    'Plataforma IoT para monitoreo de cultivos de maíz y ñame en tiempo real.',
    'AgroSmart conecta sensores de suelo, clima y riego instalados en predios agrícolas del departamento de Córdoba con una app móvil que alerta al agricultor sobre condiciones óptimas de siembra y cosecha. Reducimos la pérdida de cosecha hasta un 35% y optimizamos el uso del agua en un 40%. Actualmente operamos en 3 fincas piloto en Los Córdobas.',
    v_cat_agro,
    'MVP',
    'Los Córdobas, Córdoba',
    'publicado'
  ),
  (
    v_owner,
    'EduLink Montería',
    'App de tutoría personalizada entre universitarios y estudiantes de bachillerato.',
    'EduLink conecta estudiantes de bachillerato con tutores universitarios de Montería mediante videollamadas y sesiones en vivo a precios accesibles. Los tutores ganan un ingreso extra mientras estudian y los bachilleres mejoran sus resultados académicos. Hemos completado más de 500 sesiones con una calificación promedio de 4.8/5.',
    v_cat_edu,
    'Traccion',
    'Montería, Córdoba',
    'publicado'
  ),
  (
    v_owner,
    'Sabor Costeño Digital',
    'Marketplace de productos gastronómicos artesanales del Caribe colombiano.',
    'Conectamos productores artesanales de la Costa Caribe (dulces, salsas, encurtidos, ahumados) con consumidores en Bogotá, Medellín y Barranquilla. Ofrecemos logística refrigerada puerta a puerta y packaging sostenible. Primer año: 45 productores aliados, $80M COP en ventas acumuladas.',
    v_cat_food,
    'Traccion',
    'Montería, Córdoba',
    'publicado'
  ),
  (
    v_owner,
    'InnoCode Academy',
    'Escuela de programación para jóvenes de zonas rurales con conectividad limitada.',
    'InnoCode Academy lleva cursos de programación, robótica y emprendimiento digital a municipios de Córdoba con baja conectividad mediante kits de aprendizaje offline + sesiones presenciales mensuales. Nuestro modelo ya operó en Tierralta, Puerto Libertador y San José de Uré con 120 jóvenes formados.',
    v_cat_tech,
    'Escalamiento',
    'Tierralta, Córdoba',
    'publicado'
  )
  ON CONFLICT DO NOTHING;

  RAISE NOTICE 'Proyectos demo creados correctamente para el usuario %', v_owner;
END $$;
