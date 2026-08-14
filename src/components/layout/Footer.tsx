import Link from 'next/link';
import Image from 'next/image';
import { HeartPulse, Phone, Mail, MapPin, Clock, Facebook, Instagram, Linkedin, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { DEFAULT_SETTINGS } from '@/types';

const clinicalServices = [
  { name: 'Psicoterapia Individual Adultos', href: '/servicios#adultos' },
  { name: 'Psicología Infanto-Juvenil', href: '/servicios#infantil' },
  { name: 'Terapia de Pareja y Familiar', href: '/servicios#pareja' },
  { name: 'Manejo de Ansiedad y Depresión', href: '/servicios#ansiedad' },
  { name: 'Evaluaciones y Psiquiatría', href: '/servicios#evaluaciones' },
  { name: 'Atención Psicológica Online', href: '/servicios#online' },
];

const quickLinks = [
  { name: 'Inicio', href: '/' },
  { name: 'Nuestros Servicios', href: '/servicios' },
  { name: 'Sobre Nuestro Equipo', href: '/nosotros' },
  { name: 'Blog y Artículos', href: '/blog' },
  { name: 'Contacto y Citas', href: '/contacto' },
];

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-300 relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group mb-2">
              <Image
                src="/logo-23.webp"
                alt="Salud Mental Temuco"
                width={180}
                height={50}
                className="h-10 md:h-12 w-auto object-contain brightness-0 invert opacity-95 transition-opacity group-hover:opacity-100"
              />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed">
              Brindamos un espacio seguro, ético y confidencial en Temuco para el cuidado de tu salud mental y bienestar emocional, tanto en sesiones presenciales como online.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium pt-2">
              <ShieldCheck className="w-4 h-4 flex-shrink-0" />
              <span>Boletas reembolsables en Isapres y Seguros de Salud</span>
            </div>

            {/* Social Links */}
            <div className="flex gap-3 pt-2">
              {DEFAULT_SETTINGS.social_media.facebook && (
                <a
                  href={DEFAULT_SETTINGS.social_media.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1877F2] hover:bg-[#0e65d9] text-white transition-all hover:scale-105 shadow-md"
                  aria-label="Facebook"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              )}
              {DEFAULT_SETTINGS.social_media.instagram && (
                <a
                  href={DEFAULT_SETTINGS.social_media.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888] text-white transition-all hover:scale-105 shadow-md"
                  aria-label="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {DEFAULT_SETTINGS.social_media.linkedin && (
                <a
                  href={DEFAULT_SETTINGS.social_media.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#0A66C2] text-white transition-all hover:scale-105 shadow-md"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-400" />
              Áreas de Atención
            </h3>
            <ul className="space-y-2.5">
              {clinicalServices.map((service) => (
                <li key={service.name}>
                  <Link
                    href={service.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors block"
                  >
                    {service.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Enlaces Útiles
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact & Hours */}
          <div>
            <h3 className="text-white font-semibold text-sm tracking-wide uppercase mb-4">
              Contacto y Atención
            </h3>
            <ul className="space-y-3.5 text-sm">
              <li className="flex items-center gap-3 text-slate-300">
                <Phone className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <a href={`tel:${DEFAULT_SETTINGS.contact_phone}`} className="hover:text-white transition-colors">
                  {DEFAULT_SETTINGS.contact_phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <Mail className="w-4 h-4 text-accent-400 flex-shrink-0" />
                <a href={`mailto:${DEFAULT_SETTINGS.contact_email}`} className="hover:text-white transition-colors">
                  {DEFAULT_SETTINGS.contact_email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <Clock className="w-4 h-4 text-accent-400 flex-shrink-0 mt-1" />
                <span className="text-xs text-slate-400">{DEFAULT_SETTINGS.opening_hours}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {currentYear} {DEFAULT_SETTINGS.site_name} (saludmentaltemuco.cl). Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/contacto" className="hover:text-slate-300 transition-colors">
              Agendamiento
            </Link>
            <Link href="/blog" className="hover:text-slate-300 transition-colors">
              Artículos & Recursos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { Footer };