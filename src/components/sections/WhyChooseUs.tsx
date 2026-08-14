import { ShieldCheck, Award, HeartHandshake, CreditCard, Clock, Sparkles } from 'lucide-react';

const reasons = [
  {
    icon: Award,
    title: 'Profesionales Acreditados',
    description: 'Psicólogos y psiquiatras titulados con postítulos clínicos y amplia experiencia en salud mental y psicoterapia.',
  },
  {
    icon: ShieldCheck,
    title: 'Confidencialidad y Ética',
    description: 'Garantizamos absoluta reserva bajo el estricto código de ética profesional y la ley de derechos del paciente.',
  },
  {
    icon: CreditCard,
    title: 'Medios de Pago y Boleta',
    description: 'Pagos por transferencia, link de pago, Webpay y Mercado Pago. Todas nuestras atenciones emiten boleta de honorarios para reembolso en Isapres y Seguros.',
  },
  {
    icon: HeartHandshake,
    title: 'Trato Cercano y Humano',
    description: 'Nos enfocamos en construir una alianza terapéutica sólida y empática, respetando tus tiempos y tu historia personal.',
  },
  {
    icon: Clock,
    title: 'Flexibilidad de Horarios',
    description: 'Atención en jornada extendida de lunes a viernes y sábados por la mañana, con modalidad presencial en Temuco y online.',
  },
  {
    icon: Sparkles,
    title: 'Tratamientos Basados en Evidencia',
    description: 'Metodologías terapéuticas respaldadas por la ciencia (TCC, Terapia Sistémica, ACT, Mindfulness Terapéutico).',
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary-600 tracking-widest uppercase bg-primary-50 border border-primary-100 px-3.5 py-1.5 rounded-full inline-block mb-3">
            Nuestro Compromiso
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ¿Por qué confiar en Salud Mental Temuco?
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Sabemos que dar el primer paso para iniciar un proceso terapéutico requiere valentía y confianza. Por eso cuidamos cada detalle de tu experiencia.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-8 rounded-3xl bg-slate-50 hover:bg-white border border-slate-100 hover:border-primary-100 shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Icon className="w-6 h-6 stroke-[1.8]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}