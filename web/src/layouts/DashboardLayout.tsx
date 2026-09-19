import { useState } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import {
  MdDashboard,
  MdContentCut,
  MdEventNote,
  MdLogout,
  MdMenu,
  MdClose,
  MdOpenInNew,
} from "react-icons/md";
import { Sparkles, Sun, Moon } from "lucide-react";

const NAV = [
  { to: "/admin", icon: MdDashboard, label: "Panel de Control", end: true },
  { to: "/admin/citas", icon: MdEventNote, label: "Citas & Calendario" },
  { to: "/admin/servicios", icon: MdContentCut, label: "Servicios & Estilo" },
];

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`flex h-screen overflow-hidden transition-colors duration-300 selection:bg-[#d9487d]/40 selection:text-white ${
        isDark ? "bg-[#0a040b] text-[#fbf7fa]" : "bg-[#faf5f8] text-[#1e0a1d]"
      }`}
    >
      {/* Overlay para móviles */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar de Autor */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[250px] flex-col border-r transition-all duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        } ${
          isDark
            ? "bg-[#100512] border-[#220c24]"
            : "bg-white border-[#eedbe8] shadow-sm"
        }`}
      >
        {/* Header del Sidebar */}
        <div
          className={`flex h-16 items-center gap-3 border-b px-6 ${
            isDark ? "border-[#220c24]" : "border-[#eedbe8]"
          }`}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#d9487d] via-[#e25d8f] to-[#f49bbd] text-white font-display italic text-lg font-bold shadow-md shadow-[#d9487d]/30 border border-white/20">
            L
          </div>
          <div className="min-w-0">
            <span
              className={`font-display italic text-base font-semibold tracking-tight block truncate ${
                isDark ? "text-white" : "text-[#1e0a1d]"
              }`}
            >
              Lumière Nails
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#d9487d] block">
              Concierge Studio
            </span>
          </div>
          <button
            onClick={() => setOpen(false)}
            className={`ml-auto rounded-lg p-2.5 lg:hidden cursor-pointer ${
              isDark
                ? "text-[#8c6e88] hover:text-white hover:bg-[#1a091d]"
                : "text-[#8d6f88] hover:text-[#1e0a1d] hover:bg-[#faf0f5]"
            }`}
          >
            <MdClose className="h-5 w-5" />
          </button>
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-3.5 py-4 space-y-1 overflow-y-auto">
          <div
            className={`px-3 pb-2 text-[10px] font-bold uppercase tracking-widest ${
              isDark ? "text-[#72546e]" : "text-[#977391]"
            }`}
          >
            Gestión de Salón
          </div>
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              {...(item.end ? { end: true } : {})}
              onClick={() => setOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? isDark
                      ? "bg-[#d9487d]/15 text-[#f49bbd] border border-[#d9487d]/30 shadow-sm font-semibold"
                      : "bg-[#d9487d]/10 text-[#bf366a] border border-[#d9487d]/30 shadow-xs font-semibold"
                    : isDark
                    ? "text-[#a88ea4] hover:bg-[#19091b] hover:text-white"
                    : "text-[#765a71] hover:bg-[#fbf2f7] hover:text-[#1e0a1d]"
                }`
              }
            >
              <item.icon className="size-4 shrink-0 text-[#d9487d]" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Perfil & Cierre de Sesión */}
        <div
          className={`border-t p-3.5 ${
            isDark ? "border-[#220c24]" : "border-[#eedbe8]"
          }`}
        >
          <div
            className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
              isDark
                ? "bg-[#160818]/90 border-[#260e28]"
                : "bg-[#fcf5f9] border-[#eedbe8]"
            }`}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-[#2a0e28] to-[#3d153a] text-xs font-bold text-[#f49bbd] border border-[#d9487d]/20 shrink-0">
              {user?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <p
                className={`truncate text-xs font-semibold ${
                  isDark ? "text-white" : "text-[#1e0a1d]"
                }`}
              >
                {user?.name || "Administrador"}
              </p>
              <p className="truncate text-[10px] text-[#8c6e88] uppercase tracking-wider font-mono">
                {user?.role || "Admin"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className={`rounded-lg p-1.5 transition-colors cursor-pointer ${
                isDark
                  ? "text-[#8c6e88] hover:bg-rose-950/40 hover:text-rose-300"
                  : "text-[#8d6f88] hover:bg-rose-50 hover:text-rose-600"
              }`}
              title="Cerrar sesión"
            >
              <MdLogout className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal */}
      <div
        className={`flex flex-1 flex-col overflow-hidden transition-colors duration-300 ${
          isDark ? "bg-[#0a040b]" : "bg-[#faf5f8]"
        }`}
      >
        {/* Topbar Minimalista */}
        <header
          className={`flex h-16 shrink-0 items-center justify-between border-b backdrop-blur-md px-6 sm:px-8 transition-colors duration-300 ${
            isDark
              ? "border-[#220c24] bg-[#100512]/80"
              : "border-[#eedbe8] bg-white/80"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              className={`rounded-lg p-1.5 lg:hidden cursor-pointer ${
                isDark
                  ? "text-[#8c6e88] hover:text-white hover:bg-[#1a091d]"
                  : "text-[#8d6f88] hover:text-[#1e0a1d] hover:bg-[#fbf2f7]"
              }`}
            >
              <MdMenu className="size-5" />
            </button>
            <div
              className={`hidden sm:flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-medium ${
                isDark
                  ? "bg-[#18081a] border-[#2a0f2c] text-[#caa2c2]"
                  : "bg-[#fcf5f9] border-[#eedbe8] text-[#765a71]"
              }`}
            >
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Salón Concierge Activo</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Botón de Cambio de Tema Claro / Oscuro */}
            <button
              onClick={toggleTheme}
              className={`flex size-9 items-center justify-center rounded-xl border transition-all cursor-pointer shadow-xs ${
                isDark
                  ? "border-[#2b0f2a] bg-[#140616] text-amber-300 hover:border-[#d9487d]/50 hover:scale-105"
                  : "border-[#eedbe8] bg-[#fcf5f9] text-[#765a71] hover:text-[#d9487d] hover:border-[#d9487d] hover:scale-105"
              }`}
              title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
            >
              {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
            </button>

            {/* Enlace al Salón */}
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className={`hidden sm:inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold transition-all shadow-xs cursor-pointer ${
                isDark
                  ? "border-[#2b0f2a] bg-[#140616] text-[#f49bbd] hover:border-[#d9487d]/50 hover:bg-[#1e0a21]"
                  : "border-[#eedbe8] bg-white text-[#bf366a] hover:border-[#d9487d] hover:bg-[#fcf5f9]"
              }`}
            >
              <span>Ver Salón</span>
              <MdOpenInNew className="size-3.5" />
            </Link>
          </div>
        </header>

        {/* Contenedor Simétrico y Responsive con Scrollbar estilizada */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-10">
          <div className="max-w-7xl mx-auto w-full space-y-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
