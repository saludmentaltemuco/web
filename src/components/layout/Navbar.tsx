'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, Phone, HeartPulse, Clock, MessageSquareQuote } from 'lucide-react';
import { cn } from '@/lib';
import { DEFAULT_SETTINGS } from '@/types';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Especialidades & Servicios', href: '/servicios' },
    { name: 'Sobre Nosotros', href: '/nosotros' },
    { name: 'Blog & Recursos', href: '/blog' },
    { name: 'Contacto & Ubicación', href: '/contacto' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* ── Top Utility Bar ── */}
      <div className="bg-primary-950 text-slate-300 text-xs py-1.5 border-b border-primary-900/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="hidden md:flex items-center gap-1.5 text-accent-300 font-medium">
              <Clock className="w-3.5 h-3.5 text-accent-400" />
              {DEFAULT_SETTINGS.opening_hours}
            </span>
            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-300">
              Atención Presencial en Temuco y Sesiones Online
            </span>
          </div>
          <div className="flex items-center gap-4 ml-auto">
            <a
              href={`https://wa.me/${DEFAULT_SETTINGS.contact_whatsapp}?text=Hola,%20quisiera%20solicitar%20informaci%C3%B3n%20sobre%20atenci%C3%B3n%20en%20Salud%20Mental%20Temuco`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageSquareQuote className="w-3.5 h-3.5" />
              WhatsApp Directo
            </a>
            <a
              href={`tel:${DEFAULT_SETTINGS.contact_phone}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <Phone className="w-3 h-3 text-accent-400" />
              {DEFAULT_SETTINGS.contact_phone}
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Navbar ── */}
      <div className="bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-100 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary-700 via-primary-600 to-accent-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform duration-300">
                <HeartPulse className="w-6 h-6 stroke-[2]" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg md:text-xl font-extrabold text-primary-950 tracking-tight leading-tight group-hover:text-primary-700 transition-colors">
                  Salud Mental <span className="text-accent-600">Temuco</span>
                </span>
                <span className="text-[11px] text-slate-500 font-medium tracking-wide uppercase">
                  Centro de Psicología & Psicoterapia
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={cn(
                      'text-sm font-medium transition-all py-1.5 relative',
                      isActive
                        ? 'text-primary-700 font-semibold'
                        : 'text-slate-600 hover:text-primary-600'
                    )}
                  >
                    {link.name}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full animate-fade-in" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/contacto"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-102 active:scale-98"
              >
                <span>Solicitar Consulta</span>
              </Link>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {isOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 shadow-xl animate-fade-in">
            <div className="px-5 py-4 space-y-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'block px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary-50 text-primary-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    )}
                  >
                    {link.name}
                  </Link>
                );
              })}
              <div className="pt-3">
                <Link
                  href="/contacto"
                  onClick={() => setIsOpen(false)}
                  className="block w-full text-center bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 rounded-xl shadow-md transition-colors text-sm"
                >
                  Solicitar Consulta / Agendar Hora
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export { Navbar };