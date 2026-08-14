import { Suspense } from 'react';
import { BlogCard } from '@/components/blog';
import { createServerClient } from '@/lib/supabase/server';
import { getBlogPosts, getFeaturedBlogPost } from '@/lib/supabase';
import { DEFAULT_SETTINGS, BLOG_CATEGORIES } from '@/types';
import { HeartPulse, BookOpen, Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: `Blog de Salud Mental y Bienestar | ${DEFAULT_SETTINGS.site_name}`,
  description: 'Artículos, pautas psicológicas, reflexiones y recursos profesionales sobre bienestar emocional, ansiedad, crianza y terapia en Temuco.',
};

export default async function BlogPage() {
  const supabase: any = await createServerClient();
  
  const [featuredPostResult, postsResult] = await Promise.all([
    getFeaturedBlogPost(supabase),
    getBlogPosts(supabase, { limit: 12 }),
  ]);

  const { data: featuredPost } = featuredPostResult;
  const { data: posts } = postsResult;
  
  // Filter out featured post from regular posts
  const filteredPosts = posts?.filter((p: any) => p.id !== featuredPost?.id) || [];

  return (
    <div className="pt-28 pb-20 min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white py-16 md:py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold text-accent-400 tracking-widest uppercase bg-accent-500/10 border border-accent-400/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Espacio de Divulgación & Aprendizaje
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight max-w-3xl mx-auto">
            Blog de Salud Mental y Bienestar
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Consejos de psicólogos clínicos, herramientas prácticas para tu salud emocional y reflexiones para una vida más equilibrada.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-10 no-scrollbar">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 shrink-0">
            Temas:
          </span>
          {BLOG_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-white border border-slate-200 text-slate-700 shadow-sm shrink-0 hover:border-primary-400 hover:text-primary-600 cursor-pointer transition-colors"
            >
              {cat}
            </span>
          ))}
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-14">
            <div className="flex items-center gap-2 mb-4 text-sm font-bold text-primary-950">
              <Sparkles className="w-4 h-4 text-accent-600" />
              <span>Artículo Destacado</span>
            </div>
            <Suspense fallback={<div className="h-80 bg-white rounded-3xl animate-pulse" />}>
              <BlogCard post={featuredPost} featured />
            </Suspense>
          </div>
        )}

        {/* All Posts */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Todos los Artículos
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {posts?.length || 0} publicaciones
            </span>
          </div>

          <Suspense fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-72 bg-white rounded-3xl animate-pulse" />
              ))}
            </div>
          }>
            {filteredPosts && filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post: any) => (
                  <BlogCard key={post.id} post={post} />
                ))}
              </div>
            ) : !featuredPost ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 p-8">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600 font-medium">
                  Pronto compartiremos nuevos artículos y recursos de salud mental.
                </p>
              </div>
            ) : null}
          </Suspense>
        </div>

      </div>
    </div>
  );
}