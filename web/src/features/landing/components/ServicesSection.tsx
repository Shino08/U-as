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
      {/* Cabecera deals-head: título + flechas juntas alineadas a la derecha */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
        <div>
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
            Carta de Tratamientos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light mt-2">
            Servicios Exclusivos
          </h2>
          <p className={cn("text-sm mt-2 max-w-lg", isDark ? "text-[#a890a5]" : "text-[#695365]")}>
            Desliza para explorar nuestras técnicas de nivelación, arte de autor y extensiones arquitectónicas.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onScrollSlider("left")}
            aria-label="Anterior servicio"
            className={cn(
              "size-11 rounded-full border flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95",
              isDark
                ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d]"
                : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d]"
            )}
          >
            <ChevronLeft className="size-5 text-[#d9487d]" />
          </button>
          <button
            type="button"
            onClick={() => onScrollSlider("right")}
            aria-label="Siguiente servicio"
            className={cn(
              "size-11 rounded-full border flex items-center justify-center shadow-sm transition-all cursor-pointer hover:scale-105 active:scale-95",
              isDark
                ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d]"
                : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d]"
            )}
          >
            <ChevronRight className="size-5 text-[#d9487d]" />
          </button>
        </div>
      </div>

      {/* Pill-row: fila de categorías rápida debajo de la cabecera */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {availableCategories.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => onCategoryChange(cat)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer border",
              activeCategory === cat
                ? "bg-[#d9487d] text-white border-[#d9487d] shadow-md shadow-[#d9487d]/25"
                : isDark
                ? "bg-[#160918] border-[#2b1328] text-[#a890a5] hover:text-white hover:border-[#d9487d]/50"
                : "bg-white border-[#ebdce7] text-[#786175] hover:text-black hover:border-[#d9487d]/50"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rail horizontal deslizable de tratamientos */}
      {filteredServices.length === 0 ? (
        <div className="rounded-3xl border border-current/10 p-12 text-center my-4">
          <p className="text-base font-semibold">No hay tratamientos registrados en esta categoría aún.</p>
          <p className="text-xs text-current/60 mt-1">Crea nuevos servicios desde el panel de administración.</p>
        </div>
      ) : (
        <div
          ref={sliderRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2"
        >
          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              isSelected={service.id === selectedServiceId}
              onSelect={onSelectService}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default ServicesSection;
