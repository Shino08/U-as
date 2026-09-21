import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sparkles, Sun, Moon, Menu, X, ArrowUpRight, LayoutDashboard } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "#lookbook", label: "Lookbook" },
  { href: "#servicios", label: "Servicios" },
  { href: "#ritual", label: "El Ritual" },
  { href: "#personalizar", label: "Personalizar" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isDashboard = location.pathname.startsWith("/dashboard");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 lg:px-8 pt-3 sm:pt-4 pb-2 transition-all duration-300 pointer-events-none">
      <nav
        className={cn(
          "max-w-7xl mx-auto rounded-full px-4 sm:px-6 h-16 flex items-center justify-between shadow-2xl transition-all duration-300 pointer-events-auto backdrop-blur-xl border",
          !scrolled
            ? "bg-black/35 border-white/15 text-white shadow-black/40"
            : theme === "dark"
            ? "bg-[#120714]/85 border-[#2a1327] text-white shadow-black/60"
            : "bg-white/85 border-[#ebdce7] text-[#1d0f1c] shadow-pink-900/5"
        )}
      >
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group focus:outline-none shrink-0">
          <div className="size-9 rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] flex items-center justify-center shadow-lg shadow-[#d9487d]/30 group-hover:scale-105 transition-transform shrink-0">
            <Sparkles className="size-4 text-white" />
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className={cn("font-display italic text-xl sm:text-2xl font-semibold tracking-tight", !scrolled || theme === "dark" ? "text-white" : "text-[#1d0f1c]")}>
              Lumière
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#d9487d]">
              Nails
            </span>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-7 text-xs font-semibold uppercase tracking-wider">
          {!isDashboard ? (
            NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={cn(
                  "transition-colors",
                  !scrolled ? "text-white/80 hover:text-white" : theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]"
                )}
              >
                {link.label}
              </a>
            ))
          ) : (
            <Link to="/" className={cn("flex items-center gap-1.5 transition-colors", !scrolled || theme === "dark" ? "text-white/80 hover:text-white" : "text-[#694f66] hover:text-[#1d0f1c]")}>
              <span>Ver Landing</span>
              <ArrowUpRight className="size-3.5 text-[#d9487d]" />
            </Link>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={cn(
              "size-11 rounded-full border transition-all flex items-center justify-center cursor-pointer shrink-0",
              !scrolled
                ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                : theme === "dark"
                ? "border-[#3b1737] bg-[#1c0c1e] text-[#f29ebb] hover:bg-[#2e1231] hover:text-white"
                : "border-[#e6d0e1] bg-[#f8ecf5] text-[#b33261] hover:bg-[#f0daeb]"
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

          <button
            type="button"
            className={cn("lg:hidden size-11 rounded-xl transition-colors cursor-pointer flex items-center justify-center shrink-0", !scrolled ? "text-white" : theme === "dark" ? "text-[#f29ebb]" : "text-[#b33261]")}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div
          className={cn(
            "lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl p-5 sm:p-6 space-y-4 shadow-2xl border animate-in fade-in slide-in-from-top-3 pointer-events-auto backdrop-blur-2xl max-h-[calc(100vh-6rem)] overflow-y-auto",
            theme === "dark" || !scrolled ? "bg-[#140816]/95 border-[#2b1428] text-white" : "bg-white/95 border-[#ebdce7] text-[#1d0f1c]"
          )}
        >
          {!isDashboard ? (
            <>
              {NAV_LINKS.map((item) => (
                <a key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold py-2 hover:text-[#d9487d] min-h-[44px] flex items-center">
                  {item.label}
                </a>
              ))}
              <a
                href="#reserva"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full py-3.5 rounded-full bg-[#d9487d] text-white text-center font-bold text-xs uppercase tracking-wider mt-2 min-h-[44px] flex items-center justify-center"
              >
                Reservar Cita en Línea
              </a>
            </>
          ) : (
            <Link to="/" onClick={() => setMobileMenuOpen(false)} className="block text-sm font-semibold py-2 text-[#d9487d] min-h-[44px] flex items-center">
              ← Volver a la Landing
            </Link>
          )}

          <div className="pt-3 border-t border-current/10 flex items-center justify-between">
            <Link
              to="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d9487d] min-h-[44px]"
            >
              <LayoutDashboard className="size-4" />
              <span>Panel de Control</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
