import { Suspense } from 'react';
import Link from 'next/link';
import { Hero, ServicesSection, WhyChooseUs, LeadFormSection, CTASection } from '@/components/sections';
import { createServerClient } from '@/lib/supabase/server';
import { getBlogPosts } from '@/lib/supabase';
import { ArrowRight, BookOpen, Clock, Calendar } from 'lucide-react';

export const revalidate = 60;

async function RecentBlogSection() {
  const supabase: any = await createServerClient();
  const { data: posts } = await getBlogPosts(supabase, { limit: 3 });

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-primary-600 tracking-widest uppercase bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Divulgación y Bienestar
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Artículos y Recursos de Salud Mental
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Consejos clínicos, herramientas para el manejo de emociones y reflexiones de nuestro equipo profesional.
            </p>
          </div>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 hover:text-accent-600 transition-colors self-start md:self-auto"
          >
            <span>Ver todos los artículos</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <article
              key={post.id}
              className="flex flex-col bg-slate-50 hover:bg-white rounded-3xl p-6 border border-slate-100 hover:border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 group"
            >
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3">
                <span className="bg-primary-100 text-primary-800 font-semibold px-2.5 py-1 rounded-full text-[11px]">
                  {post.category || 'Salud Mental'}
                </span>
                {post.published_at && (
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.published_at).toLocaleDateString('es-CL', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                )}
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-2">
                <Link href={`/blog/${post.slug}`}>
                  {post.title}
                </Link>
              </h3>

              <p className="text-xs text-slate-600 line-clamp-3 mb-4 leading-relaxed flex-1">
                {post.excerpt || 'Haz clic para leer el artículo completo con recomendaciones y pautas terapéuticas.'}
              </p>

              <div className="pt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-semibold text-primary-600 group-hover:text-accent-600 flex items-center gap-1 transition-colors"
                >
                  <span>Leer artículo</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesSection />
      <WhyChooseUs />
      
      <Suspense fallback={<div className="py-12 text-center text-slate-400 text-xs">Cargando artículos...</div>}>
        <RecentBlogSection />
      </Suspense>

      <LeadFormSection />
      <CTASection />
    </>
  );
}