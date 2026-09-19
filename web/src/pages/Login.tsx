import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import {
  MdVisibility,
  MdVisibilityOff,
  MdArrowBack,
  MdLockOutline,
  MdMailOutline,
} from "react-icons/md";
import { Sparkles, Sun, Moon } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err: any) {
      setError(err.message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };


  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 relative overflow-hidden transition-colors duration-300 ${
        isDark
          ? "bg-[#0a030b] text-[#fbf7fa]"
          : "bg-[#fcf7fa] text-[#1e0a1d]"
      } selection:bg-[#d9487d] selection:text-white`}
    >
      {/* Luces ambientales adaptativas */}
      <div
        className={`pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[580px] h-[580px] rounded-full blur-[120px] transition-opacity duration-300 ${
          isDark ? "bg-[#d9487d]/15 opacity-100" : "bg-[#d9487d]/10 opacity-70"
        }`}
      />
      <div
        className={`pointer-events-none absolute -bottom-24 -right-24 w-80 h-80 rounded-full blur-[100px] transition-opacity duration-300 ${
          isDark ? "bg-[#a32a68]/10" : "bg-[#e25d8f]/10"
        }`}
      />

      {/* Barra superior de navegación: Volver al salón + Cambio de Tema */}
      <div className="absolute top-6 inset-x-6 flex items-center justify-between z-20">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border transition-all duration-200 shadow-md ${
            isDark
              ? "border-[#2b0f2a] bg-[#140616]/70 text-[#c8a9c4] hover:text-white hover:border-[#d9487d]/40"
              : "border-[#edd5e5] bg-white/80 text-[#765a71] hover:text-[#1e0a1d] hover:border-[#d9487d]"
          } backdrop-blur-md`}
        >
          <MdArrowBack className="size-4" />
          <span>Volver al Salón</span>
        </Link>

        <button
          onClick={toggleTheme}
          className={`flex size-10 items-center justify-center rounded-full border transition-all duration-200 shadow-md cursor-pointer ${
            isDark
              ? "border-[#2b0f2a] bg-[#140616]/70 text-amber-300 hover:border-[#d9487d]/40 hover:scale-105"
              : "border-[#edd5e5] bg-white/80 text-[#765a71] hover:text-[#d9487d] hover:border-[#d9487d] hover:scale-105"
          } backdrop-blur-md`}
          title={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        >
          {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
      </div>

      {/* Tarjeta editorial de Login */}
      <div
        className={`w-full max-w-[390px] rounded-3xl border p-8 sm:p-9 shadow-2xl relative z-10 backdrop-blur-xl transition-all duration-300 ${
          isDark
            ? "border-[#2d102c] bg-[#130615]/90 shadow-black/80 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d9487d]/50 before:to-transparent"
            : "border-[#eed8e7] bg-white/95 shadow-[#d9487d]/10 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-[#d9487d]/40 before:to-transparent"
        }`}
      >
        {/* Header con Monograma de Lujo */}
        <div className="mb-7 text-center">
          <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#d9487d] via-[#e25d8f] to-[#f49bbd] text-white font-display italic text-2xl font-bold shadow-lg shadow-[#d9487d]/35 border border-white/20">
            L
          </div>
          <h1
            className={`font-display italic text-2xl sm:text-3xl font-light tracking-tight ${
              isDark ? "text-white" : "text-[#1e0a1d]"
            }`}
          >
            Lumière Nails
          </h1>
          <div className="inline-flex items-center gap-1.5 mt-1.5 px-3 py-0.5 rounded-full bg-[#d9487d]/10 border border-[#d9487d]/20 text-[11px] font-semibold tracking-wider uppercase text-[#d9487d]">
            <Sparkles className="size-3 animate-pulse text-[#d9487d]" />
            <span>Portal de Administración</span>
          </div>
          <p className={`mt-2 text-xs ${isDark ? "text-[#a488a0]" : "text-[#765a71]"}`}>
            Gestión de servicios, lookbook y citas exclusivas
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-xs text-rose-300 leading-relaxed animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label
              className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? "text-[#d0b4cc]" : "text-[#5e4359]"
              }`}
            >
              <MdMailOutline className="size-3.5 text-[#d9487d]" />
              <span>Correo Electrónico</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`h-11 w-full rounded-xl border px-3.5 text-sm transition-all duration-200 focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                isDark
                  ? "border-[#2d102c] bg-[#1c081e]/90 text-[#fbf7fa] placeholder:text-[#6e526b]"
                  : "border-[#e6d0df] bg-[#fbf7fa] text-[#1e0a1d] placeholder:text-[#b192ab]"
              }`}
              placeholder="admin@lumierenails.com"
            />
          </div>

          <div className="space-y-1.5">
            <label
              className={`text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                isDark ? "text-[#d0b4cc]" : "text-[#5e4359]"
              }`}
            >
              <MdLockOutline className="size-3.5 text-[#d9487d]" />
              <span>Contraseña</span>
            </label>
            <div className="relative">
              <input
                type={showPw ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={`h-11 w-full rounded-xl border px-3.5 pr-10 text-sm transition-all duration-200 focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                  isDark
                    ? "border-[#2d102c] bg-[#1c081e]/90 text-[#fbf7fa] placeholder:text-[#6e526b]"
                    : "border-[#e6d0df] bg-[#fbf7fa] text-[#1e0a1d] placeholder:text-[#b192ab]"
                }`}
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors cursor-pointer ${
                  isDark ? "text-[#8c6e88] hover:text-white" : "text-[#977892] hover:text-[#1e0a1d]"
                }`}
                title={showPw ? "Ocultar contraseña" : "Ver contraseña"}
              >
                {showPw ? (
                  <MdVisibilityOff className="size-4" />
                ) : (
                  <MdVisibility className="size-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="h-11 w-full mt-2 rounded-xl bg-gradient-to-r from-[#d9487d] via-[#c93e72] to-[#b32e60] hover:from-[#e3568b] hover:via-[#d9487d] hover:to-[#c2366b] text-sm font-semibold text-white shadow-lg shadow-[#d9487d]/25 hover:shadow-xl hover:shadow-[#d9487d]/35 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span>Acceder al Panel</span>
            )}
          </button>
        </form>


      </div>
    </div>
  );
}
