import { Check } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { Service } from "../types";

interface ServiceCardProps {
  service: Service;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export function ServiceCard({ service, isSelected, onSelect }: ServiceCardProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <article
      className={cn(
        "w-[85vw] max-w-[340px] sm:w-[370px] shrink-0 snap-start rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
        isSelected
          ? "border-[#d9487d] ring-2 ring-[#d9487d]/20"
          : isDark ? "border-[#2b1328] bg-[#130815]" : "border-[#ebdce7] bg-white"
      )}
    >
      <div>
        <div className="relative h-60 overflow-hidden bg-gray-100">
          <img src={service.image} alt={service.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />
          <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-[#f29ebb] border border-white/10">
            {service.category}
          </span>
          {service.tag && (
            <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#d9487d] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
              {service.tag}
            </span>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h3 className="font-display text-2xl font-normal leading-tight">{service.name}</h3>
          <p className={cn("text-xs sm:text-sm leading-relaxed line-clamp-3", isDark ? "text-[#a890a5]" : "text-[#695365]")}>
            {service.description}
          </p>

          <ul className={cn("space-y-2 pt-2 border-t", isDark ? "border-[#261025]" : "border-[#ebdce7]")}>
            {service.features.map((f, i) => (
              <li key={i} className="flex items-center gap-2 text-xs">
                <Check className="size-3.5 text-[#d9487d] shrink-0" />
                <span className="truncate">{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={cn("p-6 pt-0 flex items-center justify-between border-t mt-4", isDark ? "border-[#261025]" : "border-[#ebdce7]")}>
        <div>
          <span className="text-[10px] text-current/60 uppercase tracking-wider block font-semibold">Inversión</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold font-display">${service.price}</span>
            <span className="text-xs text-current/60 font-mono">/ {service.duration} min</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onSelect(service.id)}
          className={cn(
            "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
            isSelected
              ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
              : isDark ? "bg-[#220d21] text-white hover:bg-[#d9487d]" : "bg-[#fcedf5] text-[#b33261] hover:bg-[#d9487d] hover:text-white"
          )}
        >
          {isSelected ? "Seleccionado ✓" : "Agendar"}
        </button>
      </div>
    </article>
  );
}
