import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { LandingDate, TimeSlot } from "../types";

interface BookingScheduleProps {
  availableDates: LandingDate[];
  selectedDate: string;
  onSelectDate: (d: string) => void;
  timeSlots: TimeSlot[];
  selectedTime: string;
  onSelectTime: (t: string) => void;
}

export function BookingSchedule({
  availableDates,
  selectedDate,
  onSelectDate,
  timeSlots,
  selectedTime,
  onSelectTime,
}: BookingScheduleProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={cn(
        "p-5 sm:p-7 rounded-3xl border space-y-5 transition-all",
        isDark ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm"
      )}
    >
      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">
          2. Fecha de la Cita
        </label>
        <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full">
          {availableDates.map((d) => (
            <button
              key={d.fullDate}
              type="button"
              onClick={() => onSelectDate(d.fullDate)}
              className={cn(
                "min-h-[48px] py-1.5 sm:py-2.5 px-0.5 sm:px-1 rounded-xl border text-center flex flex-col items-center justify-center cursor-pointer transition-all",
                selectedDate === d.fullDate
                  ? "bg-[#d9487d] border-[#d9487d] text-white shadow-lg scale-[1.03] font-bold"
                  : isDark
                  ? "bg-[#0a050c] border-[#261025] text-[#a890a5] hover:border-[#421b3e]"
                  : "bg-[#faf4f8] border-[#ebdce7] text-[#695365] hover:border-[#d9487d]"
              )}
            >
              <span className="text-[8px] sm:text-[9px] uppercase font-bold tracking-tight truncate w-full text-center">
                <span className="sm:hidden">{d.shortLabel}</span>
                <span className="hidden sm:inline">{d.label}</span>
              </span>
              <span className="font-display text-xs sm:text-base font-bold leading-tight">{d.dateNumber}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">
          3. Franja Horaria
        </label>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full">
          {timeSlots.map((slot) => {
            if (!slot.available) {
              return (
                <div
                  key={slot.time}
                  className="min-h-[42px] py-2 px-1 rounded-xl border border-current/10 text-current/30 text-xs font-mono text-center line-through cursor-not-allowed flex items-center justify-center"
                >
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
                  "min-h-[42px] py-2 px-1 rounded-xl border text-xs font-mono font-semibold transition-all text-center cursor-pointer flex items-center justify-center",
                  isSelected
                    ? "bg-[#d9487d] border-[#d9487d] text-white shadow-md scale-[1.02]"
                    : isDark
                    ? "bg-[#0a050c] border-[#261025] text-white hover:border-[#d9487d]"
                    : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] hover:border-[#d9487d]"
                )}
              >
                {slot.time}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
