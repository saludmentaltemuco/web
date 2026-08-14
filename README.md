# Salud Mental Temuco (saludmentaltemuco.cl)

Plataforma integral de psicología, psicoterapia y bienestar emocional para **Salud Mental Temuco**.

## Tecnologías Principales
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Base de Datos & Auth**: Supabase
- **Correos Transaccionales**: Resend
- **Integraciones**: Meta Graph API (Facebook / Instagram Autopublishing)

## Estructura del Proyecto
- `/src/app`: Páginas públicas (Inicio, Especialidades, Nosotros, Blog, Contacto).
- `/src/app/admin`: Panel de control (Dashboard, Consultas de Pacientes / Leads, Blog & Divulgación, Configuración de APIs).
- `/src/components`: Componentes modulares UI, secciones, blog y widgets.
- `/src/lib/supabase`: Helpers para conexión a Supabase y operaciones CRUD.

## Configuración Local
1. Copia `.env.example` a `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
2. Completa tus credenciales de Supabase y Resend.
3. Instala dependencias y corre el servidor de desarrollo:
   ```bash
   npm install
   npm run dev
   ```

## Base de Datos
Ejecuta el script `setup_database.sql` en el SQL Editor de tu proyecto de Supabase para inicializar las tablas y políticas de seguridad (RLS).