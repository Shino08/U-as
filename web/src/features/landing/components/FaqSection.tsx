import { useState } from "react";
import { Sparkles, ChevronDown, ArrowRight } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { FAQS } from "../constants";

export function FaqSection() {
  const { theme } = useTheme();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const isDark = theme === "dark";

  return (
    <section id="faq" className="relative py-14 sm:py-20 lg:py-24 max-w-4xl mx-auto px-5 sm:px-8 overflow-hidden">
      <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d9487d]/10 rounded-full blur-3xl" />

      <div className="relative text-center mb-8 md:mb-14 space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d9487d]/10 text-[#d9487d] border border-[#d9487d]/20 shadow-sm">
          <Sparkles className="size-3.5 animate-pulse text-[#d9487d]" />
          <span>Claridad &amp; Confianza</span>
        </div>
        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">Preguntas Frecuentes</h2>
        <p className="text-xs sm:text-sm text-current/60 max-w-md mx-auto leading-relaxed">
          Resolvemos tus dudas sobre nuestros procesos, bioseguridad y cuidados para una experiencia perfecta.
        </p>
      </div>

      <div className="relative space-y-3.5">
        {FAQS.map((faq, index) => {
          const isOpen = openFaqIndex === index;
          return (
            <div
              key={index}
              className={cn(
                "group rounded-2xl border transition-all duration-300 ease-out overflow-hidden relative",
                isOpen
                  ? isDark ? "border-[#d9487d]/50 bg-[#160819] shadow-lg ring-1 ring-[#d9487d]/20" : "border-[#d9487d]/40 bg-white shadow-lg ring-1 ring-[#d9487d]/15"
                  : isDark ? "border-[#261025] bg-[#120714]/90 hover:border-[#401a3d] hover:bg-[#150918]" : "border-[#ebdce7] bg-white/95 hover:border-[#dab8d4]"
              )}
            >
              <div className={cn("absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d9487d] via-[#e66c98] to-[#d9487d] transition-transform duration-300 origin-top", isOpen ? "scale-y-100" : "scale-y-0")} />

              <button
                type="button"
                onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                aria-expanded={isOpen}
                className="w-full px-6 py-5 sm:py-5.5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className={cn("font-medium text-sm sm:text-base tracking-tight transition-colors", isOpen ? "text-[#d9487d] font-semibold" : "text-current group-hover:text-[#d9487d]")}>
                  {faq.question}
                </span>
                <div className={cn("size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300", isOpen ? "bg-[#d9487d] text-white rotate-180 shadow-md scale-105" : isDark ? "bg-[#220c22] text-[#d9487d]" : "bg-[#faeff5] text-[#d9487d]")}>
                  <ChevronDown className="size-4" />
                </div>
              </button>

              <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                <div className="overflow-hidden">
                  <div className={cn("px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t transition-all", isDark ? "text-[#a890a5] border-[#250d25]" : "text-[#695365] border-[#f2e2ec]")}>
                    <p className="pt-2">{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className={cn("mt-10 p-5 sm:p-6 rounded-2xl border transition-all flex flex-col sm:flex-row items-center justify-between gap-4", isDark ? "border-[#261025] bg-[#120714]/80" : "border-[#ebdce7] bg-[#fdf9fb]")}>
        <div className="text-center sm:text-left">
          <p className="text-sm font-semibold tracking-tight">¿Tienes alguna pregunta especial o solicitud de diseño bespoke?</p>
          <p className="text-xs text-current/60 mt-0.5">Escríbenos directamente y nuestro equipo te asesorará de inmediato.</p>
        </div>
        <a
          href="https://wa.me/?text=Hola%20Lumiere%20Nails,%20tengo%20una%20consulta"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#d9487d] hover:bg-[#c23b6c] text-white shadow-md hover:-translate-y-0.5 transition-all shrink-0"
        >
          <span>Consultar por WhatsApp</span>
          <ArrowRight className="size-3.5" />
        </a>
      </div>
    </section>
  );
}
