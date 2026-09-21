import { useRef, useCallback } from "react";

// Reemplaza este import por la foto de uñas que quieras usar como protagonista
// del efecto (puede ser la misma imagen del hero actual del catálogo).
import nailsHero from "@/assets/lumiere-hero.jpg";

/**
 * HeroSpotlight
 * -------------
 * Adaptación a React del efecto "spotlight reveal" del HTML original.
 * En vez de la pintura de archivo, usa una foto de uñas (nailsHero) como
 * capa base (tono apagado / blanco y negro) y como capa "revelada"
 * (color completo), simulando un "antes / después" que el cursor
 * descubre al pasar por encima — perfecto para un salón de manicura.
 *
 * Uso:
 *  1. Copia este archivo en src/components/HeroSpotlight.tsx
 *  2. En src/pages/LandingPage.tsx, importa <HeroSpotlight /> y colócalo
 *     donde hoy está el hero actual (reemplázalo por completo).
 *  3. Ajusta `nailsHero` por la imagen de uñas que quieras destacar.
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
      ref={sectionRef}
      onPointerEnter={handlePointerEnter}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="hero-spotlight relative h-[100dvh] w-full select-none overflow-hidden"
      style={{
        background: "rgb(26, 23, 20)",
        // @ts-expect-error custom properties
        "--r": "210px",
        "--x": "-9999px",
        "--y": "-9999px",
      }}
    >
      {/* Capa base: versión apagada / desaturada de las uñas */}
      <div
        className="base-layer absolute inset-0"
        style={{
          backgroundImage: `url(${nailsHero})`,
          backgroundSize: "200% auto",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "center",
          backgroundPositionX: "left",
          filter: "grayscale(0.85) brightness(0.55) contrast(1.05)",
        }}
      />

      {/* Capa revelada: versión a todo color, solo visible bajo el "lente" */}
      <div
        ref={revealRef}
        className="reveal-layer absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url(${nailsHero})`,
          backgroundSize: "200% auto",
          backgroundRepeat: "no-repeat",
          backgroundPositionY: "center",
          backgroundPositionX: "right",
        }}
      />

      {/* Degradados superior e inferior para legibilidad del texto */}
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

      {/* Contenido: header + headline, con textos de nail studio */}
      <div
        className="absolute inset-0 pointer-events-none flex flex-col justify-between p-8 md:p-12 lg:p-14"
        style={{ color: "#E8E0D2" }}
      >
        <header className="flex items-start justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl md:text-3xl tracking-[0.18em] font-medium">
              LUMIÈRE NAILS
            </span>
          </div>
          <div className="text-right">
            <div className="font-mono text-[10px] md:text-[11px] tracking-[0.3em] uppercase opacity-65">
              Estudio de Manicura
            </div>
            <div className="font-mono text-xs md:text-sm tracking-[0.2em] mt-1">
              Caracas · Venezuela
            </div>
          </div>
        </header>

        <div
          className="absolute left-8 right-8 md:left-12 md:right-12 top-[88px] md:top-[104px] h-px"
          style={{ background: "rgba(232,224,210,0.18)" }}
        />

        <div className="max-w-2xl">
          <div className="flex items-center gap-3 mb-5">
            <span className="inline-block w-8 h-px" style={{ background: "rgba(232,224,210,0.55)" }} />
            <span className="font-mono text-[10px] md:text-[11px] tracking-[0.42em] uppercase opacity-80">
              Nail Art de Autor
            </span>
          </div>
          <h1 className="font-medium leading-[0.95] text-5xl md:text-7xl lg:text-[5.5rem] tracking-tight">
            Uñas que
            <br />
            <span className="italic" style={{ opacity: 0.92 }}>
              cuentan tu historia.
            </span>
          </h1>
          <p className="font-mono text-xs md:text-sm tracking-[0.12em] mt-7 opacity-70 pointer-events-auto">
            <span className="inline-flex items-center gap-2.5">
              <span
                className="inline-block w-2 h-2 rounded-full"
                style={{ background: "#E8E0D2", boxShadow: "0 0 14px 3px rgba(232,224,210,0.5)" }}
              />
              Mueve el cursor para revelar el acabado final.
            </span>
          </p>
        </div>
      </div>

      {/* Cursor tipo lupa de inspección */}
      <div
        ref={cursorRef}
        aria-hidden="true"
        className="hero-cursor absolute top-0 left-0 pointer-events-none z-[60] opacity-0"
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
