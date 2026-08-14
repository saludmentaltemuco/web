-- Script para actualizar la propiedad y remover la primera imagen (1.png)
-- Ejecútalo en el SQL Editor de Supabase

UPDATE public.properties
SET images = ARRAY[
  '/properties/avenida-del-mar-1041/2.png',
  '/properties/avenida-del-mar-1041/3.png',
  '/properties/avenida-del-mar-1041/4.png'
]
WHERE slug = 'avenida-del-mar-la-serena-1041';
