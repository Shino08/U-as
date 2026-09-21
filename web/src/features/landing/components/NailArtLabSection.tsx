import { Check, X } from "lucide-react";
import classicImage from "@/assets/service-classic.jpg";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { Service, LookbookItem } from "../types";
import { ADDONS } from "../constants";

interface NailArtLabSectionProps {
  selectedService: Service | undefined;
  selectedLookbook: LookbookItem | null;
  onClearLookbook: () => void;
  selectedAddons: string[];
  onToggleAddon: (id: string) => void;
  calculatedTotal: number;
  calculatedDuration: number;
}

export function NailArtLabSection({
  selectedService,
  selectedLookbook,
  onClearLookbook,
  selectedAddons,
  onToggleAddon,
  calculatedTotal,
  calculatedDuration,
}: NailArtLabSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="personalizar" className="py-14 sm:py-20 lg:py-24 w-full px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div
          className={cn(
            "rounded-3xl border p-5 sm:p-8 lg:p-12 shadow-2xl relative overflow-hidden transition-colors",
            isDark
              ? "bg-gradient-to-br from-[#160918] via-[#120614] to-[#1c0b1e] border-[#3b1738]"
              : "bg-gradient-to-br from-[#ffffff] via-[#faf4f8] to-[#fceef5] border-[#ebdce7]"
          )}
        >
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
            <div className="space-y-5">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
                Calculadora Interactiva
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light">
                Personaliza tu Cita a Medida
              </h2>
              <p className={cn("text-sm leading-relaxed", isDark ? "text-[#b8a1b5]" : "text-[#695365]")}>
                Selecciona complementos adicionales y obtén al instante el precio exacto y tiempo estimado antes de confirmar tu reserva.
              </p>

              <div className="space-y-3">
                <div className={cn("p-4 rounded-2xl border flex items-center justify-between gap-3 sm:gap-4 transition-all", isDark ? "bg-[#0a050c] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm")}>
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={selectedService?.image || classicImage} alt="" className="size-12 rounded-xl object-cover shrink-0 border border-current/10" />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] uppercase font-bold text-[#d9487d] block">Servicio Base</span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-current/10 text-current/70 uppercase">{selectedService?.category}</span>
                      </div>
                      <span className="font-semibold text-sm truncate block leading-tight mt-0.5">{selectedService?.name || "Selecciona un servicio"}</span>
                      <span className="text-[11px] text-current/60 font-mono">{selectedService?.duration ?? 45} min</span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-[#d9487d] shrink-0">${selectedService?.price ?? 0}</span>
                </div>

                {selectedLookbook && (
                  <div className={cn("p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in duration-200", isDark ? "bg-[#180a1a] border-[#3b1738]" : "bg-[#fcf5f9] border-[#e9d5e3]")}>
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={selectedLookbook.image} alt="" className="size-11 rounded-xl object-cover shrink-0 border border-current/10" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-[#d9487d] block">Inspiración Lookbook</span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-current/70">{selectedLookbook.category}</span>
                        </div>
                        <p className="font-semibold text-xs truncate leading-tight mt-0.5">{selectedLookbook.title}</p>
                        <p className="text-[10px] text-current/60 truncate">{selectedLookbook.technique}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#d9487d] block">Est. ${selectedLookbook.estimatedPrice}</span>
                        <span className="text-[9px] text-current/60">{selectedLookbook.durationBonus}</span>
                      </div>
                      <button type="button" onClick={onClearLookbook} className="p-1 rounded-lg text-current/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center" title="Quitar diseño">
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d9487d] block mb-2">
                Agrega Complementos a tu Sesión:
              </label>

              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => onToggleAddon(addon.id)}
                      className={cn(
                        "w-full p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer min-h-[52px]",
                        isChecked
                          ? isDark ? "bg-[#250d23] border-[#d9487d] text-white shadow-md" : "bg-[#fcedf5] border-[#d9487d] text-[#1d0f1c] shadow-sm"
                          : isDark ? "bg-[#0f0612] border-[#261125] text-[#a890a5] hover:border-[#421b3e]" : "bg-white border-[#ebdce7] text-[#695365] hover:border-[#d9487d]"
                      )}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("size-5 rounded-md border flex items-center justify-center transition-colors shrink-0", isChecked ? "bg-[#d9487d] border-[#d9487d] text-white" : "border-current/30 bg-transparent")}>
                          {isChecked && <Check className="size-3.5" />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold truncate sm:whitespace-normal">{addon.name}</p>
                          <p className="text-[11px] text-current/60 line-clamp-1 sm:line-clamp-none">{addon.description}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#d9487d] block">+${addon.price}</span>
                        <span className="text-[10px] text-current/60">+{addon.duration} min</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className={cn("pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t", isDark ? "border-[#2a1327]" : "border-[#ebdce7]")}>
                <div>
                  <span className="text-xs text-current/60 block">Total Estimado:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${calculatedTotal}</span>
                    <span className="text-xs text-[#d9487d] font-mono">({calculatedDuration} min)</span>
                  </div>
                </div>
                <a
                  href="#reserva"
                  className="w-full sm:w-auto text-center px-6 py-3 sm:py-2.5 rounded-full bg-[#d9487d] hover:bg-[#e8709a] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all min-h-[44px] flex items-center justify-center"
                >
                  Continuar a la Cita →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
