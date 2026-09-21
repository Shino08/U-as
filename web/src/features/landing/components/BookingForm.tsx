import type { FormEvent } from "react";
import { AlertCircle } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { LandingDate, TimeSlot } from "../types";

interface BookingFormProps {
  availableDates: LandingDate[]; selectedDate: string; onSelectDate: (d: string) => void;
  timeSlots: TimeSlot[]; selectedTime: string; onSelectTime: (t: string) => void;
  name: string; onChangeName: (v: string) => void;
  email: string; onChangeEmail: (v: string) => void;
  phone: string; onChangePhone: (v: string) => void;
  notes: string; onChangeNotes: (v: string) => void;
  calculatedTotal: number; rateLimitError: string | null; isSubmitting: boolean;
  onSubmit: (e: FormEvent) => void;
}

export function BookingForm({
  availableDates, selectedDate, onSelectDate, timeSlots, selectedTime, onSelectTime,
  name, onChangeName, email, onChangeEmail, phone, onChangePhone, notes, onChangeNotes,
  calculatedTotal, rateLimitError, isSubmitting, onSubmit,
}: BookingFormProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const inputBg = isDark
    ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
    : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400";

  return (
    <div className="space-y-6">
      <div className={cn("p-5 sm:p-7 rounded-3xl border space-y-5", isDark ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm")}>
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">2. Fecha de la Cita</label>
          <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full">
            {availableDates.map((d) => (
              <button
                key={d.fullDate}
                type="button"
                onClick={() => onSelectDate(d.fullDate)}
                className={cn(
                  "py-2 sm:py-2.5 px-1 rounded-xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all",
                  selectedDate === d.fullDate
                    ? "bg-[#d9487d] border-[#d9487d] text-white shadow-lg scale-[1.03] font-bold"
                    : isDark ? "bg-[#0a050c] border-[#261025] text-[#a890a5] hover:border-[#421b3e]" : "bg-[#faf4f8] border-[#ebdce7] text-[#695365] hover:border-[#d9487d]"
                )}
              >
                <span className="text-[9px] uppercase font-bold tracking-tight truncate w-full text-center">{d.label}</span>
                <span className="font-display text-xs sm:text-base font-bold">{d.dateNumber}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">3. Franja Horaria</label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full">
            {timeSlots.map((slot) => {
              if (!slot.available) {
                return (
                  <div key={slot.time} className="py-2 px-1 rounded-xl border border-current/10 text-current/30 text-xs font-mono text-center line-through cursor-not-allowed">
                    {slot.time}
                  </div>
                );
              }
              const isSelected = selectedTime === slot.time;
              return (
                <button
                  key={slot.time}
                  type="button"
                  onClick={() => onSelectTime(slot.time)}
                  className={cn(
                    "py-2 px-1 rounded-xl border text-xs font-mono font-semibold transition-all text-center cursor-pointer",
                    isSelected
                      ? "bg-[#d9487d] border-[#d9487d] text-white shadow-md scale-[1.02]"
                      : isDark ? "bg-[#0a050c] border-[#261025] text-white hover:border-[#d9487d]" : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] hover:border-[#d9487d]"
                  )}
                >
                  {slot.time}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className={cn("p-5 sm:p-7 rounded-3xl border", isDark ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm")}>
        <h3 className="font-display text-2xl font-light mb-5">Datos de Reserva</h3>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-current/70 block mb-1">Nombre Completo *</label>
            <input type="text" required placeholder="Valentina Rivas" value={name} onChange={(e) => onChangeName(e.target.value)} className={cn("w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]", inputBg)} />
          </div>
          <div>
            <label className="text-xs font-medium text-current/70 block mb-1">Correo Electrónico *</label>
            <input type="email" required placeholder="tu@correo.com" value={email} onChange={(e) => onChangeEmail(e.target.value)} className={cn("w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]", inputBg)} />
          </div>
          <div>
            <label className="text-xs font-medium text-current/70 block mb-1">Teléfono / WhatsApp *</label>
            <input type="tel" required placeholder="+58 412 000 0000" value={phone} onChange={(e) => onChangePhone(e.target.value)} className={cn("w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]", inputBg)} />
          </div>
          <div>
            <label className="text-xs font-medium text-current/70 block mb-1">Notas especiales</label>
            <textarea rows={2} placeholder="¿Tienes retiro anterior o diseño específico?" value={notes} onChange={(e) => onChangeNotes(e.target.value)} className={cn("w-full px-4 py-2.5 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d] resize-none", inputBg)} />
          </div>

          <div className={cn("p-3 rounded-xl border text-xs space-y-1", isDark ? "bg-[#0a050c] border-[#261025]" : "bg-[#faf4f8] border-[#ebdce7]")}>
            <div className="flex justify-between text-current/70"><span>Día &amp; Hora:</span><span className="font-semibold">{selectedDate} · {selectedTime}</span></div>
            <div className="flex justify-between text-sm font-bold pt-1 border-t border-current/10"><span>Total:</span><span className="text-[#d9487d]">${calculatedTotal}</span></div>
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
            className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#d9487d] to-[#f29ebb] text-white font-bold text-sm uppercase tracking-wider shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Apartando tu lugar..." : `Confirmar Cita · $${calculatedTotal}`}
          </button>
          <p className="text-[10px] text-current/50 text-center">Pagas cómodamente en el estudio al terminar tu sesión.</p>
        </form>
      </div>
    </div>
  );
}
