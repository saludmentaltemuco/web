'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { X, MessageCircle, User, Phone, Mail, HeartPulse, Loader2, CheckCircle2 } from 'lucide-react';
import { createAdminBrowserClient } from '@/lib/supabase/admin-client';
import { DEFAULT_SETTINGS, SERVICE_OPTIONS } from '@/types';

export function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState(DEFAULT_SETTINGS.contact_whatsapp.replace(/[^0-9]/g, ''));
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: SERVICE_OPTIONS[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const supabase = createAdminBrowserClient() as any;
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['contact_whatsapp']);

        if (data) {
          const phone = data.find((s: any) => s.key === 'contact_whatsapp');
          if (phone && phone.value) setWhatsappNumber(phone.value.replace(/[^0-9]/g, ''));
        }
      } catch (err) {
        console.error('Error fetching dynamic WhatsApp settings:', err);
      }
    };

    fetchSettings();

    const handleOpenModal = () => setIsOpen(true);
    window.addEventListener('open-whatsapp-modal', handleOpenModal);

    return () => {
      window.removeEventListener('open-whatsapp-modal', handleOpenModal);
    };
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!formData.service) newErrors.service = 'Selecciona una especialidad';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Guardar lead en Supabase
      const supabase = createAdminBrowserClient() as any;
      await supabase.from('leads').insert([{
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        service_type: formData.service,
        message: `Consulta vía WhatsApp Widget: ${formData.service}`,
        source: 'whatsapp',
        status: 'new',
      }]);

      setStep('success');

      // Redirigir a WhatsApp después de 1 segundo
      setTimeout(() => {
        const message = encodeURIComponent(
          `Hola Salud Mental Temuco, soy *${formData.name}* y quisiera consultar por atención en: *${formData.service}*. Mi correo es ${formData.email}`
        );
        window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
        handleClose();
      }, 1200);
    } catch (err) {
      console.error('Error al guardar lead:', err);
      const message = encodeURIComponent(
        `Hola Salud Mental Temuco, soy *${formData.name}* y quisiera consultar por atención en: *${formData.service}*.`
      );
      window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
      handleClose();
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setStep('form');
      setFormData({ name: '', phone: '', email: '', service: SERVICE_OPTIONS[0] });
      setErrors({});
    }, 300);
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2"
        aria-label="Contactar por WhatsApp"
      >
        <div className="relative flex items-center">
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-30 pointer-events-none" />
          
          <div className="relative flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-2xl transition-all duration-300 group-hover:scale-105">
            <MessageCircle className="w-6 h-6 fill-white" />
            <span className="hidden sm:inline font-bold text-xs">WhatsApp Clínico</span>
          </div>
        </div>
      </button>

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
          onClick={(e) => e.target === e.currentTarget && handleClose()}
        >
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" onClick={handleClose} />

          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white flex-shrink-0 shadow-inner">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-white font-bold text-base leading-tight">Salud Mental Temuco</p>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 bg-emerald-300 rounded-full animate-pulse" />
                    <p className="text-emerald-100 text-xs">Atención y Coordinación en línea</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="ml-auto text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {step === 'success' ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">¡Abriendo WhatsApp!</h3>
                  <p className="text-slate-500 text-xs">Te estamos redirigiendo a la conversación con nuestra coordinadora...</p>
                </div>
              ) : (
                <>
                  <p className="text-slate-600 text-xs mb-5">
                    Indícanos tus datos básicos para responderte con información de horas disponibles y valores en Temuco y Online.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Nombre completo *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Ej: Carolina Morales"
                          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                            errors.name
                              ? 'border-rose-300 focus:ring-rose-200'
                              : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      {errors.name && <p className="text-rose-500 text-[11px] mt-1">{errors.name}</p>}
                    </div>

                    {/* Teléfono */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+56 9 8765 4321"
                          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                            errors.phone
                              ? 'border-rose-300 focus:ring-rose-200'
                              : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      {errors.phone && <p className="text-rose-500 text-[11px] mt-1">{errors.phone}</p>}
                    </div>

                    {/* Correo Electrónico */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Correo electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="nombre@ejemplo.com"
                          className={`w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 transition-colors ${
                            errors.email
                              ? 'border-rose-300 focus:ring-rose-200'
                              : 'border-slate-200 focus:ring-emerald-200 focus:border-emerald-500'
                          }`}
                        />
                      </div>
                      {errors.email && <p className="text-rose-500 text-[11px] mt-1">{errors.email}</p>}
                    </div>

                    {/* Especialidad */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Especialidad de interés *
                      </label>
                      <select
                        value={formData.service}
                        onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                        className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500"
                      >
                        {SERVICE_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-xs rounded-xl transition-all shadow-md"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <MessageCircle className="w-4 h-4 fill-white" />
                      )}
                      <span>{isLoading ? 'Conectando...' : 'Iniciar Conversación en WhatsApp'}</span>
                    </button>

                    <p className="text-center text-[10px] text-slate-400">
                      🔒 Confidencialidad absoluta según la ley de deberes y derechos del paciente.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
