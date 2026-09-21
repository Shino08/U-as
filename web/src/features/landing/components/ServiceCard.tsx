import { Star } from "lucide-react";
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
        "shrink-0 w-[220px] sm:w-[253px] snap-start rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
        isSelected
          ? "border-[#d9487d] ring-2 ring-[#d9487d]/20"
          : isDark
          ? "border-[#2b1328] bg-[#130815]"
          : "border-[#ebdce7] bg-white"
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-current/5">
        <img
          src={service.image}
          alt={service.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-[#f29ebb] border border-white/10">
          {service.category}
        </span>
        {service.tag && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-[#d9487d] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
            {service.tag}
          </span>
        )}
      </div>

      <div className="p-4 space-y-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-base font-normal leading-snug truncate">
            {service.name}
          </h3>
          <span className="shrink-0 inline-flex items-center gap-1 text-xs font-semibold">
            <Star className="size-3 fill-[#d9487d] text-[#d9487d]" />
            {service.duration} min
          </span>
        </div>
        <p className={cn("text-xs leading-relaxed line-clamp-2", isDark ? "text-[#a890a5]" : "text-[#695365]")}>
          {service.description}
        </p>
      </div>

      <div className={cn("px-4 py-3 flex items-center justify-between border-t", isDark ? "border-[#261025]" : "border-[#ebdce7]")}>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold font-display text-[#d9487d]">
            ${service.price}
          </span>
          <span className="text-[10px] text-current/60 uppercase tracking-wider">
            inversión
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelect(service.id)}
          className={cn(
            "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
            isSelected
              ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
              : isDark
              ? "bg-[#220d21] text-white hover:bg-[#d9487d]"
              : "bg-[#fcedf5] text-[#b33261] hover:bg-[#d9487d] hover:text-white"
          )}
        >
          {isSelected ? "Seleccionado" : "Agendar"}
        </button>
      </div>
    </article>
  );
}

export default ServiceCard;
