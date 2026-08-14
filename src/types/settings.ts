export interface SiteSettings {
  site_name: string;
  site_tagline: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  whatsapp_avatar?: string;
  contact_address: string;
  opening_hours?: string;
  social_media: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
  };
  meta_api?: {
    page_id?: string;
    page_access_token?: string;
    instagram_business_id?: string;
  };
  seo: {
    default_title: string;
    default_description: string;
    default_keywords: string;
    og_image: string;
  };
}

export const DEFAULT_SETTINGS: SiteSettings = {
  site_name: 'Salud Mental Temuco',
  site_tagline: 'Centro de Psicología, Psicoterapia y Bienestar Emocional',
  site_description: 'Atención psicológica y psiquiátrica presencial en Temuco y online para todo Chile. Espacio profesional, confidencial y empático para tu salud mental.',
  contact_email: 'contacto@saludmentaltemuco.cl',
  contact_phone: '+56 9 8765 4321',
  contact_whatsapp: '56987654321',
  whatsapp_avatar: '/therapist.png',
  contact_address: 'Av. Alemania 0850, Oficina 402, Temuco, Chile',
  opening_hours: 'Lunes a Viernes: 08:30 a 20:00 hrs | Sábados: 09:00 a 14:00 hrs',
  social_media: {
    facebook: 'https://facebook.com/saludmentaltemuco',
    instagram: 'https://instagram.com/saludmentaltemuco',
    linkedin: 'https://linkedin.com/company/saludmentaltemuco',
  },
  meta_api: {
    page_id: '',
    page_access_token: '',
    instagram_business_id: '',
  },
  seo: {
    default_title: 'Salud Mental Temuco | Psicología y Psicoterapia en Temuco y Online',
    default_description: 'Especialistas en salud mental, psicoterapia individual, infantil, parejas y psiquiatría en Temuco. Atención presencial y online con boleta reembolsable.',
    default_keywords: 'salud mental temuco, psicologos en temuco, psicoterapia temuco, terapia de pareja temuco, psiquiatra temuco, atencion psicologica online chile, fonasa, isapre',
    og_image: '/images/og-salud-mental.jpg',
  },
};