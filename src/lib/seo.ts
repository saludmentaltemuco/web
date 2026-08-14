import { DEFAULT_SETTINGS } from '@/types';

export interface SEOData {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  locale?: string;
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://saludmentaltemuco.cl';
const DEFAULT_OG_IMAGE = `${SITE_URL}${DEFAULT_SETTINGS.seo.og_image}`;

/**
 * Generate complete meta tags for a page
 */
export function generateMetaTags(data: SEOData): {
  title: string;
  description: string;
  keywords?: string;
  openGraph: {
    title: string;
    description: string;
    url: string;
    siteName: string;
    images: Array<{ url: string; width: number; height: number; alt: string }>;
    locale: string;
    type: string;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    images: string[];
  };
} {
  const title = data.title || DEFAULT_SETTINGS.seo.default_title;
  const description = data.description || DEFAULT_SETTINGS.seo.default_description;
  const keywords = data.keywords || DEFAULT_SETTINGS.seo.default_keywords;
  const image = data.image || DEFAULT_OG_IMAGE;
  const url = data.url ? `${SITE_URL}${data.url}` : SITE_URL;
  const locale = data.locale || 'es_CL';

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      url,
      siteName: DEFAULT_SETTINGS.site_name,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale,
      type: data.type || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function generateBlogPostSchema(post: {
  title: string;
  excerpt?: string | null;
  content: string;
  publishedTime?: string | null;
  modifiedTime?: string | null;
  author?: string;
  image?: string | null;
  url?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    articleBody: post.content,
    datePublished: post.publishedTime,
    dateModified: post.modifiedTime || post.publishedTime,
    author: {
      '@type': 'Person',
      name: post.author || DEFAULT_SETTINGS.site_name,
    },
    publisher: {
      '@type': 'Organization',
      name: DEFAULT_SETTINGS.site_name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    ...(post.image && { image: post.image }),
    ...(post.url && { url: `${SITE_URL}${post.url}` }),
  };
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

/**
 * Generate organization / medical clinic structured data
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: DEFAULT_SETTINGS.site_name,
    description: DEFAULT_SETTINGS.site_description,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    image: `${SITE_URL}/og-default.jpg`,
    telephone: DEFAULT_SETTINGS.contact_phone,
    email: DEFAULT_SETTINGS.contact_email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: DEFAULT_SETTINGS.contact_address,
      addressLocality: 'Temuco',
      addressRegion: 'La Araucanía',
      addressCountry: 'CL',
    },
    medicalSpecialty: [
      'Psychology',
      'Psychiatry',
      'Psychotherapy',
    ],
    availableService: [
      {
        '@type': 'MedicalTherapy',
        name: 'Psicoterapia Individual Adultos',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Psicología Infanto-Juvenil',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Terapia de Pareja y Familiar',
      },
      {
        '@type': 'MedicalTherapy',
        name: 'Atención Psicológica Online',
      },
    ],
    ...(DEFAULT_SETTINGS.contact_whatsapp && {
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: `+${DEFAULT_SETTINGS.contact_whatsapp}`,
        contactType: 'customer service',
        availableLanguage: 'Spanish',
      },
    }),
    sameAs: Object.values(DEFAULT_SETTINGS.social_media).filter(Boolean),
  };
}

/**
 * Create SEO script tags for head
 */
export function generateSEOScripts(data: SEOData) {
  const scripts: string[] = [];

  // Organization schema (always included)
  scripts.push(JSON.stringify(generateOrganizationSchema()));

  // Additional schema if provided
  if (data.type === 'article' && data.publishedTime) {
    scripts.push(JSON.stringify(generateBlogPostSchema({
      title: data.title || '',
      content: '',
      publishedTime: data.publishedTime,
      modifiedTime: data.modifiedTime,
      author: data.author,
      image: data.image,
      url: data.url,
    })));
  }

  return scripts.map((script, i) => ({
    type: 'application/ld+json',
    key: `schema-${i}`,
    dangerouslySetInnerHTML: { __html: script },
  }));
}