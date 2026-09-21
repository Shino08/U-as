import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import brandPhoto from "@/assets/lumiere-hero.jpg";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/admin");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "No pudimos verificar tus datos. Inténtalo de nuevo."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = cn(
    "block w-full text-base rounded-xl border px-4 py-3.5 outline-none transition-colors",
    isDark
      ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f] focus:border-[#d9487d]"
      : "bg-white border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400 focus:border-[#d9487d]"
  );
  const labelClass = cn(
    "block text-xs font-semibold mb-2",
    isDark ? "text-[#a890a5]" : "text-[#695365]"
  );

  return (
    <div
      className={cn(
        "min-h-screen grid lg:grid-cols-2 transition-colors",
        isDark ? "bg-[#0a050c] text-[#f8f2f6]" : "bg-white text-[#1d0f1c]"
      )}
    >
      {/* Panel de marca a pantalla completa */}
      <section className="relative hidden lg:flex flex-col justify-between p-10 min-h-screen overflow-hidden isolate">
        <img
          src={brandPhoto}
          alt="Manicura de autor Lumière Nails"
          className="absolute inset-0 -z-20 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(58% 78% at -6% 30%, rgba(217,72,125,0.45) 0%, rgba(217,72,125,0) 62%), linear-gradient(to top, rgba(10,5,12,0.92) 0%, rgba(10,5,12,0.5) 45%, rgba(10,5,12,0.08) 75%)",
          }}
        />

        <Link
          to="/"
          aria-label="Volver al sitio"
          className="inline-flex items-center justify-center size-14 rounded-full bg-white text-[#1d0f1c] shadow-xl hover:-translate-x-1 transition-transform"
        >
          <ArrowLeft className="size-5" />
        </Link>

        <div className="max-w-lg" style={{ color: "#E8E0D2" }}>
          <h2 className="font-display text-4xl lg:text-5xl font-light leading-tight mb-5">
            Un estudio que <span className="italic">cuida cada detalle.</span>
          </h2>
          <p className="text-sm leading-relaxed opacity-80 mb-7 max-w-md">
            Gestiona tu catálogo de servicios, tu Lookbook y las citas de tus
            clientas desde un mismo panel, pensado para el ritmo de un estudio
            de nail art de autor.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-3 text-sm font-semibold text-white border-b border-white/30 hover:border-white/90 pb-1 transition-colors group"
          >
            Explorar el sitio de Lumière Nails
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Panel de formulario */}
      <section className="flex items-center justify-center px-6 py-16 sm:px-10 lg:px-20">
        <div className="w-full max-w-[404px]">
          <span className="inline-flex size-11 items-center justify-center rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] text-white shadow-lg shadow-[#d9487d]/30 mb-6">
            <Sparkles className="size-5" />
          </span>

          <h1 className="font-display text-2xl sm:text-3xl font-light mb-3">
            Inicia sesión en tu panel
          </h1>
          <span className="block w-7 h-[3px] rounded-full bg-[#d9487d] mb-8" />

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className={labelClass}>
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tucorreo@lumierenails.com"
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className={labelClass}>
                Contraseña
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={cn(inputClass, "pr-12")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-current/50 hover:text-[#d9487d] transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-3 rounded-xl py-4 text-xs font-bold uppercase tracking-[0.08em] text-white bg-gradient-to-r from-[#d9487d] to-[#f29ebb] shadow-lg shadow-[#d9487d]/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer mt-2"
            >
              {isSubmitting ? "Verificando..." : "Continuar"}
            </button>
          </form>

          <p
            className={cn(
              "mt-8 text-xs leading-relaxed",
              isDark ? "text-[#a890a5]" : "text-[#695365]"
            )}
          >
            Este acceso es exclusivo para el equipo administrativo de
            Lumière Nails Studio. Si eres clienta, no necesitas iniciar
            sesión para reservar tu cita.
          </p>
        </div>
      </section>
    </div>
  );
}
