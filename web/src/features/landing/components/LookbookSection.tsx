import { useRef } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { LookbookItem } from "../types";

interface LookbookSectionProps {
  lookbookList: LookbookItem[];
  selectedLookbook: LookbookItem | null;
  onSelectLookbookStyle: (item: LookbookItem) => void;
  onPreviewImage: (image: string) => void;
}

export function LookbookSection({
  lookbookList,
  selectedLookbook,
  onSelectLookbookStyle,
  onPreviewImage,
}: LookbookSectionProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const railRef = useRef<HTMLDivElement>(null);

  const scrollRail = (direction: "left" | "right") => {
    if (!railRef.current) return;
    const amount = direction === "left" ? -320 : 320;
    railRef.current.scrollBy({ left: amount, behavior: "smooth" });
  };

  return (
    <section
      id="lookbook"
      className={cn(
        "py-14 sm:py-20 lg:py-24 border-y transition-colors overflow-hidden",
        isDark ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-14">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
              Inspiración &amp; Estilo
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light mt-2">
              Lookbook de Tendencias
            </h2>
            <p className={cn("text-sm mt-2 max-w-lg", isDark ? "text-[#a890a5]" : "text-[#695365]")}>
              Diseños icónicos creados en nuestro estudio. Toca cualquiera para visualizarlo o cargarlo directamente en tu reserva.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href="#reserva"
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d9487d] hover:underline"
            >
              <span>Pedir un diseño de referencia</span>
              <ArrowRight className="size-3.5" />
            </a>

            {lookbookList.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => scrollRail("left")}
                  aria-label="Diseños anteriores"
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
                  onClick={() => scrollRail("right")}
                  aria-label="Más diseños"
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
            )}
          </div>
        </div>

        {lookbookList.length === 0 ? (
          <div className="rounded-3xl border border-current/10 p-12 text-center">
            <p className="text-base font-semibold">No hay estilos publicados en el Lookbook aún.</p>
            <p className="text-xs text-current/60 mt-1">Los nuevos diseños cargados desde el panel se mostrarán aquí.</p>
          </div>
        ) : (
          <div
            ref={railRef}
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            className="flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-2"
          >
            {lookbookList.map((item) => {
              const isSelected = selectedLookbook?.id === item.id;
              return (
                <div
                  key={item.id}
                  className={cn(
                    "group shrink-0 w-[250px] sm:w-[266px] snap-start rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                    isSelected
                      ? "border-[#d9487d] ring-2 ring-[#d9487d]/30"
                      : isDark
                      ? "border-[#2c132a] bg-[#150917]"
                      : "border-[#ebdce7] bg-white"
                  )}
                >
                  <div
                    className="relative aspect-square overflow-hidden cursor-pointer bg-current/5"
                    onClick={() => onPreviewImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#f29ebb] border border-white/10">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onPreviewImage(item.image);
                      }}
                      aria-label="Ver en grande"
                      className="absolute bottom-3 right-3 size-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>

                  <div className="p-4 space-y-1 flex-1">
                    <h3 className="font-display text-base font-normal leading-snug truncate">{item.title}</h3>
                    <p className={cn("text-xs leading-relaxed line-clamp-2", isDark ? "text-[#a890a5]" : "text-[#695365]")}>
                      {item.technique}
                    </p>
                  </div>

                  <div className={cn("px-4 py-3 flex items-center justify-between border-t", isDark ? "border-[#240e22]" : "border-[#ebdce7]")}>
                    <div>
                      <span className="text-[9px] text-current/60 block uppercase tracking-wider">Estimado</span>
                      <span className="font-bold text-sm">${item.estimatedPrice}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => onSelectLookbookStyle(item)}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer",
                        isSelected
                          ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
                          : isDark
                          ? "bg-[#240f23] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
                          : "bg-[#fcedf5] text-[#b33261] hover:bg-[#d9487d] hover:text-white"
                      )}
                    >
                      {isSelected ? "Seleccionado" : "Quiero este"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default LookbookSection;
