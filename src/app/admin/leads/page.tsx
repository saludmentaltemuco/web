'use client';

import { useState, useEffect } from 'react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { 
  Users, 
  Search, 
  MessageSquareQuote, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  X, 
  Save, 
  Filter, 
  ExternalLink,
  Clock
} from 'lucide-react';
import { LEAD_STATUS_LABELS, LEAD_STATUS_COLORS, LEAD_SOURCE_LABELS, LeadStatus, LeadSource, SERVICE_OPTIONS } from '@/types';

interface LeadItem {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service_type?: string | null;
  modality?: string | null;
  message?: string | null;
  notes?: string | null;
  source: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [serviceFilter, setServiceFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [selectedLead, setSelectedLead] = useState<LeadItem | null>(null);
  const [editNotes, setEditNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [statusFilter, serviceFilter]);

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      let query = supabase.from('leads').select('*').order('created_at', { ascending: false });

      if (statusFilter) {
        query = query.eq('status', statusFilter);
      }
      if (serviceFilter) {
        query = query.eq('service_type', serviceFilter);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setError(fetchError.message);
        return;
      }

      setLeads(data || []);
    } catch (err: any) {
      setError(err?.message || 'Error al cargar las consultas');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (leadId: string, newStatus: LeadStatus) => {
    setUpdatingStatus(leadId);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', leadId);

      if (updateError) {
        alert('Error al actualizar estado: ' + updateError.message);
        return;
      }

      setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
      if (selectedLead?.id === leadId) {
        setSelectedLead({ ...selectedLead, status: newStatus });
      }
    } catch (err) {
      alert('Error al actualizar');
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedLead) return;
    setSavingNotes(true);
    try {
      const supabase = createAdminBrowserClient() as any;
      const { error: updateError } = await supabase
        .from('leads')
        .update({ 
          notes: editNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedLead.id);

      if (updateError) throw updateError;

      setSelectedLead({ ...selectedLead, notes: editNotes });
      setLeads(leads.map(l => l.id === selectedLead.id ? { ...l, notes: editNotes } : l));
      alert('Notas guardadas correctamente');
    } catch (err: any) {
      alert('Error al guardar notas: ' + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const openDetail = (lead: LeadItem) => {
    setSelectedLead(lead);
    setEditNotes(lead.notes || '');
  };

  const filteredLeads = leads.filter((lead) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      lead.name.toLowerCase().includes(q) ||
      lead.email.toLowerCase().includes(q) ||
      (lead.phone && lead.phone.includes(q)) ||
      (lead.service_type && lead.service_type.toLowerCase().includes(q))
    );
  });

  const generateWhatsAppLink = (lead: LeadItem) => {
    if (!lead.phone) return '#';
    const cleanPhone = lead.phone.replace(/[^0-9]/g, '');
    const serviceName = lead.service_type || 'atención psicológica';
    const text = encodeURIComponent(
      `Hola ${lead.name}, te escribimos desde el Centro de Salud Mental Temuco respecto a tu solicitud de ${serviceName}. ¿Cómo te podemos ayudar a coordinar tu cita?`
    );
    return `https://wa.me/${cleanPhone.startsWith('56') ? cleanPhone : '56' + cleanPhone}?text=${text}`;
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Consultas de Pacientes (Leads)</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Administra las solicitudes de atención, agendamientos y respuestas a pacientes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-primary-50 text-primary-700 border border-primary-100">
            Total: {leads.length} solicitudes
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por nombre, correo, teléfono o especialidad..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todos los estados</option>
              <option value="new">Nuevos</option>
              <option value="contacted">Contactados</option>
              <option value="scheduled">Agendados</option>
              <option value="attended">Atendidos</option>
              <option value="cancelled">Cancelados</option>
            </select>
          </div>

          <div className="text-xs text-slate-600">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">Todas las especialidades</option>
              {SERVICE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-slate-500">Cargando consultas...</div>
        ) : error ? (
          <div className="p-12 text-center text-xs text-rose-500">{error}</div>
        ) : filteredLeads.length === 0 ? (
          <div className="p-12 text-center space-y-2">
            <Users className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No se encontraron consultas</p>
            <p className="text-xs text-slate-400">Intenta cambiar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-6 py-3.5">Paciente</th>
                  <th className="px-6 py-3.5">Especialidad & Modalidad</th>
                  <th className="px-6 py-3.5">Contacto</th>
                  <th className="px-6 py-3.5">Estado</th>
                  <th className="px-6 py-3.5">Fecha</th>
                  <th className="px-6 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-slate-50/60 transition-colors">
                    
                    {/* Paciente */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-primary-100 text-primary-800 font-bold flex items-center justify-center text-xs flex-shrink-0">
                          {lead.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-tight">{lead.name}</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">Vía {LEAD_SOURCE_LABELS[lead.source] || lead.source}</p>
                        </div>
                      </div>
                    </td>

                    {/* Especialidad & Modalidad */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{lead.service_type || 'Psicología General'}</p>
                      <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {lead.modality === 'online' ? '💻 Online' : '🏢 Presencial'}
                      </span>
                    </td>

                    {/* Contacto */}
                    <td className="px-6 py-4 space-y-1">
                      <p className="text-xs text-slate-700 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        {lead.email}
                      </p>
                      {lead.phone && (
                        <p className="text-xs text-slate-700 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {lead.phone}
                        </p>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => handleStatusChange(lead.id, e.target.value as LeadStatus)}
                        disabled={updatingStatus === lead.id}
                        className={`text-xs px-2.5 py-1 rounded-full font-bold border ${LEAD_STATUS_COLORS[lead.status] || 'bg-slate-100 text-slate-700'}`}
                      >
                        <option value="new">Nuevo</option>
                        <option value="contacted">Contactado</option>
                        <option value="scheduled">Agendado</option>
                        <option value="attended">Atendido</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                    </td>

                    {/* Fecha */}
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(lead.created_at).toLocaleDateString('es-CL', {
                        day: '2-digit',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>

                    {/* Acciones */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {lead.phone && (
                          <a
                            href={generateWhatsAppLink(lead)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors"
                            title="Responder por WhatsApp"
                          >
                            <MessageSquareQuote className="w-4 h-4" />
                          </a>
                        )}
                        <button
                          onClick={() => openDetail(lead)}
                          className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-primary-50 text-slate-700 hover:text-primary-700 font-semibold text-xs transition-colors"
                        >
                          Ver Ficha
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

      {/* Detail Modal */}
      {selectedLead && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-600">
                  Ficha de Solicitud #{selectedLead.id.slice(0, 8)}
                </span>
                <h2 className="text-xl font-bold text-slate-900">{selectedLead.name}</h2>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">Especialidad</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5">{selectedLead.service_type || 'Psicología'}</p>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase block">Modalidad</span>
                  <p className="font-bold text-slate-800 text-sm mt-0.5 capitalize">
                    {selectedLead.modality === 'online' ? '💻 Online' : '🏢 Presencial en Temuco'}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Datos de Contacto</span>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
                  <p className="flex items-center gap-2 text-slate-700 font-medium">
                    <Mail className="w-4 h-4 text-slate-400" />
                    <a href={`mailto:${selectedLead.email}`} className="text-primary-600 hover:underline">{selectedLead.email}</a>
                  </p>
                  {selectedLead.phone && (
                    <p className="flex items-center gap-2 text-slate-700 font-medium">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <a href={`tel:${selectedLead.phone}`} className="text-slate-800">{selectedLead.phone}</a>
                    </p>
                  )}
                </div>
              </div>

              {selectedLead.message && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Mensaje / Motivo de Consulta</span>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                    {selectedLead.message}
                  </div>
                </div>
              )}

              {/* Internal Clinical & Coordination Notes */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Notas Internas de Seguimiento</span>
                <textarea
                  rows={3}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Añade notas internas: ej. Paciente contactada, agendada para el jueves 16:00 hrs con psicóloga Andrea..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all resize-none"
                />
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{savingNotes ? 'Guardando...' : 'Guardar Notas'}</span>
                </button>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex flex-wrap items-center justify-between gap-3">
              {selectedLead.phone ? (
                <a
                  href={generateWhatsAppLink(selectedLead)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Contactar por WhatsApp</span>
                </a>
              ) : <div />}

              <button
                onClick={() => setSelectedLead(null)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
              >
                Cerrar
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}