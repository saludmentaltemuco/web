import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, HeartPulse, Share2, MessageSquareQuote, ArrowRight } from 'lucide-react';
import { createServerClient } from '@/lib/supabase/server';
import { getBlogPostBySlug } from '@/lib/supabase';
import { formatDate } from '@/lib';
import { DEFAULT_SETTINGS } from '@/types';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  const { data: post } = await getBlogPostBySlug(supabase, slug);
  
  if (!post) {
    return { title: 'Artículo no encontrado' };
  }

  return {
    title: `${post.title} | ${DEFAULT_SETTINGS.site_name}`,
    description: post.excerpt || post.content.slice(0, 160),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.content.slice(0, 160),
      images: post.featured_image ? [post.featured_image] : [],
      type: 'article',
      publishedTime: post.published_at || undefined,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const supabase: any = await createServerClient();
  const { data: post, error } = await getBlogPostBySlug(supabase, slug);

  if (error || !post) {
    notFound();
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      {/* Back link */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a todos los artículos
        </Link>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
          
          {/* Header */}
          <header className="mb-8 border-b border-slate-100 pb-8">
            {post.category && (
              <span className="text-xs font-bold uppercase tracking-wider text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full inline-block mb-3">
                {post.category}
              </span>
            )}
            
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-500">
              {post.published_at && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-primary-600" />
                  <span>Publicado el {formatDate(post.published_at)}</span>
                </div>
              )}
              <span>•</span>
              <span className="font-medium text-slate-600">{DEFAULT_SETTINGS.site_name}</span>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {post.tags.map((tag: any) => (
                  <span key={tag} className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full flex items-center gap-1">
                    <Tag className="w-3 h-3 text-slate-400" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-10 bg-slate-100 shadow-inner">
              <Image
                src={post.featured_image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed space-y-4 text-base">
            <div className="whitespace-pre-line leading-relaxed">
              {post.content}
            </div>
          </div>

          {/* Clinical Author & Appointment CTA Banner */}
          <div className="mt-14 p-8 rounded-3xl bg-gradient-to-br from-primary-950 to-slate-900 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 text-xs text-accent-300 font-bold uppercase tracking-wider">
                <HeartPulse className="w-4 h-4 text-accent-400" />
                <span>¿Necesitas apoyo profesional?</span>
              </div>
              <h3 className="text-xl font-bold">Agenda una sesión con nuestro equipo en Temuco u Online</h3>
              <p className="text-xs text-slate-300 max-w-md">
                Atención clínica personalizada con boleta para reembolso en Isapres y Seguros de Salud.
              </p>
            </div>
            
            <Link
              href="/contacto"
              className="whitespace-nowrap px-6 py-3.5 rounded-full bg-accent-500 hover:bg-accent-400 text-slate-950 font-bold text-xs shadow-md transition-all hover:scale-105 shrink-0 flex items-center gap-2"
            >
              <span>Solicitar Consulta</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </article>
    </div>
  );
}