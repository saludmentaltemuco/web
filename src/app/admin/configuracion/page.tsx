'use client';

import { useState, useEffect } from 'react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { Input } from '@/components/ui';
import { Button } from '@/components/ui';
import { 
  Building2, 
  Phone, 
  Share2, 
  Search, 
  Save, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  ExternalLink,
  HeartPulse,
  Clock
} from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

interface SettingsFormData {
  site_name: string;
  site_tagline: string;
  site_description: string;
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  opening_hours: string;
  facebook_url: string;
  instagram_url: string;
  linkedin_url: string;
  twitter_url: string;
  seo_default_title: string;
  seo_default_description: string;
  seo_default_keywords: string;
  og_image: string;
  meta_fb_page_id: string;
  meta_ig_business_id: string;
  meta_page_access_token: string;
}

export default function AdminConfiguracionPage() {
  const [settings, setSettings] = useState<SettingsFormData>({
    site_name: DEFAULT_SETTINGS.site_name,
    site_tagline: DEFAULT_SETTINGS.site_tagline,
    site_description: DEFAULT_SETTINGS.site_description,
    contact_email: DEFAULT_SETTINGS.contact_email,
    contact_phone: DEFAULT_SETTINGS.contact_phone,
    contact_whatsapp: DEFAULT_SETTINGS.contact_whatsapp,
    contact_address: DEFAULT_SETTINGS.contact_address,
    opening_hours: DEFAULT_SETTINGS.opening_hours || 'Lunes a Viernes: 08:30 a 20:00 hrs | Sábados: 09:00 a 14:00 hrs',
    facebook_url: DEFAULT_SETTINGS.social_media.facebook || '',
    instagram_url: DEFAULT_SETTINGS.social_media.instagram || '',
    linkedin_url: DEFAULT_SETTINGS.social_media.linkedin || '',
    twitter_url: '',
    seo_default_title: DEFAULT_SETTINGS.seo.default_title,
    seo_default_description: DEFAULT_SETTINGS.seo.default_description,
    seo_default_keywords: DEFAULT_SETTINGS.seo.default_keywords,
    og_image: DEFAULT_SETTINGS.seo.og_image,
    meta_fb_page_id: '',
    meta_ig_business_id: '',
    meta_page_access_token: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Test Meta Connection
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<{
    token: { ok: boolean; message: string; detail: string };
    facebook: { ok: boolean; message: string; detail: string };
    instagram: { ok: boolean; message: string; detail: string };
  } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('*');

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      const settingsMap: Record<string, string> = {};
      data?.forEach((setting: any) => {
        settingsMap[setting.key] = String(setting.value);
      });

      setSettings(prev => ({
        ...prev,
        site_name: settingsMap.site_name || prev.site_name,
        site_tagline: settingsMap.site_tagline || prev.site_tagline,
        site_description: settingsMap.site_description || prev.site_description,
        contact_email: settingsMap.contact_email || prev.contact_email,
        contact_phone: settingsMap.contact_phone || prev.contact_phone,
        contact_whatsapp: settingsMap.contact_whatsapp || prev.contact_whatsapp,
        contact_address: settingsMap.contact_address || prev.contact_address,
        opening_hours: settingsMap.opening_hours || prev.opening_hours,
        facebook_url: settingsMap.facebook_url || prev.facebook_url,
        instagram_url: settingsMap.instagram_url || prev.instagram_url,
        linkedin_url: settingsMap.linkedin_url || prev.linkedin_url,
        twitter_url: settingsMap.twitter_url || prev.twitter_url,
        seo_default_title: settingsMap.seo_default_title || prev.seo_default_title,
        seo_default_description: settingsMap.seo_default_description || prev.seo_default_description,
        seo_default_keywords: settingsMap.seo_default_keywords || prev.seo_default_keywords,
        og_image: settingsMap.og_image || prev.og_image,
        meta_fb_page_id: settingsMap.meta_fb_page_id || '',
        meta_ig_business_id: settingsMap.meta_ig_business_id || '',
        meta_page_access_token: settingsMap.meta_page_access_token || '',
      }));
    } catch (err: any) {
      setError('Error al cargar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const supabase = createAdminBrowserClient() as any;

      const settingsToUpdate = [
        { key: 'site_name', value: settings.site_name },
        { key: 'site_tagline', value: settings.site_tagline },
        { key: 'site_description', value: settings.site_description },
        { key: 'contact_email', value: settings.contact_email },
        { key: 'contact_phone', value: settings.contact_phone },
        { key: 'contact_whatsapp', value: settings.contact_whatsapp },
        { key: 'contact_address', value: settings.contact_address },
        { key: 'opening_hours', value: settings.opening_hours },
        { key: 'facebook_url', value: settings.facebook_url },
        { key: 'instagram_url', value: settings.instagram_url },
        { key: 'linkedin_url', value: settings.linkedin_url },
        { key: 'twitter_url', value: settings.twitter_url },
        { key: 'seo_default_title', value: settings.seo_default_title },
        { key: 'seo_default_description', value: settings.seo_default_description },
        { key: 'seo_default_keywords', value: settings.seo_default_keywords },
        { key: 'og_image', value: settings.og_image },
        { key: 'meta_fb_page_id', value: settings.meta_fb_page_id },
        { key: 'meta_ig_business_id', value: settings.meta_ig_business_id },
        { key: 'meta_page_access_token', value: settings.meta_page_access_token },
      ];

      for (const setting of settingsToUpdate) {
        await supabase
          .from('site_settings')
          .upsert({ key: setting.key, value: setting.value }, { onConflict: 'key' });
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err?.message || 'Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleTestMeta = async () => {
    setTesting(true);
    setTestResults(null);
    try {
      const res = await fetch('/api/admin/test-meta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta_fb_page_id: settings.meta_fb_page_id,
          meta_ig_business_id: settings.meta_ig_business_id,
          meta_page_access_token: settings.meta_page_access_token,
        }),
      });
      const data = await res.json();
      if (data.results) {
        setTestResults(data.results);
      }
    } catch {
      setTestResults(null);
    } finally {
      setTesting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-xs text-slate-500">Cargando configuración...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configuración & Integraciones</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Ajusta los datos institucionales, de contacto y las credenciales de Meta (Facebook/Instagram).
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {error && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>¡Configuración guardada correctamente!</span>
          </div>
        )}

        {/* General Clinical Info */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <HeartPulse className="w-5 h-5 text-primary-600" />
            <h2 className="text-base font-bold text-slate-900">Información del Centro Clínico</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Nombre del Sitio / Centro
              </label>
              <input
                type="text"
                name="site_name"
                value={settings.site_name}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Eslogan / Bajada
              </label>
              <input
                type="text"
                name="site_tagline"
                value={settings.site_tagline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Descripción General
              </label>
              <textarea
                rows={2}
                name="site_description"
                value={settings.site_description}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 resize-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Hours */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Phone className="w-5 h-5 text-accent-600" />
            <h2 className="text-base font-bold text-slate-900">Canales de Contacto y Atención</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Número de WhatsApp (con código de país ej: 56987654321)
              </label>
              <input
                type="text"
                name="contact_whatsapp"
                value={settings.contact_whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Teléfono de Llamadas (+56 9 ...)
              </label>
              <input
                type="text"
                name="contact_phone"
                value={settings.contact_phone}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Correo Electrónico de Contacto
              </label>
              <input
                type="email"
                name="contact_email"
                value={settings.contact_email}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Dirección en Temuco
              </label>
              <input
                type="text"
                name="contact_address"
                value={settings.contact_address}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Horario de Atención
              </label>
              <input
                type="text"
                name="opening_hours"
                value={settings.opening_hours}
                onChange={handleChange}
                placeholder="Lunes a Viernes: 08:30 a 20:00 hrs | Sábados: 09:00 a 14:00 hrs"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Social URLs */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">Perfiles en Redes Sociales</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Página de Facebook (URL)
              </label>
              <input
                type="url"
                name="facebook_url"
                value={settings.facebook_url}
                onChange={handleChange}
                placeholder="https://facebook.com/saludmentaltemuco"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Perfil de Instagram (URL)
              </label>
              <input
                type="url"
                name="instagram_url"
                value={settings.instagram_url}
                onChange={handleChange}
                placeholder="https://instagram.com/saludmentaltemuco"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                LinkedIn (URL)
              </label>
              <input
                type="url"
                name="linkedin_url"
                value={settings.linkedin_url}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/saludmentaltemuco"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                X / Twitter (URL)
              </label>
              <input
                type="url"
                name="twitter_url"
                value={settings.twitter_url}
                onChange={handleChange}
                placeholder="https://twitter.com/..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Meta Graph API Credentials & Autopublishing */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent-600" />
              <div>
                <h2 className="text-base font-bold text-slate-900">Autopublicación Meta Graph API (Facebook / Instagram)</h2>
                <p className="text-xs text-slate-500">
                  Ingresa las credenciales de la nueva Fanpage de Facebook e Instagram para autopublicar artículos del blog.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                ID de la Página de Facebook
              </label>
              <input
                type="text"
                name="meta_fb_page_id"
                value={settings.meta_fb_page_id}
                onChange={handleChange}
                placeholder="Ej: 102938475610293"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                ID de Instagram Business Account
              </label>
              <input
                type="text"
                name="meta_ig_business_id"
                value={settings.meta_ig_business_id}
                onChange={handleChange}
                placeholder="Ej: 17841401234567890"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Token de Acceso Permanente (System User / Page Access Token)
              </label>
              <input
                type="password"
                name="meta_page_access_token"
                value={settings.meta_page_access_token}
                onChange={handleChange}
                placeholder="EAAB..."
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Generado en <a href="https://developers.facebook.com/tools/explorer" target="_blank" rel="noopener noreferrer" className="text-primary-600 underline">Graph API Explorer</a> con permisos <code>pages_manage_posts</code> y <code>instagram_content_publish</code>.
              </p>
            </div>

            {/* Test Connection Button */}
            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleTestMeta}
                disabled={testing}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {testing ? 'Probando conexión...' : '⚡ Probar Conexión con Meta API'}
              </button>

              <span className="text-[11px] text-slate-400">
                Verifica en tiempo real si tus tokens son válidos antes de publicar.
              </span>
            </div>

            {/* Test Results Banner */}
            {testResults && (
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className={`p-4 rounded-2xl border text-xs ${testResults.token.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <p className="font-bold">🔑 Token de Acceso</p>
                  <p className="mt-0.5">{testResults.token.message}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-xs ${testResults.facebook.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <p className="font-bold">🔵 Fanpage Facebook</p>
                  <p className="mt-0.5">{testResults.facebook.message}</p>
                </div>
                <div className={`p-4 rounded-2xl border text-xs ${testResults.instagram.ok ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'}`}>
                  <p className="font-bold">📸 Instagram</p>
                  <p className="mt-0.5">{testResults.instagram.message}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Global SEO */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
            <Search className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">SEO y Posicionamiento Local</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Título Predeterminado para Buscadores (Title Tag)
              </label>
              <input
                type="text"
                name="seo_default_title"
                value={settings.seo_default_title}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Descripción Meta Predeterminada (Meta Description)
              </label>
              <textarea
                rows={2}
                name="seo_default_description"
                value={settings.seo_default_description}
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                Palabras Clave (Keywords)
              </label>
              <input
                type="text"
                name="seo_default_keywords"
                value={settings.seo_default_keywords}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Guardando Cambios...' : 'Guardar Toda la Configuración'}</span>
          </button>
        </div>

      </form>
    </div>
  );
}