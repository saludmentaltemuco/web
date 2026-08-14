export type LeadSource = 'website' | 'whatsapp' | 'referral' | 'social';
export type LeadStatus = 'new' | 'contacted' | 'scheduled' | 'attended' | 'cancelled';
export type ServiceType = 
  | 'Psicoterapia Adultos'
  | 'Psicoterapia Infanto-Juvenil'
  | 'Terapia de Pareja'
  | 'Terapia Familiar'
  | 'Evaluación Psicológica'
  | 'Psiquiatría / Orientación'
  | 'Otra consulta';

export type ModalityType = 'presencial' | 'online' | 'ambas' | 'no_definido';

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  service_type?: string | null;
  modality?: ModalityType | null;
  message?: string | null;
  notes?: string | null;
  source?: LeadSource;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export type LeadInsert = Omit<Lead, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  status?: LeadStatus;
};

export type LeadUpdate = Partial<LeadInsert>;

export interface LeadFormData {
  name: string;
  email: string;
  phone?: string;
  service_type?: string;
  modality?: ModalityType;
  message?: string;
  source?: LeadSource;
}

export const LEAD_SOURCE_LABELS: Record<LeadSource, string> = {
  website: 'Sitio Web',
  whatsapp: 'WhatsApp Directo',
  referral: 'Recomendación',
  social: 'Redes Sociales',
};

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Nuevo / Pendiente',
  contacted: 'Contactado',
  scheduled: 'Hora Agendada',
  attended: 'Atendido / En Proceso',
  cancelled: 'Cancelado / No Asistió',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'bg-blue-100 text-blue-800 border-blue-200',
  contacted: 'bg-amber-100 text-amber-800 border-amber-200',
  scheduled: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  attended: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
};

export const SERVICE_OPTIONS: ServiceType[] = [
  'Psicoterapia Adultos',
  'Psicoterapia Infanto-Juvenil',
  'Terapia de Pareja',
  'Terapia Familiar',
  'Evaluación Psicológica',
  'Psiquiatría / Orientación',
  'Otra consulta',
];