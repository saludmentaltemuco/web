import Link from 'next/link';
import { 
  UserCheck, 
  SmilePlus, 
  Users, 
  BrainCircuit, 
  Sparkles, 
  Laptop, 
  ArrowRight,
  CheckCircle2,
  Phone,
  ShieldCheck
} from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';
import { CTASection } from '@/components/sections';

export const metadata = {
  title: `Servicios y Especialidades | ${DEFAULT_SETTINGS.site_name}`,
  description: 'Conoce todas nuestras especialidades en psicología clínica, terapia individual, infanto-juvenil, terapia de parejas y psiquiatría en Temuco y Online.',
};

const servicesList = [
  {
    id: 'adultos',
    icon: UserCheck,
    title: 'Psicoterapia Individual para Adultos',
    subtitle: 'Manejo de ansiedad, depresión, crisis vitales y crecimiento personal.',
    description: 'La psicoterapia individual ofrece un espacio protegido y confidencial para explorar las dificultades emocionales, comprender patrones de pensamiento y comportamiento limitantes y desarrollar recursos personales para una vida más plena.',
    indications: [
      'Cuadros de ansiedad generalizada, estrés crónico y crisis de pánico',
      'Depresión, desmotivación o vacío emocional',
      'Procesos de duelo, separaciones y cambios importantes',
      'Autoestima, asertividad y habilidades de comunicación',
      'Burnout y agotamiento laboral',
    ],
    methodology: 'Enfoques integrativos: Terapia Cognitivo-Conductual (TCC), Terapia de Aceptación y Compromiso (ACT) y Terapia Humanista.',
  },
  {
    id: 'infantil',
    icon: SmilePlus,
    title: 'Psicología Infanto-Juvenil',
    subtitle: 'Atención especializada para niños, niñas y adolescentes.',
    description: 'Acompañamos el desarrollo socioemocional de niños y adolescentes mediante herramientas lúdicas, expresivas y de diálogo, trabajando en estrecha colaboración con los padres o cuidadores.',
    indications: [
      'Dificultades en la regulación emocional (rabietas, impulsividad, frustración)',
      'Ansiedad infantil, miedos intensos o dificultades escolares',
      'Acoso escolar (bullying) o problemas de adaptación social',
      'Cambios familiares (separación de padres, pérdidas, mudanzas)',
      'Orientación y pautas de crianza respetuosa para padres',
    ],
    methodology: 'Terapia basada en el juego, evaluación psicodinámica y vinculación activa con la familia.',
  },
  {
    id: 'pareja',
    icon: Users,
    title: 'Terapia de Pareja y Familiar',
    subtitle: 'Resolución de conflictos y fortalecimiento vincular.',
    description: 'Espacio guiado por un terapeuta neutral para mejorar la comunicación, comprender las dinámicas relacionales y encontrar acuerdos saludables para ambas partes.',
    indications: [
      'Problemas recurrentes de comunicación y discusiones destructivas',
      'Crisis por infidelidad o pérdida de confianza',
      'Desconexión afectiva y sexual',
      'Manejo conjunto de la crianza de los hijos',
      'Procesos de separación respetuosa y acuerdos de coparentalidad',
    ],
    methodology: 'Terapia Familiar y de Pareja Sistémica, Enfoque Focalizado en las Emociones (EFT).',
  },
  {
    id: 'psiquiatria',
    icon: BrainCircuit,
    title: 'Psiquiatría y Evaluación Integral',
    subtitle: 'Diagnóstico médico y tratamiento farmacológico complementario.',
    description: 'Evaluación exhaustiva de cuadros clínicos complejos que puedan requerir intervención médica o farmacológica en conjunto con el proceso psicoterapéutico.',
    indications: [
      'Trastornos del estado de ánimo resistentes a psicoterapia',
      'Trastornos de ansiedad severos y crisis recurrentes',
      'Evaluaciones diagnósticas y certificados clínicos',
      'Ajuste y seguimiento de esquemas de psicofármacos',
    ],
    methodology: 'Modelo biopsicosocial y seguimiento riguroso y personalizado.',
  },
  {
    id: 'online',
    icon: Laptop,
    title: 'Atención Psicológica Online',
    subtitle: 'Telepsicología accesible para todo Chile y el extranjero.',
    description: 'Misma rigurosidad clínica y calidez humana que la sesión presencial, a través de videollamadas seguras y confidenciales.',
    indications: [
      'Personas con dificultades de traslado o tiempo limitado',
      'Pacientes que residen fuera de Temuco o en zonas rurales',
      'Chilenos en el extranjero que buscan terapeutas nativos',
      'Comodidad y privacidad desde tu hogar o espacio de trabajo',
    ],
    methodology: 'Videoconsulta protegida por plataformas de salud con estándares de ciberseguridad.',
  },
];

export default function ServiciosPage() {
  return (
    <div className="pt-28 pb-20 bg-slate-50 min-h-screen">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-primary-950 via-primary-900 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="text-xs font-bold text-accent-400 tracking-widest uppercase bg-accent-500/10 border border-accent-400/20 px-3.5 py-1.5 rounded-full inline-block mb-4">
            Especialidades Clínicas
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white max-w-3xl mx-auto">
            Servicios y Terapias Especializadas
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Descubre nuestras áreas de intervención y elige el acompañamiento profesional que mejor responda a tu momento de vida.
          </p>
        </div>
      </section>

      {/* Services List */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
        {servicesList.map((service, index) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              id={service.id}
              className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-slate-100 transition-all hover:shadow-md"
            >
              <div className="flex flex-col lg:flex-row gap-8 items-start justify-between">
                
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900">{service.title}</h2>
                      <p className="text-xs font-medium text-accent-700">{service.subtitle}</p>
                    </div>
                  </div>

                  <p className="text-sm text-slate-600 leading-relaxed pt-2">
                    {service.description}
                  </p>

                  <div className="pt-2">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                      Motivos frecuentes de consulta:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {service.indications.map((ind, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                          <span>{ind}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Metodología clínica: </span>
                    {service.methodology}
                  </div>
                </div>

                <div className="lg:w-64 w-full flex flex-col gap-3 shrink-0 pt-4 lg:pt-0">
                  <div className="p-4 rounded-2xl bg-primary-50 border border-primary-100 text-center space-y-2">
                    <ShieldCheck className="w-6 h-6 text-primary-600 mx-auto" />
                    <p className="text-xs font-bold text-primary-900">Boleta Reembolsable</p>
                    <p className="text-[11px] text-primary-700 leading-snug">Válida para Isapres y Seguros Complementarios.</p>
                  </div>

                  <Link
                    href={`/contacto?service=${encodeURIComponent(service.title)}`}
                    className="w-full py-3.5 px-4 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-xl text-center text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Solicitar esta especialidad</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>

      <CTASection />
    </div>
  );
}
