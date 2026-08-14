import Link from 'next/link';
import { HeartPulse, Award, ShieldCheck, Users, HeartHandshake, MapPin, CheckCircle2, ArrowRight } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';
import { CTASection } from '@/components/sections';

export const metadata = {
  title: `Sobre Nosotros | ${DEFAULT_SETTINGS.site_name}`,
  description: 'Conoce nuestro centro clínico de salud mental en Temuco, nuestros valores, enfoque terapéutico y compromiso con el bienestar emocional.',
};

export default function NosotrosPage() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      
      {/* Hero Header */}
      <section className="bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-accent-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold text-accent-400 tracking-widest uppercase bg-accent-500/10 border border-accent-400/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Sobre Nuestro Centro
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            Acompañamos tu salud mental con calidez, ética y rigor clínico.
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            En Salud Mental Temuco creemos en el valor de la empatía y la ciencia para construir procesos terapéuticos transformadores y sostenibles en el tiempo.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center">
              <HeartPulse className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Nuestra Misión</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Brindar atención psicológica y psiquiátrica de excelencia a personas, familias y parejas en Temuco y todo Chile. Promovemos un espacio de acogida donde cada paciente encuentra herramientas concretas para superar el sufrimiento emocional y potenciar su bienestar integral.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-accent-100 text-accent-700 flex items-center justify-center">
              <Award className="w-6 h-6 stroke-[2]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Nuestra Visión</h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Ser un referente en salud mental en la Región de La Araucanía y a nivel nacional por la calidad humana y técnica de nuestros profesionales, la efectividad de los tratamientos y el compromiso con la desestigmatización de la salud psicológica.
            </p>
          </div>
        </div>

        {/* Pillars / Values */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Nuestros Pilares Terapéuticos</h2>
            <p className="text-sm text-slate-600 mt-2">Los principios que guían cada sesión y tratamiento en nuestra consulta.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <ShieldCheck className="w-8 h-8 text-primary-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Confidencialidad</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reserva absoluta y protección rigurosa de tu historial clínico y datos personales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <HeartHandshake className="w-8 h-8 text-emerald-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Alianza Terapéutica</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Un vínculo de colaboración genuino, donde tus objetivos y ritmo personal son la prioridad.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <Users className="w-8 h-8 text-indigo-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Enfoque Integral</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluamos dimensiones emocionales, biológicas, familiares y contextuales.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <Award className="w-8 h-8 text-accent-600 mb-3" />
              <h3 className="font-bold text-slate-900 mb-1">Evidencia Científica</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Técnicas clínicas validadas y actualización continua de nuestro cuerpo profesional.
              </p>
            </div>
          </div>
        </div>

        {/* Location & Modality */}
        <div className="bg-gradient-to-br from-primary-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <span className="text-xs font-bold text-accent-400 uppercase tracking-wider">Ubicación y Atención</span>
            <h3 className="text-2xl font-bold">Consultas Presenciales en Temuco y Sesiones Online</h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Brindamos atención presencial en la ciudad de Temuco en un entorno profesional, tranquilo y confidencial. Además, ofrecemos atención online con la misma efectividad clínica para pacientes de todo Chile.
            </p>
          </div>
          <Link
            href="/contacto"
            className="whitespace-nowrap px-8 py-3.5 rounded-full bg-accent-500 hover:bg-accent-400 text-slate-950 font-bold text-sm shadow-md transition-all hover:scale-105 shrink-0"
          >
            Solicitar una Consulta
          </Link>
        </div>

      </div>

      <CTASection />
    </div>
  );
}