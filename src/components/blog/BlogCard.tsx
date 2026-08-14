import Link from 'next/link';
import Image from 'next/image';
import { formatDate } from '@/lib';
import { BlogPost } from '@/types';
import { ArrowRight, Calendar } from 'lucide-react';

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <article className={`bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group-hover:-translate-y-1 h-full flex flex-col ${featured ? 'lg:grid lg:grid-cols-12' : ''}`}>
        
        {/* Image */}
        {post.featured_image ? (
          <div className={`relative overflow-hidden bg-slate-100 ${featured ? 'lg:col-span-6 aspect-[16/10] lg:aspect-auto min-h-[280px]' : 'aspect-[16/10]'}`}>
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes={featured ? '(min-width: 1024px) 50vw, 100vw' : '100vw'}
            />
          </div>
        ) : (
          <div className={`relative overflow-hidden bg-gradient-to-br from-primary-800 to-slate-900 ${featured ? 'lg:col-span-6 aspect-[16/10] lg:aspect-auto min-h-[280px]' : 'aspect-[16/10]'} flex items-center justify-center p-6 text-center text-white/80`}>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-300">
              {post.category || 'Salud Mental Temuco'}
            </span>
          </div>
        )}

        {/* Content */}
        <div className={`p-6 sm:p-8 flex flex-col justify-between flex-1 ${featured ? 'lg:col-span-6' : ''}`}>
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              {post.category && (
                <span className="text-[11px] font-bold text-primary-700 bg-primary-50 border border-primary-100 px-3 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              )}
              {post.published_at && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {formatDate(post.published_at, { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className={`font-bold text-slate-900 group-hover:text-primary-600 transition-colors leading-snug ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
              {post.title}
            </h3>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="mt-3 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                {post.excerpt}
              </p>
            )}
          </div>

          <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="font-semibold text-primary-600 group-hover:text-accent-600 flex items-center gap-1.5 transition-colors">
              <span>Leer artículo</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

      </article>
    </Link>
  );
}