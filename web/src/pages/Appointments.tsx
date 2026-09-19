import { useEffect, useState } from "react";
import api from "@/api/client";
import { useTheme } from "@/context/ThemeContext";
import {
  MdEvent,
  MdSearch,
  MdFilterList,
  MdCheckCircle,
  MdCancel,
  MdAccessTime,
  MdAttachMoney,
  MdPhone,
  MdEmail,
  MdExpandMore,
  MdExpandLess,
  MdChevronLeft,
  MdChevronRight,
  MdCalendarToday,
  MdViewList,
} from "react-icons/md";
import { Sparkles } from "lucide-react";
import { ConfirmModal } from "@/components/ConfirmModal";

interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
}

interface Appointment {
  id: number;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  date: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  paid: boolean;
  notes: string;
  totalPrice: number;
  service?: Service;
}

const ITEMS_PER_PAGE = 8;

const STATUS_CONFIG = {
  pending: {
    label: "Pendiente",
    color: "bg-amber-500/15 text-amber-600 border-amber-500/20",
    dot: "bg-amber-500",
    icon: MdAccessTime,
  },
  confirmed: {
    label: "Confirmada",
    color: "bg-emerald-500/15 text-emerald-600 border-emerald-500/20",
    dot: "bg-emerald-500",
    icon: MdCheckCircle,
  },
  completed: {
    label: "Completada",
    color: "bg-sky-500/15 text-sky-600 border-sky-500/20",
    dot: "bg-sky-500",
    icon: MdCheckCircle,
  },
  cancelled: {
    label: "Cancelada",
    color: "bg-rose-500/15 text-rose-600 border-rose-500/20",
    dot: "bg-rose-500",
    icon: MdCancel,
  },
};

const WEEKDAYS = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

export default function Appointments() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");

  // Calendar state
  const today = new Date();
  const [calendarYear, setCalendarYear] = useState(today.getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(
    today.toISOString().split("T")[0]
  );

  // Confirm modal
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    type?: "danger" | "warning" | "info";
    onConfirm?: () => void;
  }>({ isOpen: false, title: "", description: "" });

  const showAlert = (title: string, description: string) => {
    setConfirmModal({ isOpen: true, title, description, type: "warning", onConfirm: undefined });
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      const data = await api.get("/appointments");
      setAppointments(Array.isArray(data) ? data : []);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.put(`/appointments/${id}`, { status: newStatus });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, status: newStatus as Appointment["status"] } : a))
      );
    } catch {
      showAlert("Error", "No se pudo actualizar el estado.");
    }
  };

  const handlePaidToggle = async (id: number, currentPaid: boolean) => {
    try {
      await api.put(`/appointments/${id}`, { paid: !currentPaid });
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, paid: !currentPaid } : a))
      );
    } catch {
      showAlert("Error", "No se pudo actualizar el estado de pago.");
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("es-CL", { day: "2-digit", month: "short", year: "numeric" });
  };

  const formatTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" });
  };

  const getDateKey = (dateStr: string) => dateStr?.split("T")[0] ?? "";

  // Appointments grouped by date for calendar dots
  const apptByDate = appointments.reduce<Record<string, Appointment[]>>((acc, a) => {
    const key = getDateKey(a.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(a);
    return acc;
  }, {});

  // Appointments for selected day
  const dayAppointments = (apptByDate[selectedDate] || []).filter((a) => {
    const matchSearch =
      a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.service?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // All filtered for list view
  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.clientEmail?.toLowerCase().includes(search.toLowerCase()) ||
      a.service?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  useEffect(() => { setPage(1); }, [search, statusFilter]);

  // Calendar helpers
  const prevMonth = () => {
    if (calendarMonth === 0) { setCalendarMonth(11); setCalendarYear((y) => y - 1); }
    else setCalendarMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (calendarMonth === 11) { setCalendarMonth(0); setCalendarYear((y) => y + 1); }
    else setCalendarMonth((m) => m + 1);
  };

  const buildCalendarDays = () => {
    const firstDay = new Date(calendarYear, calendarMonth, 1).getDay();
    const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
    const cells: (number | null)[] = Array(firstDay).fill(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  };

  const calendarDays = buildCalendarDays();
  const todayKey = today.toISOString().split("T")[0];

  const getCellKey = (day: number) =>
    `${calendarYear}-${String(calendarMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`h-20 rounded-2xl border animate-pulse ${isDark ? "border-[#240d26] bg-[#120614]" : "border-[#eedbe8] bg-white"}`} />
        ))}
      </div>
    );
  }

  const cardBase = isDark
    ? "border-[#240d26] bg-[#120614]/80"
    : "border-[#eedbe8] bg-white shadow-sm";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9487d]/10 border border-[#d9487d]/20 text-[11px] font-semibold tracking-wider uppercase text-[#d9487d] mb-2">
            <Sparkles className="size-3" />
            <span>Agenda del Estudio</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-display italic font-light tracking-tight ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
            Citas & Reservas
          </h1>
        </div>

        {/* View toggle */}
        <div className={`flex border rounded-xl p-1 shrink-0 self-start sm:self-auto ${isDark ? "border-[#2c122e] bg-[#140716]" : "border-[#eedbe8] bg-white shadow-xs"}`}>
          <button
            onClick={() => setViewMode("calendar")}
            title="Vista Calendario"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${viewMode === "calendar" ? "bg-[#d9487d]/20 text-[#d9487d]" : isDark ? "text-[#8c6e88] hover:text-white" : "text-[#8d6f88] hover:text-[#1e0a1d]"}`}
          >
            <MdCalendarToday className="size-4" />
            <span className="hidden sm:inline">Calendario</span>
          </button>
          <button
            onClick={() => setViewMode("list")}
            title="Vista Lista"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${viewMode === "list" ? "bg-[#d9487d]/20 text-[#d9487d]" : isDark ? "text-[#8c6e88] hover:text-white" : "text-[#8d6f88] hover:text-[#1e0a1d]"}`}
          >
            <MdViewList className="size-4" />
            <span className="hidden sm:inline">Lista</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(["pending", "confirmed", "completed", "cancelled"] as const).map((status) => {
          const count = appointments.filter((a) => a.status === status).length;
          const cfg = STATUS_CONFIG[status];
          const Icon = cfg.icon;
          return (
            <div key={status} className={`p-3 sm:p-4 rounded-2xl border ${cardBase}`}>
              <div className="flex items-center gap-2">
                <span className={`size-2 rounded-full ${cfg.dot}`} />
                <span className={`text-[11px] font-medium truncate ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>{cfg.label}</span>
              </div>
              <p className={`text-2xl sm:text-3xl font-bold mt-1.5 ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>{count}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className={`flex flex-col sm:flex-row gap-3 p-4 rounded-2xl border ${cardBase}`}>
        <div className="flex-1 relative">
          <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#8c6e88]" />
          <input
            type="text"
            placeholder="Buscar por nombre o servicio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`h-10 w-full rounded-xl border pl-9 pr-3 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-1 focus:ring-[#d9487d]/30 ${isDark ? "border-[#240d26] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#eedbe8] bg-[#fbf7f9] text-[#1e0a1d] placeholder:text-[#9e8398]"}`}
          />
        </div>
        <div className="flex items-center gap-2">
          <MdFilterList className="size-4 text-[#8c6e88] shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={`h-10 w-full sm:w-auto rounded-xl border px-3 text-xs transition-all focus:border-[#d9487d] focus:outline-none ${isDark ? "border-[#240d26] bg-[#1a081d] text-white" : "border-[#eedbe8] bg-[#fbf7f9] text-[#1e0a1d]"}`}
          >
            <option value="all">Todos</option>
            <option value="pending">Pendientes</option>
            <option value="confirmed">Confirmadas</option>
            <option value="completed">Completadas</option>
            <option value="cancelled">Canceladas</option>
          </select>
        </div>
      </div>

      {/* ─── CALENDAR VIEW ─── */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6">
          {/* Calendar grid */}
          <div className={`rounded-3xl border overflow-hidden ${cardBase}`}>
            {/* Month navigation */}
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-[#240d26]" : "border-[#eedbe8]"}`}>
              <button
                onClick={prevMonth}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${isDark ? "hover:bg-[#1f0a22] text-[#a88ea4] hover:text-white" : "hover:bg-[#f8eef5] text-[#765a71]"}`}
              >
                <MdChevronLeft className="size-5" />
              </button>
              <h2 className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                {MONTHS[calendarMonth]} {calendarYear}
              </h2>
              <button
                onClick={nextMonth}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${isDark ? "hover:bg-[#1f0a22] text-[#a88ea4] hover:text-white" : "hover:bg-[#f8eef5] text-[#765a71]"}`}
              >
                <MdChevronRight className="size-5" />
              </button>
            </div>

            {/* Weekday headers */}
            <div className="grid grid-cols-7 px-3 pt-3">
              {WEEKDAYS.map((d) => (
                <div key={d} className={`text-center text-[10px] font-bold uppercase tracking-wider pb-2 ${isDark ? "text-[#72546e]" : "text-[#977391]"}`}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-px px-3 pb-4">
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const key = getCellKey(day);
                const isToday = key === todayKey;
                const isSelected = key === selectedDate;
                const dayAppts = apptByDate[key] || [];
                const hasPending = dayAppts.some((a) => a.status === "pending");
                const hasConfirmed = dayAppts.some((a) => a.status === "confirmed");

                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(key)}
                    className={`relative flex flex-col items-center justify-start p-1 rounded-xl transition-all cursor-pointer min-h-[44px] sm:min-h-[52px] ${
                      isSelected
                        ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
                        : isToday
                        ? isDark
                          ? "bg-[#d9487d]/15 text-[#f49bbd] border border-[#d9487d]/30"
                          : "bg-[#fcf2f7] text-[#bf366a] border border-[#d9487d]/20"
                        : isDark
                        ? "text-[#d0b4cc] hover:bg-[#1f0a22]"
                        : "text-[#1e0a1d] hover:bg-[#fdf4f9]"
                    }`}
                  >
                    <span className="text-xs font-semibold">{day}</span>
                    {dayAppts.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                        {hasPending && (
                          <span className={`size-1.5 rounded-full ${isSelected ? "bg-white/80" : "bg-amber-500"}`} />
                        )}
                        {hasConfirmed && (
                          <span className={`size-1.5 rounded-full ${isSelected ? "bg-white/80" : "bg-emerald-500"}`} />
                        )}
                        {!hasPending && !hasConfirmed && (
                          <span className={`size-1.5 rounded-full ${isSelected ? "bg-white/60" : "bg-[#d9487d]/60"}`} />
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className={`flex items-center flex-wrap gap-4 px-5 py-3 border-t text-[11px] ${isDark ? "border-[#240d26] text-[#8c6e88]" : "border-[#eedbe8] text-[#977391]"}`}>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-500" />
                <span>Pendiente</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span>Confirmada</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#d9487d]/60" />
                <span>Otra</span>
              </div>
            </div>
          </div>

          {/* Day detail panel */}
          <div className={`rounded-3xl border min-w-0 lg:w-[340px] flex flex-col ${cardBase}`}>
            <div className={`flex items-center justify-between px-5 py-4 border-b ${isDark ? "border-[#240d26]" : "border-[#eedbe8]"}`}>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-wider ${isDark ? "text-[#8c6e88]" : "text-[#977391]"}`}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CL", { weekday: "long" })}
                </p>
                <h3 className={`text-lg font-display italic font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                  {new Date(selectedDate + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long" })}
                </h3>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-mono font-semibold ${isDark ? "bg-[#d9487d]/15 text-[#f49bbd]" : "bg-[#d9487d]/10 text-[#bf366a]"}`}>
                {dayAppointments.length} citas
              </span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {dayAppointments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center px-6">
                  <MdEvent className={`size-8 mb-2 ${isDark ? "text-[#3d1a40]" : "text-[#ddb8d0]"}`} />
                  <p className={`text-xs ${isDark ? "text-[#8c6e88]" : "text-[#977391]"}`}>
                    Sin citas para este día
                  </p>
                </div>
              ) : (
                <div className={`divide-y ${isDark ? "divide-[#200b22]" : "divide-[#f2e6ee]"}`}>
                  {dayAppointments.map((apt) => {
                    const cfg = STATUS_CONFIG[apt.status];
                    return (
                      <div key={apt.id} className="p-4 space-y-2.5">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                              {apt.clientName}
                            </p>
                            <p className={`text-[11px] truncate ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                              {apt.service?.name || "—"}
                            </p>
                          </div>
                          <div className="text-right shrink-0">
                            <p className={`text-xs font-bold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                              {formatTime(apt.date)}
                            </p>
                            <p className={`text-[11px] font-mono ${isDark ? "text-[#d9487d]" : "text-[#bf366a]"}`}>
                              ${apt.totalPrice}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <select
                            value={apt.status}
                            onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                            className={`text-[11px] font-semibold px-2 py-1 rounded-lg border cursor-pointer focus:outline-none flex-1 min-w-0 ${cfg.color}`}
                          >
                            <option value="pending">Pendiente</option>
                            <option value="confirmed">Confirmada</option>
                            <option value="completed">Completada</option>
                            <option value="cancelled">Cancelada</option>
                          </select>
                          <button
                            onClick={() => handlePaidToggle(apt.id, apt.paid)}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all shrink-0 ${apt.paid ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : "bg-amber-500/15 text-amber-600 border-amber-500/20"}`}
                          >
                            <MdAttachMoney className="size-3" />
                            {apt.paid ? "Pagado" : "Pendiente"}
                          </button>
                        </div>
                        {apt.clientEmail && (
                          <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? "text-[#8c6e88]" : "text-[#977391]"}`}>
                            <MdEmail className="size-3.5 shrink-0" />
                            <span className="truncate">{apt.clientEmail}</span>
                          </div>
                        )}
                        {apt.clientPhone && (
                          <div className={`flex items-center gap-1.5 text-[11px] ${isDark ? "text-[#8c6e88]" : "text-[#977391]"}`}>
                            <MdPhone className="size-3.5 shrink-0" />
                            <span>{apt.clientPhone}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ─── LIST VIEW ─── */}
      {viewMode === "list" && (
        <>
          {filtered.length === 0 ? (
            <div className={`text-center py-16 rounded-2xl border ${cardBase}`}>
              <MdEvent className="size-10 mx-auto text-[#d9487d] mb-3" />
              <p className={`text-sm font-medium ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>No hay citas</p>
              <p className="text-xs text-[#8c6e88] mt-1">Las reservas aparecerán aquí cuando los clientes agenden</p>
            </div>
          ) : (
            <div className={`rounded-2xl border overflow-hidden ${cardBase}`}>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[640px]">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-[#240d26] bg-[#0f0410]" : "border-[#f1e1ed] bg-[#fdfafc]"}`}>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88]">Cliente</th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88]">Servicio</th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88]">Fecha</th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88]">Estado</th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88]">Pago</th>
                      <th className="px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#8c6e88] text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? "divide-[#1a081d]" : "divide-[#f7eef4]"}`}>
                    {paginated.map((apt) => {
                      const cfg = STATUS_CONFIG[apt.status];
                      return (
                        <tr key={apt.id} className={`transition-colors ${isDark ? "hover:bg-[#18091b]/50" : "hover:bg-[#fdfafc]"}`}>
                          <td className="px-4 py-3">
                            <p className={`text-xs font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>{apt.clientName}</p>
                            <p className="text-[11px] text-[#8c6e88]">{apt.clientEmail}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`text-xs ${isDark ? "text-[#d0b4cc]" : "text-[#765a71]"}`}>{apt.service?.name || "—"}</span>
                          </td>
                          <td className="px-4 py-3">
                            <p className={`text-xs ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>{formatDate(apt.date)}</p>
                            <p className="text-[11px] text-[#8c6e88]">{formatTime(apt.date)}</p>
                          </td>
                          <td className="px-4 py-3">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer focus:outline-none ${cfg.color}`}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmada</option>
                              <option value="completed">Completada</option>
                              <option value="cancelled">Cancelada</option>
                            </select>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => handlePaidToggle(apt.id, apt.paid)}
                              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer transition-all ${apt.paid ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : "bg-amber-500/15 text-amber-600 border-amber-500/20"}`}
                            >
                              <MdAttachMoney className="size-3" />
                              {apt.paid ? "Pagado" : "Pendiente"}
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className={`text-xs font-bold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>${apt.totalPrice}</span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Mobile accordion */}
              <div className={`md:hidden divide-y ${isDark ? "divide-[#200b22]" : "divide-[#f2e6ee]"}`}>
                {paginated.map((apt) => {
                  const cfg = STATUS_CONFIG[apt.status];
                  const isOpen = expandedId === apt.id;
                  return (
                    <div key={apt.id}>
                      <button
                        onClick={() => setExpandedId(isOpen ? null : apt.id)}
                        className={`w-full flex items-center justify-between px-4 py-3.5 text-left ${isDark ? "hover:bg-[#18091b]/50" : "hover:bg-[#fdfafc]"}`}
                      >
                        <div className="min-w-0 flex-1">
                          <p className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>{apt.clientName}</p>
                          <p className="text-[11px] text-[#8c6e88] truncate">{apt.service?.name} · {formatDate(apt.date)}</p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${cfg.color}`}>{cfg.label}</span>
                          {isOpen ? <MdExpandLess className="size-4 text-[#8c6e88]" /> : <MdExpandMore className="size-4 text-[#8c6e88]" />}
                        </div>
                      </button>
                      {isOpen && (
                        <div className={`px-4 pb-4 space-y-2.5 text-xs ${isDark ? "text-[#d0b4cc]" : "text-[#765a71]"}`}>
                          {apt.clientEmail && (
                            <div className="flex items-center gap-2"><MdEmail className="size-3.5 text-[#8c6e88] shrink-0" /><span className="truncate">{apt.clientEmail}</span></div>
                          )}
                          {apt.clientPhone && (
                            <div className="flex items-center gap-2"><MdPhone className="size-3.5 text-[#8c6e88] shrink-0" />{apt.clientPhone}</div>
                          )}
                          <div className="flex items-center gap-2 flex-wrap pt-1">
                            <select
                              value={apt.status}
                              onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer focus:outline-none flex-1 ${cfg.color}`}
                            >
                              <option value="pending">Pendiente</option>
                              <option value="confirmed">Confirmada</option>
                              <option value="completed">Completada</option>
                              <option value="cancelled">Cancelada</option>
                            </select>
                            <button
                              onClick={() => handlePaidToggle(apt.id, apt.paid)}
                              className={`text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border cursor-pointer flex items-center gap-1 ${apt.paid ? "bg-emerald-500/15 text-emerald-600 border-emerald-500/20" : "bg-amber-500/15 text-amber-600 border-amber-500/20"}`}
                            >
                              <MdAttachMoney className="size-3.5" />
                              {apt.paid ? "Pagado" : "Pendiente"}
                            </button>
                          </div>
                          <p className={`font-bold pt-1 ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>Total: ${apt.totalPrice}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className={`text-xs ${isDark ? "text-[#8c6e88]" : "text-[#765a71]"}`}>
                Mostrando {(page - 1) * ITEMS_PER_PAGE + 1}–{Math.min(page * ITEMS_PER_PAGE, filtered.length)} de {filtered.length}
              </p>
              <div className="flex flex-wrap gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26] hover:bg-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8] hover:bg-[#fdfafc]"}`}
                >
                  Anterior
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${p === page ? "bg-[#d9487d] text-white" : isDark ? "bg-[#1a081d] text-white border border-[#240d26] hover:bg-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8] hover:bg-[#fdfafc]"}`}
                  >
                    {p}
                  </button>
                ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26] hover:bg-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8] hover:bg-[#fdfafc]"}`}
                >
                  Siguiente
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        description={confirmModal.description}
        type={confirmModal.type}
        onConfirm={confirmModal.onConfirm}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
}
