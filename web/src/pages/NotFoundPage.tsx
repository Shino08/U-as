import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowLeft, LayoutDashboard, Home } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export default function NotFoundPage() {
  const { theme } = useTheme();

  return (
    <div
      className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a050c] text-[#f8f2f6]" : "bg-[#faf6f9] text-[#1d0f1c]"
      }`}
    >
      {/* Mini Header */}
      <header className="px-6 py-6 max-w-7xl mx-auto w-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="size-8 rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] flex items-center justify-center text-white">
            <Sparkles className="size-4" />
          </div>
          <span className="font-display italic text-xl font-bold tracking-tight">
            Lumière Nails
          </span>
        </Link>
        <Link
          to="/"
          className={`text-xs font-semibold uppercase tracking-wider transition-colors ${
            theme === "dark" ? "text-[#bba1b7] hover:text-white" : "text-[#786175] hover:text-black"
          }`}
        >
          ← Volver al Estudio
        </Link>
      </header>

      {/* Main 404 Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="max-w-xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-semibold tracking-wider uppercase bg-[#d9487d]/10 border-[#d9487d]/30 text-[#d9487d]">
            <span>Error 404</span>
          </div>

          <h1 className="font-display text-7xl sm:text-8xl md:text-9xl font-light italic tracking-tight text-[#d9487d]">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-medium">
              Página no encontrada
            </h2>
            <p
              className={`text-sm sm:text-base max-w-md mx-auto leading-relaxed ${
                theme === "dark" ? "text-[#a890a5]" : "text-[#695365]"
              }`}
            >
              La dirección que buscas no existe o ha sido reubicada. Te invitamos a regresar a la
              colección principal o gestionar citas en el panel.
            </p>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#d9487d] to-[#e8709a] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#d9487d]/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Home className="size-4" />
              <span>Página Principal</span>
            </Link>

            <Link
              to="/dashboard"
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border text-xs font-bold uppercase tracking-wider transition-all ${
                theme === "dark"
                  ? "border-[#381635] bg-[#160918] text-[#f29ebb] hover:bg-[#250d24] hover:text-white"
                  : "border-[#e0cad9] bg-white text-[#b33261] hover:bg-[#fcebf2]"
              }`}
            >
              <LayoutDashboard className="size-4" />
              <span>Panel de Control</span>
            </Link>
          </div>
        </div>
      </main>

      {/* Mini Footer */}
      <footer
        className={`py-6 text-center text-xs border-t transition-colors ${
          theme === "dark"
            ? "border-[#1c0c1e] text-[#6e586c]"
            : "border-[#ebdce7] text-[#8f758d]"
        }`}
      >
        <p>© {new Date().getFullYear()} Lumière Nails Studio. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
