import Link from 'next/link';
import { 
  UserCheck, 
  SmilePlus, 
  Users, 
  BrainCircuit, 
  Sparkles, 
  Laptop, 
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

const specialties = [
  {
    id: 'adultos',
    icon: UserCheck,
    title: 'Psicoterapia Individual Adultos',
    description: 'Acompañamiento especializado para el manejo de la ansiedad, crisis de pánico, depresión, duelos, estrés laboral y crecimiento personal.',
    highlights: ['Enfoque cognitivo-conductual y humanista', 'Herramientas de autorregulación', 'Espacio libre de juicios'],
    color: 'from-blue-600 to-indigo-700',
    tag: 'Más solicitada',
  },
  {
    id: 'infantil',
    icon: SmilePlus,
    title: 'Psicología Infanto-Juvenil',
    description: 'Atención adaptada a niños y adolescentes. Manejo conductual, dificultades escolares, regulación emocional y orientación a padres.',
    highlights: ['Terapia basada en el juego', 'Orientación a cuidadores y colegios', 'Desarrollo de habilidades sociales'],
    color: 'from-sky-500 to-blue-600',
    tag: 'Especializada',
  },
  {
    id: 'pareja',
    icon: Users,
    title: 'Terapia de Pareja y Familiar',
    description: 'Resolución de conflictos, mejora de la comunicación, reconstrucción de la confianza y fortalecimiento de los vínculos afectivos.',
    highlights: ['Comunicación asertiva y empática', 'Manejo de crisis y acuerdos', 'Terapia relacional sistémica'],
    color: 'from-indigo-600 to-primary-800',
    tag: 'Vínculos sanos',
  },
  {
    id: 'psiquiatria',
    icon: BrainCircuit,
    title: 'Evaluación y Psiquiatría',
    description: 'Diagnóstico integral, evaluaciones neuropsicológicas y tratamiento médico-psiquiátrico coordinado con el equipo terapéutico.',
    highlights: ['Tratamiento farmacológico guiado', 'Seguimiento riguroso', 'Enfoque biopsicosocial'],
    color: 'from-slate-700 to-primary-950',
    tag: 'Médico',
  },
  {
    id: 'ansiedad-estres',
    icon: Sparkles,
    title: 'Manejo de Ansiedad y Fobias',
    description: 'Programas de intervención breve y focalizada para superar el miedo escénico, fobias específicas, ansiedad generalizada y somatizaciones.',
    highlights: ['Técnicas de exposición gradual', 'Desactivación fisiológica', 'Prevención de recaídas'],
    color: 'from-teal-600 to-cyan-700',
    tag: 'Focalizada',
  },
  {
    id: 'online',
    icon: Laptop,
    title: 'Atención Psicológica Online',
    description: 'Sesiones de telepsicología con la misma efectividad que la atención presencial, desde la comodidad de tu hogar en todo Chile y el extranjero.',
    highlights: ['Plataforma segura y encriptada', 'Flexibilidad de horarios', 'Ahorro en traslados'],
    color: 'from-cyan-600 to-sky-700',
    tag: 'Todo Chile',
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="py-20 lg:py-28 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent-600 tracking-widest uppercase bg-accent-50 border border-accent-200 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Nuestras Especialidades
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Atención clínica adaptada a tus necesidades
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Contamos con un equipo multidisciplinario de psicólogos y psiquiatras dedicados a brindar una atención personalizada, basada en la evidencia científica y con calidez humana.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specialties.map((service) => {
            const Icon = service.icon;
            return (
              <div
                key={service.id}
                className="bg-white rounded-3xl p-7 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 flex flex-col justify-between group hover:-translate-y-1"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${service.color} flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <span className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-full">
                      {service.tag}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {service.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    {service.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {service.highlights.map((item, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={`/contacto?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary-600 hover:text-accent-600 transition-colors group-hover:translate-x-1"
                  >
                    <span>Solicitar esta especialidad</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary-950 via-primary-900 to-primary-950 rounded-3xl p-8 sm:p-10 text-white shadow-2xl border border-primary-800/40 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="space-y-2 relative z-10">
            <span className="text-[11px] font-bold uppercase tracking-widest text-accent-400">¿Primera vez en terapia?</span>
            <h4 className="text-xl sm:text-2xl font-extrabold text-white leading-snug">
              ¿Tienes dudas sobre qué tipo de terapia necesitas?
            </h4>
            <p className="text-sm text-slate-200 mt-1 max-w-xl leading-relaxed">
              Escríbenos y nuestro equipo clínico de admisión te orientará sin costo para encontrar al especialista más idóneo para ti.
            </p>
          </div>
          <Link
            href="/contacto"
            className="whitespace-nowrap px-7 py-3.5 rounded-full bg-accent-500 hover:bg-accent-400 text-slate-950 font-extrabold text-sm shadow-lg transition-all hover:scale-105 shrink-0 relative z-10"
          >
            Solicitar Orientación Gratuita
          </Link>
        </div>

      </div>
    </section>
  );
}
