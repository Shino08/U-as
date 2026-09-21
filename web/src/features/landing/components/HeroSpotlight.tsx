import { useRef, useCallback } from "react";
import { ArrowRight, Eye } from "lucide-react";
import nailsHero from "@/assets/hero-spotlight.jpg";

/**
 * HeroSpotlight — versión corregida
 * ----------------------------------
 * Fix: se elimina "background-size: 200% auto" + "background-position-x left/right"
 * para evitar el zoom 2x forzado y el recorte en imágenes 16:9.
 * Ambas capas usan "cover" + "center" para mostrar la foto completa y nítida.
 */
export function HeroSpotlight() {
  const sectionRef = useRef<HTMLElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);

  const OFFSET_X = 27;
  const OFFSET_Y = 27;

  const handlePointerEnter = useCallback(() => {
    revealRef.current?.classList.remove("is-leaving");
    if (cursorRef.current) cursorRef.current.style.opacity = "1";
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
    const section = sectionRef.current;
    const cursor = cursorRef.current;
    if (!section || !cursor) return;

    const rect = section.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    section.style.setProperty("--x", `${x}px`);
    section.style.setProperty("--y", `${y}px`);
    cursor.style.transform = `translate3d(${x - OFFSET_X}px, ${y - OFFSET_Y}px, 0)`;
  }, []);

  const handlePointerLeave = useCallback(() => {
    revealRef.current?.classList.add("is-leaving");
    sectionRef.current?.style.setProperty("--x", "-9999px");
    sectionRef.current?.style.setProperty("--y", "-9999px");
    if (cursorRef.current) cursorRef.current.style.opacity = "0";
  }, []);

  return (
    <section
      id="inicio"
      ref={sectionRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-spotlight relative min-h-[580px] h-[100svh] w-full select-none overflow-hidden"
      style={{
        background: "rgb(26, 23, 20)",
        // @ts-expect-error custom properties
        "--r": "210px",
        "--x": "-9999px",
        "--y": "-9999px",
      }}
    >
      {/* Capa base: foto completa, apagada por filtro */}
      <div
        className="base-layer absolute inset-0"
        style={{
          backgroundImage: `url(${nailsHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "grayscale(0.85) brightness(0.55) contrast(1.05)",
        }}
      />

      {/* Capa revelada: la misma foto completa a color bajo el lente */}
      <div
        ref={revealRef}
        className="reveal-layer absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${nailsHero})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      <div
        className="absolute inset-x-0 top-0 h-44 pointer-events-none"
        style={{
          background:
            "linear-gradient(to bottom, rgba(26,23,20,0.92) 0%, rgba(26,23,20,0.45) 45%, transparent 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-[55%] pointer-events-none"
        style={{
          background:
            "linear-gradient(to top, rgba(26,23,20,0.95) 0%, rgba(26,23,20,0.6) 35%, rgba(26,23,20,0.12) 70%, transparent 100%)",
        }}
      />

      <div
        className="relative z-10 w-full h-full pointer-events-none flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-16 pt-16 max-w-7xl mx-auto"
        style={{ color: "#E8E0D2" }}
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-4 sm:mb-5">
            <span className="inline-block w-6 sm:w-8 h-px" style={{ background: "rgba(232,224,210,0.55)" }} />
            <span className="font-mono text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.35em] sm:tracking-[0.42em] uppercase opacity-80">
              Nail Art de Autor
            </span>
          </div>
          <h1 className="font-medium leading-[0.98] sm:leading-[0.95] text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] tracking-tight break-words">
            Uñas que
            <br />
            <span className="italic" style={{ opacity: 0.92 }}>
              cuentan tu historia.
            </span>
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.1em] sm:tracking-[0.12em] mt-5 sm:mt-6 opacity-70">
            <span className="inline-flex items-center gap-2 sm:gap-2.5">
              <span
                className="inline-block w-2 h-2 rounded-full shrink-0"
                style={{ background: "#E8E0D2", boxShadow: "0 0 14px 3px rgba(232,224,210,0.5)" }}
              />
              <span className="hidden sm:inline">Mueve el cursor para revelar el acabado final.</span>
              <span className="sm:hidden">Toca para revelar el acabado final.</span>
            </span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 pointer-events-auto">
            <a
              href="#reserva"
              className="inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-gradient-to-r from-[#d9487d] to-[#f29ebb] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-[#d9487d]/25 hover:scale-105 active:scale-95 transition-all min-h-[44px] w-full sm:w-auto"
            >
              <span>Apartar mi Cita</span>
              <ArrowRight className="size-4" />
            </a>
            <a
              href="#lookbook"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full border border-[#E8E0D2]/30 bg-black/40 backdrop-blur-sm text-[#E8E0D2] text-xs font-semibold hover:border-[#d9487d] hover:bg-[#d9487d]/20 transition-all min-h-[44px] w-full sm:w-auto"
            >
              <Eye className="size-4 text-[#d9487d]" />
              <span>Explorar Lookbook</span>
            </a>
          </div>
        </div>
      </div>

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="hero-cursor hidden md:block absolute top-0 left-0 pointer-events-none z-[60] opacity-0"
        style={{
          transform: "translate3d(-9999px, -9999px, 0)",
          filter: "drop-shadow(0 3px 7px rgba(0,0,0,0.55))",
        }}
      >
        <svg width="64" height="64" viewBox="0 0 100 100" fill="none">
          <path d="M62 62 L86 86" stroke="#E8E0D2" strokeWidth={6.5} strokeLinecap="round" />
          <path d="M62 62 L86 86" stroke="rgba(26,23,20,0.55)" strokeWidth={2} strokeLinecap="round" />
          <circle cx="42" cy="42" r="30" fill="rgba(232,224,210,0.05)" />
          <circle cx="42" cy="42" r="30" stroke="rgba(232,224,210,0.3)" strokeWidth={6} opacity={0.45} />
          <circle cx="42" cy="42" r="30" stroke="#E8E0D2" strokeWidth={2} />
          <g stroke="#E8E0D2" strokeWidth={1.4} opacity={0.5} strokeLinecap="round">
            <path d="M42 25 V33" />
            <path d="M42 51 V59" />
            <path d="M25 42 H33" />
            <path d="M51 42 H59" />
          </g>
          <path d="M27 37 a18 18 0 0 1 12 -11" stroke="#E8E0D2" strokeWidth={2} opacity={0.55} strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}

export default HeroSpotlight;
