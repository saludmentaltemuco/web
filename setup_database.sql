-- Script de Inicialización de Base de Datos para Salud Mental Temuco (saludmentaltemuco.cl)
-- Ejecuta este script en el SQL Editor de tu proyecto de Supabase

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabla profiles (Usuarios, Administradores, Especialistas)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'specialist', 'user')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Tabla leads (Consultas de Pacientes / Solicitud de Citas)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT,
  modality TEXT DEFAULT 'presencial' CHECK (modality IN ('presencial', 'online', 'ambas', 'no_definido')),
  message TEXT,
  notes TEXT,
  source TEXT DEFAULT 'website' CHECK (source IN ('website', 'whatsapp', 'referral', 'social')),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'scheduled', 'attended', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Tabla blog_posts (Artículos de Salud Mental y Bienestar)
CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  category TEXT DEFAULT 'Ansiedad y Estrés',
  tags TEXT[] DEFAULT '{}',
  published BOOLEAN DEFAULT false,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Tabla site_settings (Configuración del sitio y claves API de Redes Sociales)
CREATE TABLE IF NOT EXISTS public.site_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Políticas de seguridad RLS

-- Profiles: lectura pública de perfiles, modificación solo por administradores o dueño
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Leads: inserción pública (formulario web), lectura y modificación solo para usuarios autenticados (admin/equipo)
CREATE POLICY "Anyone can create a lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads" ON public.leads
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update leads" ON public.leads
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete leads" ON public.leads
  FOR DELETE TO authenticated USING (true);

-- Blog Posts: lectura pública de posts publicados, CRUD completo para autenticados
CREATE POLICY "Published blog posts are viewable by everyone" ON public.blog_posts
  FOR SELECT USING (published = true OR auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can manage blog posts" ON public.blog_posts
  FOR ALL TO authenticated USING (true);

-- Site Settings: lectura pública, escritura solo para autenticados
CREATE POLICY "Public site settings are viewable by everyone" ON public.site_settings
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can manage site settings" ON public.site_settings
  FOR ALL TO authenticated USING (true);

-- Insertar artículo de bienvenida de ejemplo
INSERT INTO public.blog_posts (
  title, slug, excerpt, content, category, tags, published, published_at
) VALUES (
  '5 Consejos Prácticos para Gestionar la Ansiedad en el Día a Día',
  '5-consejos-para-gestionar-la-ansiedad',
  'Aprende herramientas respaldadas por la psicología clínica para reconocer los detonantes de la ansiedad y recuperar la calma emocional.',
  'La ansiedad es una respuesta natural del cuerpo ante situaciones de estrés o peligro percibido. Sin embargo, cuando se vuelve constante y desproporcionada, puede afectar significativamente nuestra calidad de vida, relaciones y rendimiento laboral.

En este artículo, compartimos cinco pautas fundamentales para comenzar a gestionar los momentos de mayor tensión:

### 1. Práctica de respiración diafragmática
Cuando experimentamos ansiedad, nuestra respiración suele volverse rápida y superficial. Dedicar 3 a 5 minutos a inhalar lentamente por la nariz en 4 tiempos y exhalar en 6 tiempos ayuda a activar el sistema nervioso parasimpático, reduciendo el ritmo cardíaco.

### 2. Identificar y cuestionar pensamientos automáticos
Nuestra mente tiende a anticipar los peores escenarios (catastrofización). Pregúntate: "¿Qué evidencia real tengo de que esto sucederá?" o "¿Qué es lo peor que podría pasar y cómo podría resolverlo?".

### 3. Establecer límites con la sobrecarga de información
El consumo excesivo de noticias y redes sociales puede sobreestimular el sistema nervioso. Define momentos específicos del día para desconectarte de las pantallas.

### 4. Mantener rutinas de descanso y movimiento físico
El ejercicio moderado libera endorfinas y reduce los niveles de cortisol. Del mismo modo, cuidar la higiene del sueño es indispensable para una adecuada regulación emocional.

### 5. Buscar apoyo profesional oportuno
La psicoterapia proporciona un espacio seguro, confidencial y herramientas personalizadas para comprender el origen de la ansiedad y transformarla. Si sientes que la preocupación interfiere en tu rutina, no dudes en consultar a un especialista.',
  'Ansiedad y Estrés',
  ARRAY['Salud Mental', 'Ansiedad', 'Psicología', 'Temuco', 'Bienestar'],
  true,
  now()
) ON CONFLICT (slug) DO NOTHING;
