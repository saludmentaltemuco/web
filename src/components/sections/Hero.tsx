'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Sparkles, ArrowRight, MessageSquareQuote, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SETTINGS, SERVICE_OPTIONS } from '@/types';

export function Hero() {
  const [selectedService, setSelectedService] = useState(SERVICE_OPTIONS[0]);
  const [selectedModality, setSelectedModality] = useState('presencial');

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-10 right-0 w-[400px] h-[400px] bg-primary-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Heading, Copy & Trust badges */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-500/10 border border-accent-400/30 text-accent-300 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-accent-400" />
              <span>Centro de Salud Mental en Temuco & Online</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              Tu bienestar emocional en un espacio{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-300 via-accent-400 to-sky-200">
                seguro, empático y profesional.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Psicoterapia individual, infantil, de pareja y psiquiatría en Temuco. Profesionales acreditados comprometidos con tu salud mental, con boleta reembolsable en Isapres y Seguros Complementarios.
            </p>

            {/* Quick Benefits Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <ShieldCheck className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <span>100% Confidencial</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <HeartHandshake className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Atención Híbrida</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-300 bg-white/5 border border-white/10 rounded-xl px-3 py-2">
                <CheckCircle2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
                <span>Reembolso Isapre</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
              <Link
                href="/contacto"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-accent-500/25 transition-all duration-200 hover:scale-102"
              >
                <span>Agendar Cita / Consulta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp}?text=Hola,%20quisiera%20consultar%20por%20horas%20disponibles%20en%20Salud%20Mental%20Temuco`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all"
              >
                <MessageSquareQuote className="w-4 h-4" />
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right Column: Interactive Quick Consultation Card */}
          <div className="lg:col-span-5">
            <div className="bg-white text-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
              <div className="mb-6">
                <span className="text-xs font-bold text-accent-600 tracking-wider uppercase block mb-1">
                  Orientación Rápida
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  ¿Cómo podemos ayudarte hoy?
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Selecciona tu área de interés para dirigir tu consulta con el especialista indicado.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Especialidad requerida
                  </label>
                  <select
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                    aria-label="Selecciona la especialidad requerida"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all"
                  >
                    {SERVICE_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Modalidad preferida
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedModality('presencial')}
                      className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                        selectedModality === 'presencial'
                          ? 'bg-primary-50 border-primary-600 text-primary-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      🏢 Presencial en Temuco
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedModality('online')}
                      className={`px-4 py-3 rounded-xl border text-xs font-semibold transition-all ${
                        selectedModality === 'online'
                          ? 'bg-primary-50 border-primary-600 text-primary-800 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      💻 Online (Todo Chile)
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/contacto?service=${encodeURIComponent(selectedService)}&modality=${selectedModality}`}
                    className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3.5 px-4 rounded-xl shadow-md transition-all text-sm"
                  >
                    <span>Continuar y Solicitar Hora</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <p className="text-[11px] text-center text-slate-500 pt-1">
                  🔒 Tus datos están protegidos por estricta confidencialidad médica y profesional.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}