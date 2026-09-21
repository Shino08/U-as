import { ArrowRight, Eye } from "lucide-react";
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

  return (
    <section
      id="lookbook"
      className={cn(
        "py-14 sm:py-20 lg:py-24 border-y transition-colors",
        theme === "dark" ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]"
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
            <p
              className={cn(
                "text-sm mt-2 max-w-lg",
                theme === "dark" ? "text-[#a890a5]" : "text-[#695365]"
              )}
            >
              Diseños icónicos creados en nuestro estudio. Toca cualquiera para visualizarlo o
              cargarlo directamente en tu reserva.
            </p>
          </div>
          <a
            href="#reserva"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#d9487d] hover:underline"
          >
            <span>Pedir un diseño de referencia</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {lookbookList.length === 0 ? (
            <div className="col-span-full rounded-3xl border border-current/10 p-12 text-center">
              <p className="text-base font-semibold">No hay estilos publicados en el Lookbook aún.</p>
              <p className="text-xs text-current/60 mt-1">Los nuevos diseños cargados desde el panel se mostrarán aquí.</p>
            </div>
          ) : (
            lookbookList.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "group rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                  selectedLookbook?.id === item.id
                    ? "border-[#d9487d] ring-2 ring-[#d9487d]/30 scale-[1.01]"
                    : "hover:border-[#d9487d]/60",
                  theme === "dark" ? "bg-[#150917] border-[#2c132a]" : "bg-white border-[#ebdce7]"
                )}
              >
                <div>
                  <div
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => onPreviewImage(item.image)}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#f29ebb] border border-white/10">
                      {item.category}
                    </span>
                    <button
                      type="button"
                      className="absolute bottom-3 right-3 size-8 rounded-full bg-black/60 backdrop-blur-sm text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Ver en grande"
                    >
                      <Eye className="size-4" />
                    </button>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-display text-xl font-normal">{item.title}</h3>
                    <p
                      className={cn(
                        "text-xs leading-relaxed",
                        theme === "dark" ? "text-[#a890a5]" : "text-[#695365]"
                      )}
                    >
                      {item.technique}
                    </p>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-5 pt-0 flex items-center justify-between border-t mt-3",
                    theme === "dark" ? "border-[#240e22]" : "border-[#ebdce7]"
                  )}
                >
                  <div>
                    <span className="text-[10px] text-current/60 block uppercase tracking-wider">
                      Estimado
                    </span>
                    <span className="font-bold text-base">${item.estimatedPrice}</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => onSelectLookbookStyle(item)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                      selectedLookbook?.id === item.id
                        ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
                        : theme === "dark"
                        ? "bg-[#240f23] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
                        : "bg-[#fcedf5] text-[#b33261] hover:bg-[#d9487d] hover:text-white"
                    )}
                  >
                    {selectedLookbook?.id === item.id ? "Seleccionado ✓" : "Quiero este"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
