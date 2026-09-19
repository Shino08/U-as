import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Sun, Moon, LayoutDashboard, Menu, X, ArrowUpRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  return (
    <header className="sticky top-0 z-50 px-4 sm:px-8 pt-4 pb-2 transition-colors duration-300">
      <nav
        className={cn(
          "max-w-7xl mx-auto rounded-full px-6 h-16 flex items-center justify-between shadow-2xl transition-all duration-300",
          theme === "dark"
            ? "bg-[#120714]/90 backdrop-blur-xl border border-[#2a1327] shadow-black/60"
            : "bg-white/90 backdrop-blur-xl border border-[#ebdce7] shadow-pink-900/5 text-[#1d0f1c]"
        )}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group focus:outline-none">
          <div className="size-9 rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] flex items-center justify-center shadow-lg shadow-[#d9487d]/30 group-hover:scale-105 transition-transform">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span
              className={cn(
                "font-display italic text-2xl font-semibold tracking-tight",
                theme === "dark" ? "text-white" : "text-[#1d0f1c]"
              )}
            >
              Lumière
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d9487d]">
              Nails
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          {!isDashboard ? (
            <>
              <a
                href="#lookbook"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                Lookbook
              </a>
              <a
                href="#servicios"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                Servicios
              </a>
              <a
                href="#ritual"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                El Ritual
              </a>
              <a
                href="#personalizar"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                Personalizar
              </a>
              <a
                href="#faq"
                className={cn(
                  "transition-colors",
                  theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                FAQ
              </a>
            </>
          ) : (
            <Link
              to="/"
              className={cn(
                "flex items-center gap-1.5 transition-colors",
                theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
              )}
            >
              <span>Ver Landing</span>
              <ArrowUpRight className="size-3.5 text-[#d9487d]" />
            </Link>
          )}

          {/* <Link
            to="/dashboard"
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-full border transition-all",
              isDashboard
                ? "bg-[#d9487d] text-white border-[#d9487d]"
                : theme === "dark"
                ? "border-[#381635] text-[#f29ebb] hover:bg-[#250e23]"
                : "border-[#f0d5e6] text-[#b33261] hover:bg-[#fce7ef]"
            )}
          >
            <LayoutDashboard className="size-3.5" />
            <span>Dashboard</span>
          </Link> */}
        </div>

        {/* Actions: Theme Toggle & Booking CTA */}
        <div className="flex items-center gap-3">
          {/* Dark / Light Mode Switch */}
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "p-2.5 rounded-full border transition-all flex items-center justify-center",
              theme === "dark"
                ? "border-[#3b1737] bg-[#1c0c1e] text-[#f29ebb] hover:bg-[#2e1231] hover:text-white"
                : "border-[#e6d0e1] bg-[#f8ecf5] text-[#b33261] hover:bg-[#f0daeb] hover:text-[#1d0f1c]"
            )}
            title={theme === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            aria-label="Cambiar tema"
          >
            {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
          </button>

          {!isDashboard ? (
            <a
              href="#reserva"
              className="hidden sm:inline-flex px-5 py-2 rounded-full bg-gradient-to-r from-[#d9487d] to-[#e8709a] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:shadow-[#d9487d]/30 hover:scale-105 active:scale-95 transition-all"
            >
              Agendar
            </a>
          ) : (
            <Link
              to="/"
              className="hidden sm:inline-flex px-5 py-2 rounded-full bg-[#d9487d] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#e8709a] transition-all"
            >
              Ir al Sitio
            </Link>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className={cn(
              "lg:hidden p-2 rounded-xl transition-colors",
              theme === "dark" ? "text-[#f29ebb]" : "text-[#b33261]"
            )}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl p-6 space-y-4 shadow-2xl border animate-in fade-in slide-in-from-top-3",
            theme === "dark"
              ? "bg-[#140816] border-[#2b1428] text-white"
              : "bg-white border-[#ebdce7] text-[#1d0f1c]"
          )}
        >
          {!isDashboard ? (
            <>
              <a
                href="#lookbook"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold py-1.5 hover:text-[#d9487d]"
              >
                Lookbook de Tendencias
              </a>
              <a
                href="#servicios"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold py-1.5 hover:text-[#d9487d]"
              >
                Catálogo de Servicios
              </a>
              <a
                href="#ritual"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold py-1.5 hover:text-[#d9487d]"
              >
                El Ritual de Creación
              </a>
              <a
                href="#personalizar"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold py-1.5 hover:text-[#d9487d]"
              >
                Calculadora de Estilo
              </a>
              <a
                href="#faq"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-semibold py-1.5 hover:text-[#d9487d]"
              >
                Preguntas Frecuentes
              </a>
              <a
                href="#reserva"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3 rounded-full bg-[#d9487d] text-white text-center font-bold text-xs uppercase tracking-wider mt-2"
              >
                Reservar Cita en Línea
              </a>
            </>
          ) : (
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-semibold py-2 text-[#d9487d]"
            >
              ← Volver a la Landing
            </Link>
          )}

          <div className="pt-3 border-t border-current/10 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d9487d]"
            >
              <LayoutDashboard className="size-4" />
              <span>Panel de Control</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              className={cn(
                "p-2 rounded-full border text-xs font-semibold flex items-center gap-2 px-3",
                theme === "dark"
                  ? "border-[#3b1737] bg-[#1c0c1e] text-[#f29ebb]"
                  : "border-[#e6d0e1] bg-[#f8ecf5] text-[#b33261]"
              )}
            >
              {theme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
              <span>{theme === "dark" ? "Modo Claro" : "Modo Oscuro"}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

function cn(...classes: (string | boolean | undefined | null)[]) {
  return classes.filter(Boolean).join(" ");
}
