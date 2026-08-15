'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Phone, Mail, Clock, MessageSquareQuote } from 'lucide-react';
import { DEFAULT_SETTINGS, SERVICE_OPTIONS, ModalityType } from '@/types';

export function LeadFormSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service_type: SERVICE_OPTIONS[0],
    modality: 'presencial' as ModalityType,
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // El API route maneja tanto el guardado en BD como el envío de correos
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          service_type: formData.service_type,
          modality: formData.modality,
          message: formData.message,
          source: 'website',
        }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || 'Error al enviar la solicitud');
      }

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
      setError(err?.message || 'Ocurrió un error al enviar tu consulta. Por favor inténtalo nuevamente o contáctanos por WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacto" className="py-20 lg:py-28 bg-slate-900 text-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Information */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-accent-400 tracking-widest uppercase bg-accent-500/10 border border-accent-400/20 px-3.5 py-1.5 rounded-full inline-block">
              Solicitud de Atención
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Inicia tu proceso terapéutico hoy
            </h2>
            
            <p className="text-slate-300 text-base leading-relaxed">
              Completa el formulario y nuestra coordinadora clínica te contactará a la brevedad para coordinar disponibilidad horaria, valores y resolver cualquier duda.
            </p>

            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-800/60 flex items-center justify-center text-accent-400 flex-shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Teléfono de Contacto</h4>
                  <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="text-white hover:text-accent-300 font-medium text-sm">
                    {DEFAULT_SETTINGS.contact_phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-800/60 flex items-center justify-center text-accent-400 flex-shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Correo Electrónico</h4>
                  <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="text-white hover:text-accent-300 font-medium text-sm">
                    {DEFAULT_SETTINGS.contact_email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary-800/60 flex items-center justify-center text-accent-400 flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Horario de Atención</h4>
                  <p className="text-slate-300 text-xs mt-0.5">{DEFAULT_SETTINGS.opening_hours}</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp}?text=Hola,%20quisiera%20solicitar%20una%20hora%20en%20Salud%20Mental%20Temuco`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 font-semibold text-sm transition-colors"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>¿Prefieres escribirnos directo por WhatsApp? Haz clic aquí</span>
              </a>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
              
              {success ? (
                <div className="text-center py-10 space-y-4 animate-fade-in">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle2 className="w-10 h-10 stroke-[2]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900">¡Consulta Recibida con Éxito!</h3>
                  <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                    Hemos recibido tu solicitud de forma confidencial. Nuestro equipo se comunicará contigo vía WhatsApp o correo electrónico para confirmar tu horario.
                  </p>
                  <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 px-6 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="border-b border-slate-100 pb-4 mb-2">
                    <h3 className="text-xl font-bold text-slate-900">Formulario de Solicitud de Cita</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Completa los campos y te responderemos en un plazo máximo de 2 horas hábiles.</p>
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
                        placeholder="Ej. Camila Morales"
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
                      placeholder="nombre@ejemplo.com"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Especialidad / Motivo
                      </label>
                      <select
                        value={formData.service_type}
                        onChange={(e) => setFormData({ ...formData, service_type: e.target.value })}
                        aria-label="Selecciona la especialidad o motivo"
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
                        Modalidad
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
                      Mensaje o disponibilidad horaria (Opcional)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Indícanos si tienes preferencia de horarios (mañana/tarde) o algún detalle que desees mencionar..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span>Enviando solicitud...</span>
                    ) : (
                      <>
                        <span>Solicitar Hora de Atención</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-center text-slate-500">
                    Al enviar este formulario aceptas ser contactado por nuestro equipo clínico para coordinar tu atención.
                  </p>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
