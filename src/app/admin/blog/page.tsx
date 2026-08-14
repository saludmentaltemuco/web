'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { 
  FileText, 
  Plus, 
  Search, 
  Share2, 
  Globe, 
  Trash2, 
  CheckCircle2, 
  Upload, 
  ExternalLink,
  Eye,
  Calendar,
  Sparkles
} from 'lucide-react';
import { BLOG_CATEGORIES } from '@/types';

interface BlogPostItem {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  category?: string | null;
  featured_image?: string | null;
  fb_image_url?: string | null;
  ig_image_url?: string | null;
  social_caption?: string | null;
  publish_to_fb?: boolean;
  publish_to_ig?: boolean;
  fb_post_id?: string | null;
  ig_media_id?: string | null;
  published: boolean;
  published_at?: string | null;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewForm, setShowNewForm] = useState(false);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: BLOG_CATEGORIES[0] as string,
    featured_image: '',
    fb_image_url: '',
    ig_image_url: '',
    social_caption: '',
    publish_to_fb: true,
    publish_to_ig: false,
  });

  const [creating, setCreating] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { data, error: fetchError } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setPosts(data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar artículos');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadFile = async (file: File, fieldName: 'featured_image' | 'fb_image_url' | 'ig_image_url') => {
    setUploadingField(fieldName);
    const supabase = createAdminBrowserClient() as any;
    const fileExt = file.name.split('.').pop();
    const fileName = `blog-${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${fileExt}`;
    const filePath = `blog/${fileName}`;

    try {
      const { error: uploadErr } = await supabase.storage
        .from('properties')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
          contentType: file.type || 'image/jpeg',
        });

      if (uploadErr) throw uploadErr;

      const { data: { publicUrl } } = supabase.storage
        .from('properties')
        .getPublicUrl(filePath);

      if (publicUrl) {
        setNewPost(prev => ({ ...prev, [fieldName]: publicUrl }));
      }
    } catch (err: any) {
      alert(`Error al subir imagen: ${err.message || err}`);
    } finally {
      setUploadingField(null);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const supabase = createAdminBrowserClient() as any;
      const slug = newPost.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .substring(0, 100);

      const { error: createError } = await supabase
        .from('blog_posts')
        .insert([{
          title: newPost.title,
          slug,
          content: newPost.content,
          excerpt: newPost.excerpt,
          category: newPost.category || 'Ansiedad y Estrés',
          featured_image: newPost.featured_image || null,
          fb_image_url: newPost.fb_image_url || null,
          ig_image_url: newPost.ig_image_url || null,
          social_caption: newPost.social_caption || null,
          publish_to_fb: newPost.publish_to_fb,
          publish_to_ig: newPost.publish_to_ig,
          published: false,
          published_at: null,
        }]);

      if (createError) throw createError;

      setNewPost({ 
        title: '', 
        content: '', 
        excerpt: '', 
        category: BLOG_CATEGORIES[0], 
        featured_image: '', 
        fb_image_url: '', 
        ig_image_url: '', 
        social_caption: '', 
        publish_to_fb: true, 
        publish_to_ig: false 
      });
      setShowNewForm(false);
      fetchPosts();
    } catch (err: any) {
      alert('Error al crear el artículo: ' + err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostItem) => {
    try {
      const supabase = createAdminBrowserClient() as any;
      const newPublished = !post.published;
      
      const { error: updateError } = await supabase
        .from('blog_posts')
        .update({ 
          published: newPublished,
          published_at: newPublished ? new Date().toISOString() : null,
        })
        .eq('id', post.id);

      if (updateError) throw updateError;

      setPosts(posts.map(p => 
        p.id === post.id ? { ...p, published: newPublished, published_at: newPublished ? new Date().toISOString() : null } : p
      ));

      // Trigger social media autopublishing if turning active
      if (newPublished && (post.publish_to_fb || post.publish_to_ig)) {
        try {
          const res = await fetch('/api/admin/blog/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId: post.id }),
          });
          const pubData = await res.json();
          if (pubData.success && pubData.results) {
            const fbMsg = pubData.results.facebook?.success ? 'Publicado en Facebook ✅. ' : (pubData.results.facebook ? `Error Facebook: ${pubData.results.facebook.error}. ` : '');
            const igMsg = pubData.results.instagram?.success ? 'Publicado en Instagram ✅. ' : (pubData.results.instagram ? `Error Instagram: ${pubData.results.instagram.error}. ` : '');
            if (fbMsg || igMsg) {
              alert(`Artículo publicado en el sitio web.\n${fbMsg}${igMsg}`);
            }
          } else if (pubData.error) {
            alert(`Artículo publicado en el sitio, pero la API de Meta reportó: ${pubData.error}`);
          }
          fetchPosts();
        } catch (publishErr: any) {
          alert(`Artículo publicado en el sitio, pero falló la conexión con redes sociales: ${publishErr.message || publishErr}`);
        }
      }
    } catch (err: any) {
      alert('Error al actualizar: ' + err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este artículo?')) return;

    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: deleteError } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      setPosts(posts.filter(p => p.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Blog & Divulgación en Salud Mental</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Crea artículos educativos y autopublícalos automáticamente en la Fanpage de Facebook e Instagram.
          </p>
        </div>

        <button
          onClick={() => setShowNewForm(!showNewForm)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
        >
          {showNewForm ? 'Cerrar Formulario' : '➕ Redactar Nuevo Artículo'}
        </button>
      </div>

      {/* New Post Form Drawer / Card */}
      {showNewForm && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-100 pb-4">
            <Sparkles className="w-5 h-5 text-accent-600" />
            <h2 className="text-lg font-bold text-slate-900">Nuevo Artículo de Salud Mental</h2>
          </div>

          <form onSubmit={handleCreatePost} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título del Artículo *
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                  placeholder="Ej: 5 Estrategias para Gestionar el Estrés Laboral"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                  Categoría
                </label>
                <select
                  value={newPost.category}
                  onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 font-medium"
                >
                  {BLOG_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Featured Image */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Imagen Principal / Cabecera (Subir archivo o pegar URL)
              </label>
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUploadFile(file, 'featured_image');
                  }}
                  className="w-full sm:w-auto text-xs text-slate-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100 cursor-pointer"
                />
                <input
                  type="url"
                  value={newPost.featured_image}
                  onChange={(e) => setNewPost({ ...newPost, featured_image: e.target.value })}
                  placeholder="O pega aquí la URL pública de la imagen (https://...)"
                  className="w-full flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900"
                />
              </div>
              {uploadingField === 'featured_image' && <p className="text-xs text-slate-500 mt-1">Subiendo archivo a storage...</p>}
              {newPost.featured_image && (
                <img src={newPost.featured_image} className="mt-2 h-24 rounded-2xl object-cover border border-slate-200" alt="Vista previa" />
              )}
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Resumen / Extracto (1 o 2 oraciones)
              </label>
              <textarea
                rows={2}
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                placeholder="Breve introducción para la vista previa del artículo y redes sociales..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              />
            </div>

            {/* Content */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Cuerpo del Artículo *
              </label>
              <textarea
                rows={10}
                required
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Escribe aquí el contenido completo del artículo. Puedes usar subtítulos con ### o listas..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Social Autopublishing Section */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-primary-50/40 border border-primary-100 space-y-4">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-primary-600" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Autopublicación en Redes Sociales al Publicar
                </h3>
              </div>

              <div className="flex flex-wrap gap-6">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPost.publish_to_fb}
                    onChange={(e) => setNewPost({ ...newPost, publish_to_fb: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>🔵 Publicar en Facebook Fanpage</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                  <input
                    type="checkbox"
                    checked={newPost.publish_to_ig}
                    onChange={(e) => setNewPost({ ...newPost, publish_to_ig: e.target.checked })}
                    className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500"
                  />
                  <span>📸 Publicar en Instagram</span>
                </label>
              </div>

              {(newPost.publish_to_fb || newPost.publish_to_ig) && (
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">
                    Pie de foto / Caption para Redes Sociales
                  </label>
                  <textarea
                    rows={2}
                    value={newPost.social_caption}
                    onChange={(e) => setNewPost({ ...newPost, social_caption: e.target.value })}
                    placeholder="Texto llamativo con hashtags (#SaludMental #Temuco #Psicologia #Bienestar)..."
                    className="w-full p-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900"
                  />
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowNewForm(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={creating}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
              >
                {creating ? 'Guardando Artículo...' : 'Guardar como Borrador'}
              </button>
            </div>

          </form>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar artículos por título o categoría..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Cargando artículos...</div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-rose-500">{error}</div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No hay artículos registrados</p>
            <p className="text-xs text-slate-400">Haz clic en &quot;Redactar Nuevo Artículo&quot; para comenzar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Título & Resumen</th>
                  <th className="px-6 py-3.5">Categoría</th>
                  <th className="px-6 py-3.5">Estado Web</th>
                  <th className="px-6 py-3.5">Redes Sociales</th>
                  <th className="px-6 py-3.5">Fecha</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    <td className="px-6 py-4 max-w-sm">
                      <p className="font-bold text-slate-900 line-clamp-1">{post.title}</p>
                      {post.excerpt && (
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{post.excerpt}</p>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full">
                        {post.category || 'General'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        post.published 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {post.published ? '🟢 Publicado' : '⚪ Borrador'}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs">
                        {post.fb_post_id ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700" title={`ID FB: ${post.fb_post_id}`}>
                            FB Publicado ✓
                          </span>
                        ) : post.publish_to_fb ? (
                          <span className="text-[10px] text-slate-400">FB Pendiente</span>
                        ) : null}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(post.published_at || post.created_at).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-slate-100 transition-colors"
                          title="Ver en la web"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleTogglePublish(post)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                            post.published 
                              ? 'bg-amber-50 hover:bg-amber-100 text-amber-800' 
                              : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {post.published ? 'Pausar' : 'Publicar'}
                        </button>

                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                          title="Eliminar artículo"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}