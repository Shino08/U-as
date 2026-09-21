import { CheckCircle2 } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface BookingSuccessProps {
  name: string; email: string; bookingCode: string; serviceName?: string;
  selectedDate: string; selectedTime: string; calculatedTotal: number; onReset: () => void;
}

export function BookingSuccess({
  name, email, bookingCode, serviceName, selectedDate, selectedTime, calculatedTotal, onReset,
}: BookingSuccessProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("max-w-lg mx-auto p-8 sm:p-10 rounded-3xl border text-center space-y-6 animate-in zoom-in-95", isDark ? "bg-[#140816] border-[#381635]" : "bg-white border-[#ebdce7] shadow-xl")}>
      <div className="size-16 rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#d9487d]/30">
        <CheckCircle2 className="size-8" />
      </div>
      <div className="space-y-1">
        <span className="text-xs font-bold uppercase tracking-widest text-[#d9487d]">¡Cita Reservada con Éxito!</span>
        <h3 className="font-display text-3xl font-light">Te esperamos, {name}</h3>
        <p className="text-xs text-current/70">Enviamos el comprobante a <strong className="font-bold">{email}</strong>.</p>
      </div>
      <div className={cn("p-4 rounded-2xl border text-left space-y-2.5 text-xs", isDark ? "bg-[#0a050c] border-[#261025]" : "bg-[#faf4f8] border-[#ebdce7]")}>
        <div className="flex justify-between text-current/70"><span>Localizador:</span><span className="font-mono font-bold text-[#d9487d]">{bookingCode}</span></div>
        <div className="flex justify-between text-current/70"><span>Servicio:</span><span className="font-semibold">{serviceName || "Tratamiento"}</span></div>
        <div className="flex justify-between text-current/70"><span>Fecha &amp; Hora:</span><span className="font-semibold text-[#d9487d]">{selectedDate} a las {selectedTime}</span></div>
        <div className="flex justify-between pt-2 border-t border-current/10"><span>Total estimado a pagar en estudio:</span><span className="font-bold text-sm">${calculatedTotal}</span></div>
      </div>
      <button type="button" onClick={onReset} className="px-8 py-3 rounded-full bg-[#d9487d] text-white hover:bg-[#e8709a] text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
        Agendar otra cita
      </button>
    </div>
  );
}
