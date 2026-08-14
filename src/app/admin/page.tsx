import { createServerClient } from '@/lib/supabase/server';
import Link from 'next/link';
import type { Database } from '@/types';
import { Users, CheckCircle2, UserPlus, FileText, PlusCircle, Settings, ListTodo, ArrowRight, TrendingUp, Calendar, HeartPulse } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

export const metadata = {
  title: `Dashboard — ${DEFAULT_SETTINGS.site_name}`,
  description: 'Resumen del panel de gestión clínica y contenidos',
};

async function getAdminData() {
  const supabase = (await createServerClient<Database>()) as any;

  const { data: recentLeads } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(6);

  const { count: totalLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true });

  const { count: newLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  const { count: scheduledLeads } = await supabase
    .from('leads')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'scheduled');

  const { count: totalPosts } = await supabase
    .from('blog_posts')
    .select('*', { count: 'exact', head: true });

  return {
    totalLeads: totalLeads || 0,
    newLeads: newLeads || 0,
    scheduledLeads: scheduledLeads || 0,
    recentLeads: recentLeads || [],
    totalPosts: totalPosts || 0,
  };
}

export default async function AdminDashboard() {
  const data = await getAdminData();

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Clínico & Contenidos</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Bienvenido al panel de administración de Salud Mental Temuco.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/leads"
            className="px-4 py-2 bg-accent-500 hover:bg-accent-600 text-slate-950 font-bold text-xs rounded-xl shadow-sm transition-all"
          >
            Ver Consultas Nuevas ({data.newLeads})
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <StatCard
          title="Consultas Nuevas"
          value={data.newLeads}
          icon={<UserPlus className="w-5 h-5" />}
          href="/admin/leads?status=new"
          color="amber"
          trend="Pendientes de contactar"
        />
        <StatCard
          title="Horas Agendadas"
          value={data.scheduledLeads}
          icon={<Calendar className="w-5 h-5" />}
          href="/admin/leads?status=scheduled"
          color="blue"
          trend="Citas coordinadas"
        />
        <StatCard
          title="Total Consultas"
          value={data.totalLeads}
          icon={<Users className="w-5 h-5" />}
          href="/admin/leads"
          color="green"
          trend="Histórico de solicitudes"
        />
        <StatCard
          title="Artículos de Blog"
          value={data.totalPosts}
          icon={<FileText className="w-5 h-5" />}
          href="/admin/blog"
          color="purple"
          trend="Publicaciones & Social"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Quick Actions */}
        <div className="xl:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-primary-600" />
              <h2 className="text-sm font-bold text-slate-900">Acciones Frecuentes</h2>
            </div>
            <div className="p-4 space-y-2">
              <QuickAction
                href="/admin/blog"
                icon={<FileText className="w-4 h-4" />}
                label="Publicar en Blog & Redes"
                description="Crear artículo y autopublicar en Facebook"
                color="purple"
              />
              <QuickAction
                href="/admin/leads"
                icon={<ListTodo className="w-4 h-4" />}
                label="Gestionar Pacientes / Consultas"
                description="Ver detalles, modalidad y WhatsApp"
                color="amber"
              />
              <QuickAction
                href="/admin/configuracion"
                icon={<Settings className="w-4 h-4" />}
                label="Configuración & Meta APIs"
                description="Ajustar tokens de Facebook e Instagram"
                color="gray"
              />
            </div>
          </div>
        </div>

        {/* Recent Inquiries / Leads */}
        <div className="xl:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-slate-900">Últimas Consultas de Pacientes</h2>
              <Link
                href="/admin/leads"
                className="text-xs flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                Ver todas <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-100">
              {data.recentLeads.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                    <Users className="w-6 h-6 text-slate-400" />
                  </div>
                  <p className="text-slate-600 font-medium text-sm">Sin consultas registradas</p>
                  <p className="text-slate-400 text-xs mt-1">Las nuevas solicitudes desde la web aparecerán aquí</p>
                </div>
              ) : (
                data.recentLeads.map((lead: any) => (
                  <div key={lead.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-primary-100 rounded-xl flex items-center justify-center text-primary-800 font-bold text-xs">
                        {lead.name?.charAt(0)?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 text-xs sm:text-sm">{lead.name}</p>
                        <p className="text-[11px] text-slate-500">
                          {lead.service_type || 'Consulta General'} · <span className="capitalize">{lead.modality || 'Presencial'}</span>
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                        lead.status === 'new' ? 'bg-amber-100 text-amber-800' :
                        lead.status === 'contacted' ? 'bg-blue-100 text-blue-800' :
                        lead.status === 'scheduled' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {lead.status === 'new' ? 'Nuevo' : 
                         lead.status === 'contacted' ? 'Contactado' : 
                         lead.status === 'scheduled' ? 'Agendado' : lead.status}
                      </span>
                      <span className="text-[11px] text-slate-400 hidden sm:inline">
                        {new Date(lead.created_at).toLocaleDateString('es-CL', { day: '2-digit', month: 'short' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

const colorMap = {
  blue:   { bg: 'bg-blue-600',   light: 'bg-blue-50',   text: 'text-blue-600',   ring: 'ring-blue-100' },
  green:  { bg: 'bg-emerald-600', light: 'bg-emerald-50', text: 'text-emerald-600', ring: 'ring-emerald-100' },
  amber:  { bg: 'bg-amber-500',  light: 'bg-amber-50',  text: 'text-amber-600',  ring: 'ring-amber-100' },
  purple: { bg: 'bg-purple-600', light: 'bg-purple-50', text: 'text-purple-600', ring: 'ring-purple-100' },
  gray:   { bg: 'bg-slate-600',  light: 'bg-slate-100', text: 'text-slate-600', ring: 'ring-slate-200' },
};

function StatCard({ title, value, icon, href, color, trend }: {
  title: string;
  value: number;
  icon: React.ReactNode;
  href: string;
  color: keyof typeof colorMap;
  trend: string;
}) {
  const c = colorMap[color];
  return (
    <a href={href} className="group block bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 ${c.light} rounded-xl flex items-center justify-center ${c.text} ring-1 ${c.ring} transition-transform group-hover:scale-110`}>
          {icon}
        </div>
        <TrendingUp className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
      <p className="text-3xl font-extrabold text-slate-900 mb-1">{value}</p>
      <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">{title}</p>
      <p className="text-[11px] text-slate-400 mt-1">{trend}</p>
    </a>
  );
}

function QuickAction({ href, icon, label, description, color }: {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  color: keyof typeof colorMap;
}) {
  const c = colorMap[color];
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
    >
      <div className={`w-9 h-9 ${c.light} rounded-xl flex items-center justify-center ${c.text} flex-shrink-0`}>
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs font-bold text-slate-800 group-hover:text-slate-900">{label}</p>
        <p className="text-[11px] text-slate-400 truncate">{description}</p>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 ml-auto flex-shrink-0 group-hover:text-slate-500 transition-colors" />
    </Link>
  );
}
