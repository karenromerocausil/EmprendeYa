import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Read .env.local manually to ensure values are loaded without needing dotenv
const envPath = path.resolve(process.cwd(), '.env.local');
let envVars = {};
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log("Connecting to Supabase at:", supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  console.error("❌ Missing Supabase URL or Key");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seed() {
  console.log("🌱 Step 1: Seeding categories...");
  const categories = [
    { name: 'Tecnología y Software' },
    { name: 'Salud y Bienestar' },
    { name: 'Educación' },
    { name: 'Sostenibilidad y Medio Ambiente' },
    { name: 'Comercio Electrónico' },
    { name: 'Alimentación y Gastronomía' },
    { name: 'Moda y Diseño' },
    { name: 'Turismo y Hospitalidad' },
    { name: 'Agricultura y Agrotech' },
    { name: 'Fintech' }
  ];

  const { data: catData, error: catError } = await supabase
    .from('categories')
    .upsert(categories, { onConflict: 'name' })
    .select();

  if (catError) {
    console.error("❌ Error seeding categories:", catError.message);
  } else {
    console.log("✅ Categories ready:", catData?.length);
  }

  // Fetch category map
  const { data: allCats } = await supabase.from('categories').select('id, name');
  const catMap = Object.fromEntries((allCats || []).map(c => [c.name, c.id]));

  // 1. Events
  console.log("🌱 Step 2: Seeding events...");
  const events = [
    {
      name: 'Feria de Emprendimiento Montería 2026',
      description: 'El evento de emprendimiento más importante de la región Caribe. Conecta emprendedores, inversores y entidades de apoyo en un espacio de networking, showcases de proyectos y conferencias magistrales con referentes nacionales.',
      event_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Centro de Convenciones de Montería, Cra. 2 #69-130',
      modality: 'Presencial',
      organizer: 'Cámara de Comercio de Montería',
      external_link: 'https://www.camaramonteria.gov.co',
      status: 'próximo',
      category_id: catMap['Tecnología y Software']
    },
    {
      name: 'Bootcamp de Innovación Agro-Tech',
      description: 'Tres días intensivos de formación práctica en tecnologías para el campo: drones agrícolas, sensores IoT, análisis de datos para cosechas y financiamiento verde. Dirigido a productores y emprendedores rurales del departamento de Córdoba.',
      event_date: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Universidad de Córdoba, Campus Berastegui',
      modality: 'Híbrido',
      organizer: 'Universidad de Córdoba – Facultad de Ingeniería',
      external_link: 'https://www.unicordoba.edu.co',
      status: 'próximo',
      category_id: catMap['Agricultura y Agrotech']
    },
    {
      name: 'Demo Day INNOVA LINK – Ronda de Inversión',
      description: 'Jornada de pitches donde los 10 mejores proyectos de la plataforma presentan ante un panel de ángeles inversionistas y fondos de capital semilla. Cupos limitados para observadores. Transmisión en vivo disponible.',
      event_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      location: 'Hotel Sinu, Montería',
      modality: 'Híbrido',
      organizer: 'INNOVA LINK',
      external_link: 'https://innovalink.co/demoday',
      status: 'próximo',
      category_id: catMap['Fintech']
    }
  ];

  for (const ev of events) {
    const { error } = await supabase.from('events').insert(ev);
    if (error) console.log(`Notice (Event '${ev.name}'):`, error.message);
    else console.log(`✅ Event inserted: ${ev.name}`);
  }

  // 2. Opportunities (Convocatorias)
  console.log("🌱 Step 3: Seeding opportunities (Convocatorias)...");
  const opps = [
    {
      name: 'Fondo de Innovación Regional Córdoba 2026',
      description: 'La Gobernación de Córdoba abre convocatoria para financiar proyectos de innovación con impacto social y económico en el departamento. Se priorizan iniciativas en tecnología, agro y economía circular con capacidad de generar empleo local.',
      organizer: 'Gobernación de Córdoba – Secretaría de Desarrollo Económico',
      open_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      close_date: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      benefits: 'Capital semilla de hasta $50.000.000 COP + mentoría durante 6 meses + red de aliados regionales',
      external_link: 'https://www.cordoba.gov.co/convocatorias',
      status: 'abierta',
      category_id: catMap['Tecnología y Software']
    },
    {
      name: 'Reto Emprendedor SENA 2026 – Región Caribe',
      description: 'El SENA lanza su convocatoria anual para apoyar emprendimientos formalizados con menos de 3 años de operación. Los ganadores acceden a créditos condonables, capacitaciones especializadas y visibilidad en ferias nacionales.',
      organizer: 'SENA – Centro de Comercio y Servicios Montería',
      open_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      close_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      benefits: 'Crédito condonable hasta $30.000.000 COP + 4 meses de acompañamiento técnico gratuito',
      external_link: 'https://www.sena.edu.co/reto-emprendedor',
      status: 'abierta',
      category_id: catMap['Comercio Electrónico']
    },
    {
      name: 'Convocatoria EcoInnova – Emprendimiento Verde',
      description: 'Programa de aceleración para startups con modelos de negocio sostenibles: energías renovables, gestión de residuos, agricultura orgánica y ecoturismo. Financiado por cooperación internacional.',
      organizer: 'Fondo Acción Colombia – Alianza Verde',
      open_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      close_date: new Date(Date.now() + 75 * 24 * 60 * 60 * 1000).toISOString(),
      benefits: 'Hasta $80.000.000 COP + acceso a mercados internacionales + certificación en sostenibilidad',
      external_link: 'https://www.fondoaccion.org/ecoinnnova',
      status: 'próxima',
      category_id: catMap['Sostenibilidad y Medio Ambiente']
    }
  ];

  for (const opp of opps) {
    const { error } = await supabase.from('opportunities').insert(opp);
    if (error) console.log(`Notice (Opportunity '${opp.name}'):`, error.message);
    else console.log(`✅ Opportunity inserted: ${opp.name}`);
  }

  // 3. Courses
  console.log("🌱 Step 4: Seeding courses...");
  const courses = [
    {
      name: 'Finanzas para Emprendedores desde Cero',
      description: 'Aprende a manejar el dinero de tu negocio: flujo de caja, punto de equilibrio, estados financieros básicos e indicadores clave. Curso práctico con casos reales de emprendimientos colombianos.',
      provider: 'SENA – Sofía Plus',
      modality: 'Virtual',
      price: 'Gratuito',
      duration: '40 horas',
      level: 'Básico',
      external_link: 'https://sofia.sena.edu.co',
      category_id: catMap['Fintech']
    },
    {
      name: 'Marketing Digital para Negocios Locales',
      description: 'Domina las herramientas de marketing digital: redes sociales, pauta en Meta y Google, email marketing, SEO local y creación de contenido. Diseñado especialmente para negocios en ciudades intermedias de Colombia.',
      provider: 'Universidad de Córdoba – Educación Continua',
      modality: 'Virtual',
      price: '$120.000 COP',
      duration: '32 horas',
      level: 'Básico',
      external_link: 'https://www.unicordoba.edu.co/educacion-continua',
      category_id: catMap['Comercio Electrónico']
    },
    {
      name: 'Pitch Perfecto: Presenta tu Startup a Inversores',
      description: 'Técnicas de presentación, storytelling financiero y construcción de un deck de inversión efectivo. Al finalizar tendrás un pitch pulido listo para presentar ante inversores ángel y fondos de capital semilla.',
      provider: 'Endeavor Colombia',
      modality: 'Virtual',
      price: '$250.000 COP',
      duration: '16 horas',
      level: 'Intermedio',
      external_link: 'https://www.endeavor.org.co/pitch',
      category_id: catMap['Tecnología y Software']
    },
    {
      name: 'Agricultura Inteligente: Tecnología para el Campo',
      description: 'Introducción al uso de drones, sensores remotos, aplicaciones de gestión agrícola y acceso a mercados digitales. Ideal para productores agrícolas y emprendedores rurales del Caribe colombiano.',
      provider: 'Ministerio de Agricultura – Agronet',
      modality: 'Presencial',
      price: 'Gratuito',
      duration: '60 horas',
      level: 'Básico',
      external_link: 'https://www.agronet.gov.co/cursos',
      category_id: catMap['Agricultura y Agrotech']
    }
  ];

  for (const course of courses) {
    const { error } = await supabase.from('courses').insert(course);
    if (error) console.log(`Notice (Course '${course.name}'):`, error.message);
    else console.log(`✅ Course inserted: ${course.name}`);
  }

  // 4. Projects
  console.log("🌱 Step 5: Checking profiles for projects...");
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id, name, role');

  if (profError) {
    console.error("❌ Error reading profiles:", profError.message);
  }

  if (profiles && profiles.length > 0) {
    const owner = profiles.find(p => p.role === 'emprendedor') || profiles[0];
    console.log(`👤 Using profile [${owner.id}] (${owner.name || 'Sin Nombre'}, rol: ${owner.role}) as project owner.`);

    const projects = [
      {
        owner_id: owner.id,
        name: 'AgroSmart Córdoba',
        short_description: 'Plataforma IoT para monitoreo de cultivos de maíz y ñame en tiempo real.',
        full_description: 'AgroSmart conecta sensores de suelo, clima y riego instalados en predios agrícolas del departamento de Córdoba con una app móvil que alerta al agricultor sobre condiciones óptimas de siembra y cosecha. Reducimos la pérdida de cosecha hasta un 35% y optimizamos el uso del agua en un 40%. Actualmente operamos en 3 fincas piloto en Los Córdobas.',
        category_id: catMap['Agricultura y Agrotech'],
        stage: 'MVP',
        location: 'Los Córdobas, Córdoba',
        status: 'publicado'
      },
      {
        owner_id: owner.id,
        name: 'EduLink Montería',
        short_description: 'App de tutoría personalizada entre universitarios y estudiantes de bachillerato.',
        full_description: 'EduLink conecta estudiantes de bachillerato con tutores universitarios de Montería mediante videollamadas y sesiones en vivo a precios accesibles. Los tutores ganan un ingreso extra mientras estudian y los bachilleres mejoran sus resultados académicos. Hemos completado más de 500 sesiones con una calificación promedio de 4.8/5.',
        category_id: catMap['Educación'],
        stage: 'Traccion',
        location: 'Montería, Córdoba',
        status: 'publicado'
      },
      {
        owner_id: owner.id,
        name: 'Sabor Costeño Digital',
        short_description: 'Marketplace de productos gastronómicos artesanales del Caribe colombiano.',
        full_description: 'Conectamos productores artesanales de la Costa Caribe (dulces, salsas, encurtidos, ahumados) con consumidores en Bogotá, Medellín y Barranquilla. Ofrecemos logística refrigerada puerta a puerta y packaging sostenible. Primer año: 45 productores aliados, $80M COP en ventas acumuladas.',
        category_id: catMap['Alimentación y Gastronomía'],
        stage: 'Traccion',
        location: 'Montería, Córdoba',
        status: 'publicado'
      },
      {
        owner_id: owner.id,
        name: 'InnoCode Academy',
        short_description: 'Escuela de programación para jóvenes de zonas rurales con conectividad limitada.',
        full_description: 'InnoCode Academy lleva cursos de programación, robótica y emprendimiento digital a municipios de Córdoba con baja conectividad mediante kits de aprendizaje offline + sesiones presenciales mensuales. Nuestro modelo ya operó en Tierralta, Puerto Libertador y San José de Uré con 120 jóvenes formados.',
        category_id: catMap['Tecnología y Software'],
        stage: 'Escalamiento',
        location: 'Tierralta, Córdoba',
        status: 'publicado'
      }
    ];

    for (const proj of projects) {
      const { error } = await supabase.from('projects').insert(proj);
      if (error) console.log(`Notice (Project '${proj.name}'):`, error.message);
      else console.log(`✅ Project inserted: ${proj.name}`);
    }
  } else {
    console.log("⚠️ No user profiles found in 'profiles' table. Projects require at least one registered profile.");
  }

  console.log("\n🎉 Seed completed!");
}

seed().catch(err => console.error("Unhandled error in seed script:", err));
