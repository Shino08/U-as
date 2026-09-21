import { Sparkles } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { RITUAL_STEPS } from "../constants";

export function RitualSection() {
  const { theme } = useTheme();

  return (
    <section
      id="ritual"
      className={cn(
        "py-14 sm:py-20 lg:py-24 border-y transition-colors",
        theme === "dark" ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
            La Filosofía Lumière
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light">
            El Ritual en 4 Tiempos
          </h2>
          <p className={cn("text-sm sm:text-base", theme === "dark" ? "text-[#a890a5]" : "text-[#695365]")}>
            Cada sesión es una experiencia secuencial milimétrica pensada para la salud de tus uñas y
            un resultado impecable.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RITUAL_STEPS.map((step) => (
            <div
              key={step.num}
              className={cn(
                "p-7 rounded-3xl border relative group hover:border-[#d9487d]/50 transition-all duration-300 flex flex-col justify-between",
                theme === "dark" ? "bg-[#140816] border-[#2b1328]" : "bg-white border-[#ebdce7]"
              )}
            >
              <div>
                <span className="font-display italic text-4xl font-light text-[#d9487d]/40 group-hover:text-[#d9487d] transition-colors block mb-4">
                  {step.num}
                </span>
                <h3 className="font-display text-xl font-medium mb-1">{step.title}</h3>
                <p className="text-xs font-semibold text-[#d9487d] mb-3">{step.subtitle}</p>
                <p className={cn("text-xs leading-relaxed", theme === "dark" ? "text-[#a890a5]" : "text-[#695365]")}>
                  {step.desc}
                </p>
              </div>

              <div
                className={cn(
                  "pt-6 mt-6 border-t flex items-center justify-between text-[11px] text-current/50",
                  theme === "dark" ? "border-[#230d22]" : "border-[#ebdce7]"
                )}
              >
                <span>Paso {step.num} de 04</span>
                <Sparkles className="size-3.5 text-[#d9487d]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
