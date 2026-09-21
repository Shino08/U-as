import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { Service } from "../types";
import { ServiceCard } from "./ServiceCard";

interface ServicesSectionProps {
  filteredServices: Service[];
  selectedServiceId: string;
  activeCategory: string;
  availableCategories: string[];
  sliderRef: React.RefObject<HTMLDivElement | null>;
  onSelectService: (id: string) => void;
  onCategoryChange: (category: string) => void;
  onScrollSlider: (direction: "left" | "right") => void;
}

export function ServicesSection({
  filteredServices,
  selectedServiceId,
  activeCategory,
  availableCategories,
  sliderRef,
  onSelectService,
  onCategoryChange,
  onScrollSlider,
}: ServicesSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <section id="servicios" className="relative py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-5 sm:px-8 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">Carta de Tratamientos</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light mt-2">Servicios Exclusivos</h2>
          <p className="text-xs sm:text-sm text-current/60 mt-1 max-w-md">
            Desliza para explorar nuestras técnicas de nivelación, arte de autor y extensiones arquitectónicas.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className={cn("flex flex-wrap gap-1.5 p-1.5 rounded-full border", isDark ? "bg-[#160918] border-[#2b1328]" : "bg-white border-[#ebdce7]")}>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => onCategoryChange(cat)}
                className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                  activeCategory === cat ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/25" : isDark ? "text-[#a890a5] hover:text-white" : "text-[#786175] hover:text-black"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onScrollSlider("left")}
              aria-label="Anterior servicio"
              className={cn("size-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95", isDark ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d]" : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d]")}
            >
              <ChevronLeft className="size-5 text-[#d9487d]" />
            </button>
            <button
              type="button"
              onClick={() => onScrollSlider("right")}
              aria-label="Siguiente servicio"
              className={cn("size-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95", isDark ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d]" : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d]")}
            >
              <ChevronRight className="size-5 text-[#d9487d]" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative group/slider">
        <button
          type="button"
          onClick={() => onScrollSlider("left")}
          aria-label="Deslizar a la izquierda"
          className={cn("hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/slider:opacity-100", isDark ? "bg-[#18091a]/90 border-[#381636] text-[#d9487d]" : "bg-white/95 border-[#ebdce7] text-[#d9487d]")}
        >
          <ChevronLeft className="size-6" />
        </button>

        <div
          ref={sliderRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory py-4 px-1"
        >
          {filteredServices.length === 0 ? (
            <div className="w-full rounded-3xl border border-current/10 p-12 text-center my-4">
              <p className="text-base font-semibold">No hay tratamientos registrados en esta categoría aún.</p>
              <p className="text-xs text-current/60 mt-1">Crea nuevos servicios desde el panel de administración.</p>
            </div>
          ) : (
            filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSelected={service.id === selectedServiceId}
                onSelect={onSelectService}
              />
            ))
          )}
        </div>

        <button
          type="button"
          onClick={() => onScrollSlider("right")}
          aria-label="Deslizar a la derecha"
          className={cn("hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/slider:opacity-100", isDark ? "bg-[#18091a]/90 border-[#381636] text-[#d9487d]" : "bg-white/95 border-[#ebdce7] text-[#d9487d]")}
        >
          <ChevronRight className="size-6" />
        </button>
      </div>
    </section>
  );
}
