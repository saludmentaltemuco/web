'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  MessageSquareQuote,
  HelpCircle,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_SETTINGS, SERVICE_OPTIONS, ModalityType } from '@/types';

const FAQS = [
  {
    q: '¿Cuáles son los medios de pago disponibles?',
    a: 'Aceptamos pagos por transferencia bancaria, link de pago directo, Webpay (tarjetas de débito y crédito) y Mercado Pago. Una vez realizado el pago, se emite la boleta de honorarios para tu reembolso.',
  },
  {
    q: '¿Cómo funciona el reembolso en Isapre o Seguros Complementarios?',
    a: 'Al finalizar tu sesión se emite una boleta de honorarios electrónica con el código de prestación correspondiente. Con este documento puedes solicitar el reembolso directamente en tu Isapre o seguro de salud según la cobertura de tu plan.',
  },
  {
    q: '¿Cuánto dura cada sesión y cuál es la frecuencia habitual?',
    a: 'Las sesiones individuales tienen una duración aproximada de 45 a 50 minutos. La frecuencia se evalúa y acuerda con el terapeuta en la primera sesión, siendo habitualmente semanal o quincenal.',
  },
  {
    q: '¿Qué necesito para una sesión online?',
    a: 'Solo necesitas un computador, tablet o celular con cámara y micrófono estables, buena conexión a internet y, muy importante, un lugar privado donde te sientas cómodo/a para hablar con total tranquilidad.',
  },
  {
    q: '¿Dónde atienden para sesiones presenciales y online?',
    a: 'Brindamos atención presencial en la ciudad de Temuco y atención online por videollamada para pacientes de todo Chile.',
  },
  {
    q: '¿Se atienden urgencias psiquiátricas inmediatas?',
    a: 'En Salud Mental Temuco realizamos consultas ambulatorias programadas. Si estás experimentando una crisis aguda de riesgo vital, te recomendamos acudir de inmediato al servicio de urgencia hospitalario más cercano o comunicarte con la línea de ayuda *4141 del Ministerio de Salud.',
  },
];

function ContactoContent() {
  const searchParams = useSearchParams();
  const initialService = searchParams.get('service') || SERVICE_OPTIONS[0];
  const initialModality = (searchParams.get('modality') as ModalityType) || 'presencial';

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: initialService,
    modality: initialModality,
    message: '',
  });

  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const s = searchParams.get('service');
    const m = searchParams.get('modality') as ModalityType;
    if (s) setFormData((prev) => ({ ...prev, service_type: s }));
    if (m) setFormData((prev) => ({ ...prev, modality: m }));
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: insertError } = await supabase.from('leads').insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        service_type: formData.service_type,
        modality: formData.modality,
        message: formData.message || null,
        source: 'website',
        status: 'new',
      });

      if (insertError) throw insertError;

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        service_type: SERVICE_OPTIONS[0],
        modality: 'presencial',
        message: '',
      });
    } catch (err: any) {
      setError(err?.message || 'Hubo un error al procesar tu solicitud. Por favor intenta nuevamente o escríbenos directamente a WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold text-accent-400 tracking-widest uppercase bg-accent-500/10 border border-accent-400/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Reserva & Contacto
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            Estamos para Acompañarte
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Solicita tu hora de atención presencial en Temuco o sesión online para todo Chile. Responderemos a la brevedad.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Contact Details & Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-6">
              <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-3">
                Información de Atención
              </h2>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Ubicación y Cobertura</h3>
                    <p className="text-sm text-slate-700 font-medium mt-0.5">Temuco, Región de La Araucanía</p>
                    <span className="text-[11px] text-slate-500 font-normal">Atención presencial en Temuco y online para todo Chile</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Teléfono / WhatsApp</h3>
                    <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="text-sm text-slate-700 hover:text-primary-600 font-medium block">
                      {DEFAULT_SETTINGS.contact_phone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Correo Electrónico</h3>
                    <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="text-sm text-slate-700 hover:text-primary-600 font-medium block">
                      {DEFAULT_SETTINGS.contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Horario de Consultas</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{DEFAULT_SETTINGS.opening_hours}</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <a
                  href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp}?text=Hola,%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20atenci%C3%B3n%20en%20Salud%20Mental%20Temuco`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-md transition-colors"
                >
                  <MessageSquareQuote className="w-4 h-4" />
                  <span>Escribir por WhatsApp Directo</span>
                </a>
              </div>
            </div>

            {/* Quick Guarantees Box */}
            <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-6 text-white space-y-3">
              <div className="flex items-center gap-2 text-accent-300 font-bold text-sm">
                <ShieldCheck className="w-5 h-5" />
                <span>Atención Segura y Acreditada</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Todas las sesiones son confidenciales y se emite boleta para reembolso en Isapres y Seguros de Salud.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100">
              
              {success ? (
                <div className="text-center py-12 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">¡Solicitud Enviada con Éxito!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Hemos recibido tu solicitud de forma confidencial. Nuestro equipo se pondrá en contacto contigo a la brevedad para confirmar la fecha y hora de tu consulta.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900">Solicitud de Cita / Consulta</h2>
                    <p className="text-xs text-slate-500 mt-1">Completa los datos y te responderemos en un plazo máximo de 2 horas hábiles.</p>
                  </div>

                  {error && (
                    <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Nombre Completo *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ej. Juan Pérez"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+56 9 1234 5678"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Especialidad
                      </label>
                      <select
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        aria-label="Selecciona la especialidad de atención"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                      >
                        {SERVICE_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Modalidad de Atención
                      </label>
                      <select
                        value={formData.modality}
                        onChange={(e) => setFormData({ ...formData, modality: e.target.value as ModalityType })}
                        aria-label="Selecciona la modalidad de atención"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                      >
                        <option value="presencial">Presencial en Temuco</option>
                        <option value="online">Online (Todo Chile)</option>
                        <option value="ambas">Indiferente / Ambas</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                      Motivo de consulta o preferencia de horarios
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntanos brevemente qué te motiva a consultar o en qué días/horarios tienes mayor disponibilidad..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Procesando solicitud...</span>
                    ) : (
                      <>
                        <span>Solicitar Hora de Atención</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    🔒 Tus datos están resguardados bajo estricto secreto y confidencialidad clínica.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>

        {/* FAQs Accordion */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <span className="text-xs font-bold text-primary-600 tracking-widest uppercase bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Preguntas Frecuentes
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Respuestas a tus dudas habituales
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-bold text-slate-800 hover:text-primary-600 transition-colors"
                  >
                    <span className="flex items-center gap-3">
                      <HelpCircle className="w-5 h-5 text-primary-600 flex-shrink-0" />
                      {faq.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180 text-primary-600' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </div>
  );
}

export default function ContactoPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-slate-500">Cargando página de contacto...</div>}>
      <ContactoContent />
    </Suspense>
  );
}