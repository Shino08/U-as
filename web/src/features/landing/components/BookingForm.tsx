import type { FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

interface BookingFormProps {
  name: string;
  onChangeName: (v: string) => void;
  email: string;
  onChangeEmail: (v: string) => void;
  phone: string;
  onChangePhone: (v: string) => void;
  notes: string;
  onChangeNotes: (v: string) => void;
  selectedDate: string;
  selectedTime: string;
  calculatedTotal: number;
  rateLimitError: string | null;
  isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
}

export function BookingForm({
  name,
  onChangeName,
  email,
  onChangeEmail,
  phone,
  onChangePhone,
  notes,
  onChangeNotes,
  selectedDate,
  selectedTime,
  calculatedTotal,
  rateLimitError,
  isSubmitting,
  onSubmit,
}: BookingFormProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const inputBg = isDark
    ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
    : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400";

  return (
    <div
      className={cn(
        "p-5 sm:p-7 rounded-3xl border transition-all",
        isDark ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm"
      )}
    >
      <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-1">
        4. Datos de Contacto
      </label>
      <h3 className="font-display text-2xl font-light mb-5">Finaliza tu Reserva</h3>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-current/70 block mb-1">Nombre Completo *</label>
          <input
            type="text"
            required
            placeholder="Valentina Rivas"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            className={cn("w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm min-h-[44px] focus:outline-none focus:border-[#d9487d]", inputBg)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-current/70 block mb-1">Correo Electrónico *</label>
          <input
            type="email"
            required
            placeholder="tu@correo.com"
            value={email}
            onChange={(e) => onChangeEmail(e.target.value)}
            className={cn("w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm min-h-[44px] focus:outline-none focus:border-[#d9487d]", inputBg)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-current/70 block mb-1">Teléfono / WhatsApp *</label>
          <input
            type="tel"
            required
            placeholder="+58 412 000 0000"
            value={phone}
            onChange={(e) => onChangePhone(e.target.value)}
            className={cn("w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm min-h-[44px] focus:outline-none focus:border-[#d9487d]", inputBg)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-current/70 block mb-1">Notas especiales</label>
          <textarea
            rows={2}
            placeholder="¿Tienes retiro anterior o diseño específico?"
            value={notes}
            onChange={(e) => onChangeNotes(e.target.value)}
            className={cn("w-full px-4 py-3 sm:py-2.5 rounded-xl border text-base sm:text-sm focus:outline-none focus:border-[#d9487d] resize-none", inputBg)}
          />
        </div>

        <div className={cn("p-3 rounded-xl border text-xs space-y-1", isDark ? "bg-[#0a050c] border-[#261025]" : "bg-[#faf4f8] border-[#ebdce7]")}>
          <div className="flex justify-between text-current/70">
            <span>Día &amp; Hora:</span>
            <span className="font-semibold">{selectedDate} · {selectedTime}</span>
          </div>
          <div className="flex justify-between text-sm font-bold pt-1 border-t border-current/10">
            <span>Total:</span>
            <span className="text-[#d9487d]">${calculatedTotal}</span>
          </div>
        </div>

        {rateLimitError && (
          <div className="flex items-center gap-2 p-3 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs">
            <AlertCircle className="size-4 text-rose-400 shrink-0" />
            <span>{rateLimitError}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d9487d] to-[#f29ebb] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer min-h-[48px] flex items-center justify-center"
        >
          {isSubmitting ? "Apartando tu lugar..." : `Confirmar Cita · $${calculatedTotal}`}
        </button>
        <p className="text-[10px] text-current/50 text-center">Pagas cómodamente en el estudio al terminar tu sesión.</p>
      </form>
    </div>
  );
}
