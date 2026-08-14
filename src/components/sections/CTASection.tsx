import Link from 'next/link';
import { Phone, ArrowRight, MessageSquareQuote, HeartHandshake, ShieldCheck } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

export function CTASection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 text-white relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-accent-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-accent-300 text-xs font-semibold uppercase tracking-wider mb-6">
          <HeartHandshake className="w-3.5 h-3.5 text-accent-400" />
          <span>Atención Profesional & Confidencial</span>
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-tight">
          Da el primer paso hacia una vida con mayor tranquilidad y bienestar.
        </h2>

        <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Estamos aquí para escucharte, orientarte y acompañarte en tu proceso con la calidez y el rigor clínico que mereces.
        </p>

        {/* Benefits bar */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-300 pt-6">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Atención en Temuco y Teleconsulta nacional
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Boletas para reembolso en Isapre y Seguros
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Reserva rápida y confidencial
          </span>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/contacto"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-accent-500 to-accent-600 hover:from-accent-400 hover:to-accent-500 text-slate-950 font-bold px-8 py-3.5 rounded-full shadow-lg hover:shadow-accent-500/25 transition-all text-sm hover:scale-105"
          >
            <span>Solicitar Hora de Consulta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <a
            href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp}?text=Hola,%20quisiera%20consultar%20por%20atenci%C3%B3n%20en%20Salud%20Mental%20Temuco`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-semibold text-sm transition-all"
          >
            <MessageSquareQuote className="w-4 h-4" />
            <span>Hablar por WhatsApp</span>
          </a>

          <a
            href={`tel:${DEFAULT_SETTINGS.contact_phone}`}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/15 font-semibold text-sm transition-all"
          >
            <Phone className="w-4 h-4 text-accent-400" />
            <span>Llamar al {DEFAULT_SETTINGS.contact_phone}</span>
          </a>
        </div>

      </div>
    </section>
  );
}