-- Instrucciones: 
-- Copia y pega este script en el editor SQL de tu panel de Supabase (SQL Editor) 
-- para insertar la primera propiedad extraída.

INSERT INTO properties (
  title, 
  slug, 
  description, 
  price, 
  price_type, 
  property_type, 
  status, 
  address, 
  city, 
  region, 
  bedrooms, 
  bathrooms, 
  area, 
  parking_spaces, 
  features, 
  images
) VALUES (
  'Avenida del Mar, La Serena',
  'avenida-del-mar-la-serena-1041',
  'Condominio Playa Blanca. Valor 3.375 UF. ¡LIQUIDACIÓN BANCARIA EN LA SERENA! Excelente oportunidad de inversión. Depto en tercer piso, con ascensor, 3 amplios dormitorios, 2 baños, balcón con linda vista, cocina amoblada y equipada, logia interior 76 m2, estacionamiento y bodega. Ubicación Premium: Avenida Pacífico 2401, La Serena. A pasos de la Avenida del Mar, restaurantes, playas y con excelente conectividad.',
  3375,
  'sale',
  'apartment',
  'active',
  'Avenida Pacífico 2401',
  'La Serena',
  'Coquimbo',
  3,
  2,
  80,
  1,
  ARRAY['Ascensor', 'Balcón', 'Estacionamiento', 'Bodega', 'Piscina', 'Terraza', 'Cocina equipada'],
  ARRAY[
    '/properties/avenida-del-mar-1041/1.png', 
    '/properties/avenida-del-mar-1041/2.png', 
    '/properties/avenida-del-mar-1041/3.png', 
    '/properties/avenida-del-mar-1041/4.png'
  ]
);
