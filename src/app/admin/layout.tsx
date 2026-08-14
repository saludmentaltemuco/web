import { LayoutDashboard, Users, FileText, Settings, LogOut, ExternalLink, HeartPulse, Plus } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createServerClient } from '@/lib/supabase/server';
import { DEFAULT_SETTINGS } from '@/types';

export const metadata = {
  title: `Panel de Administración — ${DEFAULT_SETTINGS.site_name}`,
  description: 'Panel de administración y gestión clínica',
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = (await createServerClient()) as any;
  const { data: { user } } = await supabase.auth.getUser();
  
  let role = 'admin';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role || 'admin';
  }

  const isAdmin = role === 'admin';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 text-slate-300 min-h-screen fixed left-0 top-0 flex flex-col shadow-2xl z-40 border-r border-slate-800">
        
        {/* Logo Area */}
        <div className="px-6 py-5 border-b border-slate-800/80">
          <Link href="/admin" className="flex items-center gap-3">
            <Image
              src="/logo-23.webp"
              alt="Salud Mental Temuco"
              width={160}
              height={45}
              className="h-9 w-auto object-contain brightness-0 invert"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mb-2">
            Gestión Clínica
          </p>
          <div className="space-y-1">
            <AdminNavItem href="/admin" icon={<LayoutDashboard className="w-4 h-4" />} label="Dashboard" />
            <AdminNavItem href="/admin/leads" icon={<Users className="w-4 h-4" />} label="Consultas / Pacientes" />
            <AdminNavItem href="/admin/blog" icon={<FileText className="w-4 h-4" />} label="Blog & Divulgación" />
            {isAdmin && (
              <AdminNavItem href="/admin/usuarios" icon={<Users className="w-4 h-4" />} label="Equipo / Usuarios" />
            )}
          </div>

          <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-3 mt-6 mb-2">
            Plataforma & Redes
          </p>
          <div className="space-y-1">
            {isAdmin && (
              <AdminNavItem href="/admin/configuracion" icon={<Settings className="w-4 h-4" />} label="Configuración & APIs" />
            )}
            <a
              href="/"
              target="_blank"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
            >
              <span className="text-slate-500 group-hover:text-accent-400 transition-colors">
                <ExternalLink className="w-4 h-4" />
              </span>
              <span>Ver Sitio Web</span>
            </a>
          </div>
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-slate-800/80">
          <form action="/admin/logout" method="POST">
            <button
              type="submit"
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-800">Panel de Control</span>
            <span>/</span>
            <span>Salud Mental Temuco</span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/blog"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Artículo</span>
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

function AdminNavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <a
      href={href}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-white/10 transition-all group"
    >
      <span className="text-slate-500 group-hover:text-accent-400 transition-colors">{icon}</span>
      <span>{label}</span>
    </a>
  );
}