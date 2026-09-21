import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { FAQS } from "../constants";
import faqPhoto from "@/assets/lumiere-hero.jpg";

export function FaqSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      id="faq"
      className={cn(
        "relative py-14 sm:py-20 lg:py-24 border-t transition-colors",
        isDark ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]"
      )}
    >
      <div className="w-full px-5 sm:px-8 lg:px-14 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-[minmax(0,560px)_1fr] gap-10 lg:gap-20 items-start">
          {/* Foto editorial de uñas */}
          <div className="w-full h-64 sm:h-96 lg:h-[640px] rounded-3xl overflow-hidden order-1 lg:order-none shadow-2xl border border-current/10">
            <img
              src={faqPhoto}
              alt="Manicura de autor Lumière Nails"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Columna de contenido y acordeón */}
          <div className="lg:pt-6 max-w-xl">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
              Claridad &amp; Confianza
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight mt-3">
              Preguntas Frecuentes
            </h2>
            <p
              className={cn(
                "text-sm mt-3 leading-relaxed",
                isDark ? "text-[#a890a5]" : "text-[#695365]"
              )}
            >
              Resolvemos tus dudas sobre reservas, bioseguridad y cuidados para que llegues sin
              preocupaciones a tu cita.
            </p>

            <div className="mt-10">
              {FAQS.map((faq, index) => {
                const isOpen = openIndex === index;
                return (
                  <div
                    key={faq.question}
                    className={cn(
                      "border-b transition-colors",
                      isOpen ? "border-[#d9487d]" : isDark ? "border-[#261025]" : "border-[#ebdce7]"
                    )}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      aria-expanded={isOpen}
                      className="w-full py-5 text-left flex items-start justify-between gap-6 cursor-pointer select-none group"
                    >
                      <span
                        className={cn(
                          "font-display text-lg sm:text-xl font-normal transition-colors",
                          isOpen ? "text-[#d9487d]" : "group-hover:text-[#d9487d]"
                        )}
                      >
                        {faq.question}
                      </span>
                      <span
                        className={cn(
                          "relative shrink-0 w-3.5 h-3.5 mt-2 transition-transform duration-300 ease-out",
                          isOpen && "rotate-45"
                        )}
                      >
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-[1.5px]"
                          style={{ background: "#d9487d" }}
                        />
                        <span
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-[1.5px] rotate-90"
                          style={{ background: "#d9487d" }}
                        />
                      </span>
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300 ease-out",
                        isOpen ? "grid-rows-[1fr] opacity-100 pb-6" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p
                          className={cn(
                            "text-sm leading-relaxed pr-6",
                            isDark ? "text-[#a890a5]" : "text-[#695365]"
                          )}
                        >
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <a
              href="#reserva"
              className="inline-block mt-9 text-xs font-bold tracking-[0.22em] uppercase text-[#d9487d] underline underline-offset-8 decoration-1 hover:opacity-65 transition-opacity"
            >
              Agendar Ahora
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FaqSection;
