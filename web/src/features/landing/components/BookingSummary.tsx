import { Sparkles, X } from "lucide-react";
import classicImage from "@/assets/service-classic.jpg";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { Service, LookbookItem } from "../types";
import { ADDONS } from "../constants";

interface BookingSummaryProps {
  selectedService: Service | undefined;
  selectedLookbook: LookbookItem | null;
  onClearLookbook: () => void;
  selectedAddons: string[];
  onToggleAddon: (id: string) => void;
  calculatedTotal: number;
  calculatedDuration: number;
}

export function BookingSummary({
  selectedService,
  selectedLookbook,
  onClearLookbook,
  selectedAddons,
  onToggleAddon,
  calculatedTotal,
  calculatedDuration,
}: BookingSummaryProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className={cn("space-y-6 p-5 sm:p-7 rounded-3xl border", isDark ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7] shadow-sm")}>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] flex items-center gap-1.5">
          <Sparkles className="size-3.5 text-[#d9487d]" />
          <span>1. Resumen de tu Servicio</span>
        </label>
        <a href="#servicios" className="text-xs font-semibold text-[#d9487d] hover:underline">Cambiar servicio</a>
      </div>

      <div className={cn("p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5", isDark ? "bg-[#0a050c] border-[#261025]" : "bg-[#faf4f8] border-[#ebdce7]")}>
        <div className="flex items-center gap-4">
          <img src={selectedService?.image || classicImage} alt="" className="size-16 rounded-xl object-cover shrink-0 border border-current/10" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d9487d]/15 text-[#d9487d] border border-[#d9487d]/20">
                {selectedService?.category || "Manicura"}
              </span>
              {selectedService?.tag && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-current/10 text-current/70">
                  {selectedService.tag}
                </span>
              )}
            </div>
            <h4 className="font-display text-base sm:text-lg font-medium truncate mt-0.5">{selectedService?.name || "Selecciona un servicio"}</h4>
            <p className="text-xs text-current/60">
              {selectedService?.duration ?? 45} min · <strong className="text-[#d9487d] font-bold">${selectedService?.price ?? 0}</strong>
            </p>
          </div>
        </div>

        {selectedLookbook && (
          <div className={cn("p-3 rounded-xl border flex items-center justify-between gap-3", isDark ? "bg-[#180a1a] border-[#381635]" : "bg-white border-[#ebdce7]")}>
            <div className="flex items-center gap-3 min-w-0">
              <img src={selectedLookbook.image} alt="" className="size-12 rounded-lg object-cover shrink-0 border border-current/10" />
              <div className="min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9487d] block">Diseño Lookbook</span>
                <p className="text-xs font-semibold truncate leading-tight mt-0.5">{selectedLookbook.title} ({selectedLookbook.category})</p>
                <p className="text-[10px] text-current/60 truncate">{selectedLookbook.technique}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-right">
                <span className="text-xs font-bold text-[#d9487d] block">Est. ${selectedLookbook.estimatedPrice}</span>
                <span className="text-[10px] text-current/60 font-mono">{selectedLookbook.durationBonus}</span>
              </div>
              <button type="button" onClick={onClearLookbook} className="p-1 rounded-md text-current/40 hover:text-rose-400 hover:bg-rose-500/10 cursor-pointer" title="Quitar diseño">
                <X className="size-4" />
              </button>
            </div>
          </div>
        )}

        {selectedAddons.length > 0 && (
          <div className="pt-2 border-t border-current/10 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-current/70 text-[11px]">Complementos Adicionales ({selectedAddons.length}):</span>
              <a href="#personalizar" className="text-[11px] text-[#d9487d] hover:underline">+ Modificar extras</a>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedAddons.map((id) => {
                const add = ADDONS.find((a) => a.id === id);
                if (!add) return null;
                return (
                  <span key={id} className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border", isDark ? "bg-[#18091a] border-[#2b1229] text-white" : "bg-white border-[#ecdde8] text-[#1d0f1c]")}>
                    <span>{add.name}</span>
                    <span className="text-[#d9487d] font-bold">+${add.price}</span>
                    <button type="button" onClick={() => onToggleAddon(id)} className="text-current/40 hover:text-rose-400 cursor-pointer ml-0.5" title="Quitar">
                      <X className="size-3" />
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        )}

        <div className="pt-2.5 border-t border-current/10 flex items-center justify-between text-xs">
          <span className="text-current/60 font-medium">Tiempo e Inversión Total:</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-current/60 font-mono text-xs">{calculatedDuration} min ·</span>
            <span className="font-display text-base font-bold text-[#d9487d]">${calculatedTotal}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
