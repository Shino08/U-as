import { useEffect, useState } from "react";
import api from "@/api/client";
import { Link } from "react-router-dom";
import { useTheme } from "@/context/ThemeContext";
import {
  MdEventNote,
  MdSchedule,
  MdContentCut,
  MdCheckCircle,
  MdArrowForward,
} from "react-icons/md";
import { Sparkles, ArrowRight } from "lucide-react";

interface Stats {
  totalAppointments: number;
  pendingAppointments: number;
  totalServices: number;
  activeServices: number;
}

function SkeletonCard({ isDark }: { isDark: boolean }) {
  return (
    <div
      className={`rounded-3xl border p-6 animate-pulse ${
        isDark
          ? "border-[#240d26] bg-[#120614]/90"
          : "border-[#eedbe8] bg-white shadow-xs"
      }`}
    >
      <div className="flex items-center justify-between">
        <div
          className={`h-3.5 w-24 rounded ${isDark ? "bg-[#200b22]" : "bg-gray-100"}`}
        />
        <div
          className={`h-9 w-9 rounded-xl ${isDark ? "bg-[#200b22]" : "bg-gray-100"}`}
        />
      </div>
      <div
        className={`mt-4 h-8 w-16 rounded ${isDark ? "bg-[#200b22]" : "bg-gray-100"}`}
      />
    </div>
  );
}

export default function DashboardHome() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [stats, setStats] = useState<Stats>({
    totalAppointments: 0,
    pendingAppointments: 0,
    totalServices: 0,
    activeServices: 0,
  });
  const [recent, setRecent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [apptRes, svcRes] = await Promise.all([
          api.get("/appointments").catch(() => []),
          api.get("/services").catch(() => []),
        ]);
        const appointments = Array.isArray(apptRes) ? apptRes : [];
        const services = Array.isArray(svcRes) ? svcRes : [];

        setStats({
          totalAppointments: appointments.length,
          pendingAppointments: appointments.filter(
            (a: any) => a.status === "pending"
          ).length,
          totalServices: services.length,
          activeServices: services.filter((s: any) => s.active).length,
        });
        setRecent(appointments.slice(0, 5));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const cards = [
    {
      label: "Citas Totales",
      value: stats.totalAppointments,
      icon: MdEventNote,
      accent: "bg-[#d9487d]/15 text-[#f49bbd] border border-[#d9487d]/20",
    },
    {
      label: "Citas Pendientes",
      value: stats.pendingAppointments,
      icon: MdSchedule,
      accent: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
    },
    {
      label: "Servicios Activos",
      value: stats.activeServices,
      icon: MdCheckCircle,
      accent: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20",
    },
    {
      label: "Catálogo de Servicios",
      value: stats.totalServices,
      icon: MdContentCut,
      accent: "bg-rose-500/15 text-rose-400 border border-rose-500/20",
    },
  ];

  const statusStyle: Record<string, string> = {
    pending: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    confirmed: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    cancelled: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
    completed: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  };

  const statusLabel: Record<string, string> = {
    pending: "Pendiente",
    confirmed: "Confirmada",
    cancelled: "Cancelada",
    completed: "Completada",
  };

  return (
    <div className="space-y-8">
      {/* Header del Dashboard */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 ${
          isDark ? "border-[#240d26]" : "border-[#eedbe8]"
        }`}
      >
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9487d]/10 border border-[#d9487d]/20 text-[11px] font-semibold tracking-wider uppercase text-[#d9487d] mb-2">
            <Sparkles className="size-3 text-[#d9487d]" />
            <span>Resumen Ejecutivo</span>
          </div>
          <h1
            className={`text-2xl sm:text-3xl font-display italic font-light tracking-tight ${
              isDark ? "text-white" : "text-[#1e0a1d]"
            }`}
          >
            Panel de Control
          </h1>
          <p className={`text-xs mt-1 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
            Métricas clave de atención, ocupación del salón y servicios exclusivos.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/servicios"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] text-xs font-semibold text-white shadow-lg shadow-[#d9487d]/20 hover:shadow-xl hover:shadow-[#d9487d]/30 transition-all cursor-pointer"
          >
            <span>Gestionar Servicios</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Grid Simétrico de Tarjetas de Estadísticas */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonCard key={i} isDark={isDark} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {cards.map((c) => (
            <div
              key={c.label}
              className={`rounded-3xl border p-6 transition-all duration-300 hover:border-[#d9487d]/40 hover:-translate-y-1 group ${
                isDark
                  ? "border-[#240d26] bg-[#120614]/90 shadow-xl"
                  : "border-[#eedbe8] bg-white shadow-sm"
              }`}
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#a88ea4]" : "text-[#765a71]"
                  }`}
                >
                  {c.label}
                </span>
                <div className={`flex size-9 items-center justify-center rounded-xl ${c.accent}`}>
                  <c.icon className="size-4" />
                </div>
              </div>
              <p
                className={`mt-3 text-3xl sm:text-4xl font-display font-light tracking-tight ${
                  isDark ? "text-white" : "text-[#1e0a1d]"
                }`}
              >
                {c.value}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Citas Recientes */}
      <div
        className={`rounded-3xl border overflow-hidden ${
          isDark
            ? "border-[#240d26] bg-[#120614]/90 shadow-xl"
            : "border-[#eedbe8] bg-white shadow-sm"
        }`}
      >
        <div
          className={`flex items-center justify-between border-b px-6 py-5 ${
            isDark ? "border-[#240d26]" : "border-[#eedbe8]"
          }`}
        >
          <div>
            <h2
              className={`text-base font-semibold ${
                isDark ? "text-white" : "text-[#1e0a1d]"
              }`}
            >
              Citas Recientes
            </h2>
            <p className={`text-xs mt-0.5 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
              Últimas reservaciones recibidas desde el portal
            </p>
          </div>
          <Link
            to="/admin/citas"
            className="text-xs font-semibold text-[#d9487d] hover:text-[#f49bbd] inline-flex items-center gap-1 transition-colors"
          >
            <span>Ver todas las citas</span>
            <MdArrowForward className="size-3.5" />
          </Link>
        </div>

        {recent.length === 0 ? (
          <div className="p-12 text-center">
            <div
              className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl ${
                isDark ? "bg-[#1e0a20] text-[#d9487d]" : "bg-[#fcf3f7] text-[#bf366a]"
              }`}
            >
              <MdEventNote className="size-6" />
            </div>
            <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
              No hay citas registradas
            </p>
            <p className={`text-xs mt-1 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
              Las nuevas citas reservadas aparecerán automáticamente aquí.
            </p>
          </div>
        ) : (
          <div
            className={`divide-y ${isDark ? "divide-[#200b22]" : "divide-[#f2e6ee]"}`}
          >
            {recent.map((a: any) => (
              <div
                key={a.id}
                className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 transition-colors ${
                  isDark ? "hover:bg-[#18091b]/50" : "hover:bg-[#fbf5f8]"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-[#2a0e28] to-[#3b1538] text-xs font-bold text-[#f49bbd] border border-[#d9487d]/20 shrink-0">
                    {(a.clientName || a.customerName || a.user?.name || "C")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                  <div>
                    <p
                      className={`text-sm font-semibold ${
                        isDark ? "text-white" : "text-[#1e0a1d]"
                      }`}
                    >
                      {a.clientName || a.customerName || a.user?.name || `Cliente #${a.id}`}
                    </p>
                    <p className={`text-xs ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                      {a.service?.name || `Tratamiento #${a.serviceId}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-semibold tracking-wider uppercase border ${
                      statusStyle[a.status] || "bg-gray-800 text-gray-300 border-gray-700"
                    }`}
                  >
                    {statusLabel[a.status] || a.status}
                  </span>

                  <div className="text-right">
                    <p
                      className={`text-xs font-mono font-medium ${
                        isDark ? "text-white" : "text-[#1e0a1d]"
                      }`}
                    >
                      {a.appointmentDate ||
                        new Date(a.date).toLocaleDateString("es-VE", {
                          day: "numeric",
                          month: "short",
                        })}
                    </p>
                    <p
                      className={`text-[11px] font-mono ${
                        isDark ? "text-[#8c6e88]" : "text-[#977391]"
                      }`}
                    >
                      {a.appointmentTime ||
                        new Date(a.date).toLocaleTimeString("es-VE", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
