import React, { useState, useEffect, useMemo, useRef, type FormEvent } from "react";
import {
  Sparkles,
  Calendar,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  Instagram,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Check,
  Gem,
  Flame,
  ChevronDown,
  Eye,
  X,
} from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

import heroImage from "@/assets/lumiere-hero.jpg";
import classicImage from "@/assets/service-classic.jpg";
import artImage from "@/assets/service-art.jpg";
import gelImage from "@/assets/service-gel.jpg";
import chromeImage from "@/assets/lookbook-chrome.jpg";
import cateyeImage from "@/assets/lookbook-cateye.jpg";
import { resolveImage } from "@/lib/images";

interface Service {
  id: string;
  name: string;
  category: string;
  duration: number;
  price: number;
  description: string;
  tag?: string;
  image: string;
  features: string[];
}

interface LookbookItem {
  id: string;
  title: string;
  category: string;
  image: string;
  technique: string;
  durationBonus: string;
  estimatedPrice: number;
}

interface AddOn {
  id: string;
  name: string;
  price: number;
  duration: number;
  description: string;
}

interface FAQItem {
  question: string;
  answer: string;
}

const ADDONS: AddOn[] = [
  {
    id: "french-micro",
    name: "Micro French de Precisión",
    price: 8,
    duration: 15,
    description: "Línea francesa ultra fina realizada con pincel de detalle 000.",
  },
  {
    id: "chrome-effect",
    name: "Efecto Glazed / Chrome",
    price: 10,
    duration: 15,
    description: "Acabado aperlado Hailey Bieber sobre cualquier tono base.",
  },
  {
    id: "crystals-swarovski",
    name: "Set Cristales & Gemas",
    price: 15,
    duration: 20,
    description: "Aplicación y encapsulado de cristales facetados de alto destello.",
  },
  {
    id: "removal",
    name: "Retiro de Sistema Previo",
    price: 7,
    duration: 20,
    description: "Retiro seguro con torno para no debilitar tu uña natural.",
  },
];

const RITUAL_STEPS = [
  {
    num: "01",
    title: "Morfología & Diagnóstico",
    subtitle: "Estudio personalizado de tus manos",
    desc: "Analizamos la anatomía de tu lecho ungueal, curvatura y flexibilidad para determinar la forma que estilice y armonice tus dedos.",
  },
  {
    num: "02",
    title: "Manicura Rusa de Precisión",
    subtitle: "Limpieza micrométrica sin cortes",
    desc: "Con fresas de diamante certificadas pulimos y despejamos la cutícula al 100%. Cero dolor, cero irritación, máxima higiene.",
  },
  {
    num: "03",
    title: "Arquitectura & Nivelación",
    subtitle: "El secreto del reflejo espejo",
    desc: "Aplicamos base niveladora rubber creando un ápice que protege la uña de golpes y genera un reflejo de luz continuo.",
  },
  {
    num: "04",
    title: "Arte de Autor & Diamond Seal",
    subtitle: "Sellado de alta resistencia",
    desc: "Pintura a mano alzada o texturas 3D selladas con top coat anti-amarilleo y anti-rayas con duración garantizada por 3 semanas.",
  },
];

const FAQS: FAQItem[] = [
  {
    question: "¿Cuánto dura el esmaltado y el nail art?",
    answer:
      "Nuestra manicura rusa con nivelación rubber y sellado de alta gama dura entre 21 y 28 días intacta, sin astillarse ni perder su brillo espejo. Ofrecemos 14 días de garantía total con retoque gratuito si surge algún detalle.",
  },
  {
    question: "¿La manicura rusa debilita o adelgaza la uña natural?",
    answer:
      "Al contrario. La técnica se realiza en seco con fresas diamantadas de grano suave y precisión milimétrica. Nunca sobrelimamos la superficie natural; por el contrario, la base niveladora rubber protege la lámina ungueal, permitiendo que tu uña crezca fuerte, sana y resistente.",
  },
  {
    question: "¿Qué insumos y estándares de higiene utilizan?",
    answer:
      "Cumplimos con bioseguridad grado clínico: todo instrumental metálico pasa por lavado ultrasónico y esterilización en autoclave hospitalaria a 134°C, abriendo el sobre sellado con testigo biológico frente a ti. Limas, bloques y campos de trabajo son 100% descartables por clienta.",
  },
  {
    question: "¿Cómo funcionan las cancelaciones y formas de pago?",
    answer:
      "No requerimos depósitos ni cobros por adelantado en la reserva web. Pagas cómodamente al finalizar tu sesión en el estudio mediante Zelle, Efectivo, Pago Móvil o Tarjeta de débito/crédito. Si necesitas reprogramar, puedes hacerlo con al menos 12 horas de anticipación sin costo adicional.",
  },
];

function getUpcomingDates(): Array<{ label: string; shortLabel: string; dateNumber: string; fullDate: string }> {
  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
  const dates: Array<{ label: string; shortLabel: string; dateNumber: string; fullDate: string }> = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);

    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    const fullDate = `${year}-${month}-${day}`;

    const label = i === 0 ? "Hoy" : i === 1 ? "Mañana" : dayNames[d.getDay()];
    const shortLabel = i === 0 ? "Hoy" : i === 1 ? "Mañ" : dayNames[d.getDay()];
    const dateNumber = String(d.getDate());

    dates.push({ label, shortLabel, dateNumber, fullDate });
  }
  return dates;
}

const TIME_SLOTS = [
  { time: "10:30 AM", available: true },
  { time: "12:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:45 PM", available: true },
  { time: "05:15 PM", available: true },
  { time: "06:45 PM", available: true },
];

export default function LandingPage() {
  const { theme } = useTheme();
  const availableDates = useMemo(() => getUpcomingDates(), []);
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [lookbookList, setLookbookList] = useState<LookbookItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");

  const availableCategories = useMemo(() => {
    const cats = new Set<string>(["Todos"]);
    servicesList.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [servicesList]);
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedLookbook, setSelectedLookbook] = useState<LookbookItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    () => availableDates[0]?.fullDate || "2026-09-18"
  );
  const [selectedTime, setSelectedTime] = useState<string>("02:00 PM");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Slider Ref
  const servicesSliderRef = useRef<HTMLDivElement>(null);

  // Form & Rate Limit State
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);

  // Booking Flow Status
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [bookingCode, setBookingCode] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
        const [svcRes, landingRes] = await Promise.all([
          fetch(`${apiUrl}/services`),
          fetch(`${apiUrl}/landing`),
        ]);

        if (svcRes.ok) {
          const data = await svcRes.json();
          if (Array.isArray(data)) {
            const mapped = data.map((s) => ({
              id: String(s.id),
              name: s.name,
              category: s.category || "Manicura",
              duration: Number(s.duration) || 50,
              price: Number(s.price) || 35,
              description: s.description || "",
              tag: s.tag,
              image: resolveImage(s.image) || classicImage,
              features:
                Array.isArray(s.features) && s.features.length > 0
                  ? s.features
                  : [
                      "Técnica de alta precisión",
                      "Materiales hipoalergénicos",
                      "Sellado de larga duración",
                    ],
            }));
            setServicesList(mapped);
            if (mapped.length > 0) {
              setSelectedServiceId(mapped[0].id);
            }
          }
        }

        if (landingRes.ok) {
          const landingData = await landingRes.json();
          if (landingData?.lookbook && Array.isArray(landingData.lookbook)) {
            setLookbookList(
              landingData.lookbook.map((item: any) => ({
                id: String(item.id),
                title: item.title,
                category: item.category,
                image: resolveImage(item.image) || chromeImage,
                technique: item.technique,
                durationBonus: item.durationBonus || "+15 min",
                estimatedPrice: Number(item.estimatedPrice) || 40,
              }))
            );
          } else {
            setLookbookList([]);
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  const selectedService = useMemo(
    () => servicesList.find((s) => s.id === selectedServiceId) ?? servicesList[0],
    [selectedServiceId, servicesList]
  );

  const filteredServices = useMemo(() => {
    if (activeCategory === "Todos") return servicesList;
    return servicesList.filter((s) => s.category === activeCategory);
  }, [activeCategory, servicesList]);

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const lookbookBonusMinutes = useMemo(() => {
    if (!selectedLookbook?.durationBonus) return 0;
    const match = selectedLookbook.durationBonus.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  }, [selectedLookbook]);

  const calculatedTotal = useMemo(() => {
    const addonsTotal = selectedAddons.reduce((acc, id) => {
      const found = ADDONS.find((a) => a.id === id);
      return acc + (found ? found.price : 0);
    }, 0);
    return (selectedService?.price ?? 0) + addonsTotal;
  }, [selectedService, selectedAddons]);

  const calculatedDuration = useMemo(() => {
    const addonsMinutes = selectedAddons.reduce((acc, id) => {
      const found = ADDONS.find((a) => a.id === id);
      return acc + (found ? found.duration : 0);
    }, 0);
    return (selectedService?.duration ?? 45) + addonsMinutes + lookbookBonusMinutes;
  }, [selectedService, selectedAddons, lookbookBonusMinutes]);

  const handleSelectServiceAndScroll = (id: string) => {
    setSelectedServiceId(id);
    const element = document.getElementById("reserva");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSelectLookbookStyle = (item: LookbookItem) => {
    if (selectedLookbook?.id === item.id) {
      setSelectedLookbook(null);
      return;
    }
    setSelectedLookbook(item);

    // 1. Try to find a matching service by name/title
    const nameMatch = servicesList.find(
      (s) => s.name.toLowerCase().trim() === item.title.toLowerCase().trim()
    );
    // 2. Try to find a matching service by category
    const categoryMatch = servicesList.find(
      (s) => s.category.toLowerCase().trim() === item.category.toLowerCase().trim()
    );

    if (nameMatch) {
      setSelectedServiceId(nameMatch.id);
    } else if (categoryMatch) {
      setSelectedServiceId(categoryMatch.id);
    }

    // Scroll smoothly to reservation so user sees the loaded design
    const element = document.getElementById("reserva") || document.getElementById("personalizar");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollServicesSlider = (direction: "left" | "right") => {
    if (servicesSliderRef.current) {
      const scrollAmount = direction === "left" ? -400 : 400;
      servicesSliderRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    if (servicesSliderRef.current) {
      servicesSliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  const handleSubmitBooking = async (e: FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    // Client-side rate-limit cooldown: prevent spam submissions within 15 seconds
    const lastAttempt = localStorage.getItem("lumiere_last_booking_time");
    const now = Date.now();
    if (lastAttempt && now - Number(lastAttempt) < 15000) {
      const waitSec = Math.ceil((15000 - (now - Number(lastAttempt))) / 1000);
      setRateLimitError(
        `Por favor espera ${waitSec} segundos antes de enviar otra solicitud de reserva.`
      );
      return;
    }

    setStatus("submitting");

    const newCode = `LUM-${Math.floor(1000 + Math.random() * 9000)}`;
    const newAppointment = {
      id: `apt-${Date.now()}`,
      bookingCode: newCode,
      serviceId: selectedService ? (isNaN(Number(selectedService.id)) ? 1 : Number(selectedService.id)) : 1,
      serviceName: selectedService?.name || "Tratamiento Personalizado",
      clientName: name,
      customerName: name,
      clientEmail: email,
      customerEmail: email,
      clientPhone: phone,
      customerPhone: phone,
      notes: [
        selectedLookbook ? `[Diseño Lookbook: ${selectedLookbook.title} (${selectedLookbook.category})]` : "",
        notes,
      ]
        .filter(Boolean)
        .join(" · "),
      customerNotes: [
        selectedLookbook ? `[Diseño Lookbook: ${selectedLookbook.title} (${selectedLookbook.category})]` : "",
        notes,
      ]
        .filter(Boolean)
        .join(" · "),
      totalPrice: calculatedTotal,
      appointmentDate: selectedDate,
      appointmentTime: selectedTime,
      date: new Date(`${selectedDate} ${selectedTime.replace(" AM", ":00").replace(" PM", ":00")}`),
      addons: selectedAddons,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    // Save to local admin appointments list immediately for local preview
    try {
      const existing = localStorage.getItem("lumiere_admin_appointments");
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem("lumiere_admin_appointments", JSON.stringify([newAppointment, ...list]));
    } catch {
      // localStorage fallback
    }

    try {
      const apiEndpoint = `${import.meta.env.VITE_API_URL || "http://localhost:3000/api"}/appointments`;
      const res = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppointment),
      });

      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setRateLimitError(
          data.error || "Has superado el límite de citas permitidas. Por favor espera unos minutos."
        );
        setStatus("idle");
        return;
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setRateLimitError(data.error || `Error ${res.status} al procesar la reserva.`);
        setStatus("idle");
        return;
      }

      const data = await res.json();
      localStorage.setItem("lumiere_last_booking_time", String(now));
      setBookingCode(data.bookingCode || `LUM-${data.id || newCode}`);
      setStatus("success");
    } catch {
      // Local fallback if offline
      localStorage.setItem("lumiere_last_booking_time", String(now));
      setBookingCode(newCode);
      setStatus("success");
    }
  };

  return (
    <div
      className={cn(
        "min-h-screen font-sans antialiased selection:bg-[#d9487d]/35 selection:text-white transition-colors duration-300 overflow-x-hidden",
        theme === "dark"
          ? "bg-[#0a050c] text-[#f8f2f6]"
          : "bg-[#faf6f9] text-[#1d0f1c]"
      )}
    >
      {/* ─── NAVBAR CON BOTÓN DE TEMA ─── */}
      <Navbar />

      {/* ─── HERO SECTION (HIGH FASHION LUXURY EDITORIAL) ─── */}
      <section id="inicio" className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
        {/* Glow Spheres */}
        <div
          className={cn(
            "pointer-events-none absolute top-10 right-10 size-[500px] rounded-full blur-[140px]",
            theme === "dark" ? "bg-[#d9487d]/15" : "bg-[#d9487d]/10"
          )}
        />
        <div
          className={cn(
            "pointer-events-none absolute bottom-0 left-0 size-[450px] rounded-full blur-[130px]",
            theme === "dark" ? "bg-[#52133b]/20" : "bg-[#f29ebb]/20"
          )}
        />

        <div className="max-w-7xl mx-auto px-5 sm:px-8 relative z-10">
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-8 items-center">
            {/* Left Content (7 Cols) */}
            <div className="lg:col-span-7 space-y-8">
              {/* Tag Badge */}
              <div
                className={cn(
                  "inline-flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs font-semibold tracking-wide shadow-inner",
                  theme === "dark"
                    ? "bg-[#1c0c1e] border-[#3f193d] text-[#f29ebb]"
                    : "bg-[#fcedf5] border-[#f0cde1] text-[#b33261]"
                )}
              >
                <Flame className="size-3.5 fill-current" />
                <span>Nail Couture &amp;</span>
              </div>

              {/* Display Headline */}
              <h1 className="font-display text-3xl sm:text-5xl lg:text-7xl font-light leading-[1.06] tracking-tight">
                Tus manos como una{" "}
                <em className="block font-normal italic text-[#d9487d]">
                  obra de arte viva.
                </em>
              </h1>

              {/* Subtitle */}
              <p
                className={cn(
                  "text-base sm:text-lg max-w-xl font-normal leading-relaxed",
                  theme === "dark" ? "text-[#b8a1b5]" : "text-[#694f66]"
                )}
              >
                Sin prisas, con devoción. Diseños esculturales en 3D, esmaltado nivelador bajo cutícula y
                garantía de durabilidad por más de 21 días en un ambiente privado y exclusivo.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <a
                  href="#reserva"
                  className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-[#d9487d] to-[#f29ebb] text-white font-bold text-sm uppercase tracking-wider shadow-xl shadow-[#d9487d]/25 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Apartar mi Cita</span>
                  <ArrowRight className="size-4" />
                </a>

                <a
                  href="#lookbook"
                  className={cn(
                    "inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border text-sm font-semibold transition-all",
                    theme === "dark"
                      ? "bg-[#160918] text-white border-[#30162e] hover:border-[#d9487d] hover:bg-[#1e0d21]"
                      : "bg-white text-[#1d0f1c] border-[#ebdce7] hover:border-[#d9487d] hover:bg-[#fcf8fa]"
                  )}
                >
                  <Eye className="size-4 text-[#d9487d]" />
                  <span>Explorar Lookbook</span>
                </a>
              </div>

              {/* Metrics */}
              <div
                className={cn(
                  "pt-8 border-t flex flex-wrap items-center gap-6 sm:gap-12",
                  theme === "dark" ? "border-[#261228]" : "border-[#ebdce7]"
                )}
              >
                <div>
                  <p className="font-display text-3xl font-semibold">21+ Días</p>
                  <p
                    className={cn(
                      "text-xs uppercase tracking-wider mt-0.5",
                      theme === "dark" ? "text-[#8f758d]" : "text-[#786175]"
                    )}
                  >
                    Retención garantizada
                  </p>
                </div>
                <div
                  className={cn(
                    "h-8 w-px hidden sm:block",
                    theme === "dark" ? "bg-[#261228]" : "bg-[#ebdce7]"
                  )}
                />
                <div>
                  <p className="font-display text-3xl font-semibold">100%</p>
                  <p
                    className={cn(
                      "text-xs uppercase tracking-wider mt-0.5",
                      theme === "dark" ? "text-[#8f758d]" : "text-[#786175]"
                    )}
                  >
                    Esterilización clínica
                  </p>
                </div>
                <div
                  className={cn(
                    "h-8 w-px hidden sm:block",
                    theme === "dark" ? "bg-[#261228]" : "bg-[#ebdce7]"
                  )}
                />
                <div>
                  <p className="font-display text-3xl font-semibold text-[#d9487d]">4.9 ★</p>
                  <p
                    className={cn(
                      "text-xs uppercase tracking-wider mt-0.5",
                      theme === "dark" ? "text-[#8f758d]" : "text-[#786175]"
                    )}
                  >
                    Excelencia boutique
                  </p>
                </div>
              </div>
            </div>

            {/* Right Visual (5 Cols) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute inset-0 bg-gradient-to-tr from-[#d9487d]/35 via-transparent to-[#f29ebb]/20 rounded-[2.5rem] rotate-3 blur-md scale-105" />

                <div
                  className={cn(
                    "relative rounded-[2rem] overflow-hidden border shadow-2xl",
                    theme === "dark"
                      ? "border-[#3b1738] bg-[#140816]"
                      : "border-[#ebdce7] bg-white"
                  )}
                >
                  <img
                    src={heroImage}
                    alt="Manicura de lujo Lumière Nails"
                    className="w-full aspect-[4/5] object-cover"
                    width={800}
                    height={1000}
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-75" />

                  <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#140816]/90 backdrop-blur-md border border-[#381635] flex items-center justify-between text-white">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-[#260f23] text-[#f29ebb] flex items-center justify-center">
                        <Gem className="size-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-white">
                          Acabado Glazed Espejo
                        </p>
                        <p className="text-[11px] text-[#b8a1b5]">Reflejo sin imperfecciones</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-[#d9487d]/20 text-[#f29ebb]">
                      Signature
                    </span>
                  </div>
                </div>

                <div
                  className={cn(
                    "absolute -top-3 left-0 sm:-left-6 px-4 py-2.5 rounded-2xl border shadow-xl flex items-center gap-3 backdrop-blur-md",
                    theme === "dark"
                      ? "bg-[#190a1b] border-[#3f193d] text-white"
                      : "bg-white border-[#ebdce7] text-[#1d0f1c]"
                  )}
                >
                  <span className="size-2 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold">Atención 1 a 1 sin esperas</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 1: LOOKBOOK INTERACTIVO (SHOWROOM VISUAL) ─── */}
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
                  theme === "dark"
                    ? "bg-[#150917] border-[#2c132a]"
                    : "bg-white border-[#ebdce7]"
                )}
              >
                <div>
                  <div
                    className="relative aspect-[4/3] overflow-hidden cursor-pointer"
                    onClick={() => setPreviewImage(item.image)}
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
                    onClick={() => handleSelectLookbookStyle(item)}
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
            )))}
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 2: CATÁLOGO DE SERVICIOS (SLIDER CON CONTROLES LATERALES) ─── */}
      <section id="servicios" className="relative py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-5 sm:px-8 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
              Carta de Tratamientos
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light mt-2">
              Servicios Exclusivos
            </h2>
            <p className="text-xs sm:text-sm text-current/60 mt-1 max-w-md">
              Desliza para explorar nuestras técnicas de nivelación, arte de autor y extensiones arquitectónicas.
            </p>
          </div>

          {/* Filtros por Categoría + Controles de Navegación Lateral */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Filter Pills */}
            <div
              className={cn(
                "flex flex-wrap gap-1.5 p-1.5 rounded-full border",
                theme === "dark" ? "bg-[#160918] border-[#2b1328]" : "bg-white border-[#ebdce7]"
              )}
            >
              {availableCategories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => handleCategoryChange(cat)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer",
                    activeCategory === cat
                      ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/25"
                      : theme === "dark"
                      ? "text-[#a890a5] hover:text-white"
                      : "text-[#786175] hover:text-black"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Botones Laterales de Navegación */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollServicesSlider("left")}
                aria-label="Anterior servicio"
                className={cn(
                  "size-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95",
                  theme === "dark"
                    ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d] hover:bg-[#200d23]"
                    : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d] hover:bg-[#fdf7fa]"
                )}
              >
                <ChevronLeft className="size-5 text-[#d9487d]" />
              </button>
              <button
                type="button"
                onClick={() => scrollServicesSlider("right")}
                aria-label="Siguiente servicio"
                className={cn(
                  "size-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95",
                  theme === "dark"
                    ? "border-[#2b1328] bg-[#160918] text-white hover:border-[#d9487d] hover:bg-[#200d23]"
                    : "border-[#ebdce7] bg-white text-gray-800 hover:border-[#d9487d] hover:bg-[#fdf7fa]"
                )}
              >
                <ChevronRight className="size-5 text-[#d9487d]" />
              </button>
            </div>
          </div>
        </div>

        {/* Contenedor del Slider con Botones Flotantes Laterales */}
        <div className="relative group/slider">
          {/* Botón flotante izquierdo (desktop) */}
          <button
            type="button"
            onClick={() => scrollServicesSlider("left")}
            aria-label="Deslizar a la izquierda"
            className={cn(
              "hidden lg:flex absolute -left-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/slider:opacity-100",
              theme === "dark"
                ? "bg-[#18091a]/90 border-[#381636] text-[#d9487d]"
                : "bg-white/95 border-[#ebdce7] text-[#d9487d]"
            )}
          >
            <ChevronLeft className="size-6" />
          </button>

          {/* Track del Slider Horizontal */}
          <div
            ref={servicesSliderRef}
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
              <article
                key={service.id}
                className={cn(
                  "w-[85vw] max-w-[340px] sm:w-[370px] shrink-0 snap-start rounded-3xl border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl",
                  service.id === selectedServiceId
                    ? "border-[#d9487d] ring-2 ring-[#d9487d]/20"
                    : theme === "dark"
                    ? "border-[#2b1328] bg-[#130815]"
                    : "border-[#ebdce7] bg-white"
                )}
              >
                <div>
                  <div className="relative h-60 overflow-hidden bg-gray-100">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-85" />

                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[11px] font-bold tracking-wider uppercase text-[#f29ebb] border border-white/10">
                      {service.category}
                    </span>

                    {service.tag && (
                      <span className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#d9487d] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                        {service.tag}
                      </span>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <h3 className="font-display text-2xl font-normal leading-tight">{service.name}</h3>
                    <p
                      className={cn(
                        "text-xs sm:text-sm leading-relaxed line-clamp-3",
                        theme === "dark" ? "text-[#a890a5]" : "text-[#695365]"
                      )}
                    >
                      {service.description}
                    </p>

                    <ul
                      className={cn(
                        "space-y-2 pt-2 border-t",
                        theme === "dark" ? "border-[#261025]" : "border-[#ebdce7]"
                      )}
                    >
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2 text-xs">
                          <Check className="size-3.5 text-[#d9487d] shrink-0" />
                          <span className="truncate">{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div
                  className={cn(
                    "p-6 pt-0 flex items-center justify-between border-t mt-4",
                    theme === "dark" ? "border-[#261025]" : "border-[#ebdce7]"
                  )}
                >
                  <div>
                    <span className="text-[10px] text-current/60 uppercase tracking-wider block font-semibold">
                      Inversión
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold font-display">${service.price}</span>
                      <span className="text-xs text-current/60 font-mono">/ {service.duration} min</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectServiceAndScroll(service.id)}
                    className={cn(
                      "px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer",
                      service.id === selectedServiceId
                        ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/30"
                        : theme === "dark"
                        ? "bg-[#220d21] text-white hover:bg-[#d9487d]"
                        : "bg-[#fcedf5] text-[#b33261] hover:bg-[#d9487d] hover:text-white"
                    )}
                  >
                    {service.id === selectedServiceId ? "Seleccionado ✓" : "Agendar"}
                  </button>
                </div>
              </article>
            )))}
          </div>

          {/* Botón flotante derecho (desktop) */}
          <button
            type="button"
            onClick={() => scrollServicesSlider("right")}
            aria-label="Deslizar a la derecha"
            className={cn(
              "hidden lg:flex absolute -right-5 top-1/2 -translate-y-1/2 z-20 size-11 rounded-full border items-center justify-center backdrop-blur-md shadow-xl transition-all hover:scale-110 cursor-pointer opacity-0 group-hover/slider:opacity-100",
              theme === "dark"
                ? "bg-[#18091a]/90 border-[#381636] text-[#d9487d]"
                : "bg-white/95 border-[#ebdce7] text-[#d9487d]"
            )}
          >
            <ChevronRight className="size-6" />
          </button>
        </div>
      </section>

      {/* ─── SECCIÓN 3: EL RITUAL DE CREACIÓN ─── */}
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
                  theme === "dark"
                    ? "bg-[#140816] border-[#2b1328]"
                    : "bg-white border-[#ebdce7]"
                )}
              >
                <div>
                  <span className="font-display italic text-4xl font-light text-[#d9487d]/40 group-hover:text-[#d9487d] transition-colors block mb-4">
                    {step.num}
                  </span>
                  <h3 className="font-display text-xl font-medium mb-1">{step.title}</h3>
                  <p className="text-xs font-semibold text-[#d9487d] mb-3">{step.subtitle}</p>
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      theme === "dark" ? "text-[#a890a5]" : "text-[#695365]"
                    )}
                  >
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

      {/* ─── SECCIÓN 4: CALCULADORA / PERSONALIZADOR ─── */}
      <section id="personalizar" className="py-14 sm:py-20 lg:py-24 max-w-7xl mx-auto px-5 sm:px-8">
        <div
          className={cn(
            "rounded-3xl border p-8 sm:p-12 shadow-2xl relative overflow-hidden transition-colors",
            theme === "dark"
              ? "bg-gradient-to-br from-[#160918] via-[#120614] to-[#1c0b1e] border-[#3b1738]"
              : "bg-gradient-to-br from-[#ffffff] via-[#faf4f8] to-[#fceef5] border-[#ebdce7]"
          )}
        >
          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-5">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
                Calculadora Interactiva
              </span>
              <h2 className="font-display text-3xl sm:text-4xl font-light">
                Personaliza tu Cita a Medida
              </h2>
              <p
                className={cn(
                  "text-sm leading-relaxed",
                  theme === "dark" ? "text-[#b8a1b5]" : "text-[#695365]"
                )}
              >
                Selecciona complementos adicionales y obtén al instante el precio exacto y tiempo
                estimado antes de confirmar tu reserva.
              </p>

              <div className="space-y-3">
                <div
                  className={cn(
                    "p-4 rounded-2xl border flex items-center justify-between gap-4 transition-all",
                    theme === "dark"
                      ? "bg-[#0a050c] border-[#2b1328]"
                      : "bg-white border-[#ebdce7] shadow-sm"
                  )}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={selectedService?.image || classicImage}
                      alt=""
                      className="size-12 rounded-xl object-cover shrink-0 border border-current/10"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] uppercase font-bold text-[#d9487d] block">
                          Servicio Base
                        </span>
                        <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-current/10 text-current/70 uppercase">
                          {selectedService?.category}
                        </span>
                      </div>
                      <span className="font-semibold text-sm truncate block leading-tight mt-0.5">
                        {selectedService?.name || "Selecciona un servicio"}
                      </span>
                      <span className="text-[11px] text-current/60 font-mono">
                        {selectedService?.duration ?? 45} min
                      </span>
                    </div>
                  </div>
                  <span className="text-base font-bold text-[#d9487d] shrink-0">
                    ${selectedService?.price ?? 0}
                  </span>
                </div>

                {selectedLookbook && (
                  <div
                    className={cn(
                      "p-3.5 rounded-2xl border flex items-center justify-between gap-3 animate-in fade-in duration-200",
                      theme === "dark"
                        ? "bg-[#180a1a] border-[#3b1738]"
                        : "bg-[#fcf5f9] border-[#e9d5e3]"
                    )}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={selectedLookbook.image}
                        alt=""
                        className="size-11 rounded-xl object-cover shrink-0 border border-current/10"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] uppercase font-bold text-[#d9487d] block">
                            Inspiración Lookbook
                          </span>
                          <span className="text-[9px] px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 text-current/70">
                            {selectedLookbook.category}
                          </span>
                        </div>
                        <p className="font-semibold text-xs truncate leading-tight mt-0.5">
                          {selectedLookbook.title}
                        </p>
                        <p className="text-[10px] text-current/60 truncate">
                          {selectedLookbook.technique}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#d9487d] block">
                          Est. ${selectedLookbook.estimatedPrice}
                        </span>
                        <span className="text-[9px] text-current/60">
                          {selectedLookbook.durationBonus}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedLookbook(null)}
                        className="p-1 rounded-lg text-current/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                        title="Quitar diseño"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-6 space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-[#d9487d] block mb-2">
                Agrega Complementos a tu Sesión:
              </label>

              <div className="space-y-2.5">
                {ADDONS.map((addon) => {
                  const isChecked = selectedAddons.includes(addon.id);
                  return (
                    <button
                      key={addon.id}
                      type="button"
                      onClick={() => toggleAddon(addon.id)}
                      className={cn(
                        "w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between",
                        isChecked
                          ? theme === "dark"
                            ? "bg-[#250d23] border-[#d9487d] text-white shadow-md"
                            : "bg-[#fcedf5] border-[#d9487d] text-[#1d0f1c] shadow-sm"
                          : theme === "dark"
                          ? "bg-[#0f0612] border-[#261125] text-[#a890a5] hover:border-[#421b3e]"
                          : "bg-white border-[#ebdce7] text-[#695365] hover:border-[#d9487d]"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={cn(
                            "size-5 rounded-md border flex items-center justify-center transition-colors",
                            isChecked
                              ? "bg-[#d9487d] border-[#d9487d] text-white"
                              : "border-current/30 bg-transparent"
                          )}
                        >
                          {isChecked && <Check className="size-3.5" />}
                        </div>
                        <div>
                          <p className="text-xs font-semibold">{addon.name}</p>
                          <p className="text-[11px] text-current/60">{addon.description}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-bold text-[#d9487d] block">+${addon.price}</span>
                        <span className="text-[10px] text-current/60">+{addon.duration} min</span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className={cn(
                  "pt-4 flex items-center justify-between border-t",
                  theme === "dark" ? "border-[#2a1327]" : "border-[#ebdce7]"
                )}
              >
                <div>
                  <span className="text-xs text-current/60 block">Total Estimado:</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-bold">${calculatedTotal}</span>
                    <span className="text-xs text-[#d9487d] font-mono">({calculatedDuration} min)</span>
                  </div>
                </div>

                <a
                  href="#reserva"
                  className="px-6 py-2.5 rounded-full bg-[#d9487d] hover:bg-[#e8709a] text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  Continuar a la Cita →
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SECCIÓN 5: MOTOR DE RESERVA ─── */}
      <section
        id="reserva"
        className={cn(
          "py-14 sm:py-20 lg:py-24 border-t scroll-mt-20 transition-colors",
          theme === "dark" ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8 md:mb-16 space-y-3">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">
              Confirmación Inmediata
            </span>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light">
              Reserva tu Cita en Línea
            </h2>
            <p className={cn("text-sm", theme === "dark" ? "text-[#a890a5]" : "text-[#695365]")}>
              Selecciona tu día y franja horaria. Sin cargos adelantados ni esperas de confirmación.
            </p>
          </div>

          {status === "success" ? (
            <div
              className={cn(
                "max-w-lg mx-auto p-8 sm:p-10 rounded-3xl border text-center space-y-6 animate-in zoom-in-95",
                theme === "dark"
                  ? "bg-[#140816] border-[#381635]"
                  : "bg-white border-[#ebdce7] shadow-xl"
              )}
            >
              <div className="size-16 rounded-full bg-gradient-to-tr from-[#d9487d] to-[#f29ebb] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#d9487d]/30">
                <CheckCircle2 className="size-8" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-widest text-[#d9487d]">
                  ¡Cita Reservada con Éxito!
                </span>
                <h3 className="font-display text-3xl font-light">Te esperamos, {name}</h3>
                <p className="text-xs text-current/70">
                  Enviamos el comprobante a <strong className="font-bold">{email}</strong>.
                </p>
              </div>

              <div
                className={cn(
                  "p-4 rounded-2xl border text-left space-y-2.5 text-xs",
                  theme === "dark"
                    ? "bg-[#0a050c] border-[#261025]"
                    : "bg-[#faf4f8] border-[#ebdce7]"
                )}
              >
                <div className="flex justify-between text-current/70">
                  <span>Localizador:</span>
                  <span className="font-mono font-bold text-[#d9487d]">{bookingCode}</span>
                </div>
                <div className="flex justify-between text-current/70">
                  <span>Servicio:</span>
                  <span className="font-semibold">{selectedService?.name || "Tratamiento"}</span>
                </div>
                <div className="flex justify-between text-current/70">
                  <span>Fecha &amp; Hora:</span>
                  <span className="font-semibold text-[#d9487d]">
                    {selectedDate} a las {selectedTime}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-current/10">
                  <span>Total estimado a pagar en estudio:</span>
                  <span className="font-bold text-sm">${calculatedTotal}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setStatus("idle");
                  setName("");
                  setEmail("");
                  setPhone("");
                  setNotes("");
                }}
                className="px-8 py-3 rounded-full bg-[#d9487d] text-white hover:bg-[#e8709a] text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Agendar otra cita
              </button>
            </div>
          ) : (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div
                className={cn(
                  "lg:col-span-7 space-y-6 p-6 sm:p-8 rounded-3xl border",
                  theme === "dark"
                    ? "bg-[#140816] border-[#2b1328]"
                    : "bg-white border-[#ebdce7] shadow-sm"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-[#d9487d]" />
                      <span>1. Resumen de tu Servicio</span>
                    </label>
                    <a
                      href="#servicios"
                      className="text-xs font-semibold text-[#d9487d] hover:underline"
                    >
                      Cambiar servicio
                    </a>
                  </div>

                  <div
                    className={cn(
                      "p-4 sm:p-5 rounded-2xl border transition-all space-y-3.5",
                      theme === "dark"
                        ? "bg-[#0a050c] border-[#261025]"
                        : "bg-[#faf4f8] border-[#ebdce7]"
                    )}
                  >
                    {/* Fila 1: Servicio Base */}
                    <div className="flex items-center gap-4">
                      <img
                        src={selectedService?.image || classicImage}
                        alt=""
                        className="size-16 rounded-xl object-cover shrink-0 border border-current/10"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#d9487d]/15 text-[#d9487d] border border-[#d9487d]/20">
                            {selectedService?.category || "Manicura"}
                          </span>
                          {selectedService?.tag && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-current/10 text-current/70">
                              {selectedService.tag}
                            </span>
                          )}
                        </div>
                        <h4 className="font-display text-base sm:text-lg font-medium truncate mt-0.5">
                          {selectedService?.name || "Selecciona un servicio"}
                        </h4>
                        <p className="text-xs text-current/60">
                          {selectedService?.duration ?? 45} min ·{" "}
                          <strong className="text-[#d9487d] font-bold">${selectedService?.price ?? 0}</strong>
                        </p>
                      </div>
                    </div>

                    {/* Fila 2: Diseño de Referencia Lookbook (si fue seleccionado) */}
                    {selectedLookbook && (
                      <div
                        className={cn(
                          "p-3 rounded-xl border flex items-center justify-between gap-3",
                          theme === "dark"
                            ? "bg-[#180a1a] border-[#381635]"
                            : "bg-white border-[#ebdce7]"
                        )}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={selectedLookbook.image}
                            alt=""
                            className="size-12 rounded-lg object-cover shrink-0 border border-current/10"
                          />
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#d9487d] block">
                              Diseño Lookbook de Referencia
                            </span>
                            <p className="text-xs font-semibold truncate leading-tight mt-0.5">
                              {selectedLookbook.title} ({selectedLookbook.category})
                            </p>
                            <p className="text-[10px] text-current/60 truncate">
                              {selectedLookbook.technique}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <div className="text-right">
                            <span className="text-xs font-bold text-[#d9487d] block">
                              Est. ${selectedLookbook.estimatedPrice}
                            </span>
                            <span className="text-[10px] text-current/60 font-mono">
                              {selectedLookbook.durationBonus}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSelectedLookbook(null)}
                            className="p-1 rounded-md text-current/40 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                            title="Quitar diseño de referencia"
                          >
                            <X className="size-4" />
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Fila 3: Complementos / Addons seleccionados */}
                    {selectedAddons.length > 0 && (
                      <div className="pt-2 border-t border-current/10 space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-current/70 text-[11px]">
                            Complementos Adicionales ({selectedAddons.length}):
                          </span>
                          <a href="#personalizar" className="text-[11px] text-[#d9487d] hover:underline">
                            + Modificar extras
                          </a>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedAddons.map((id) => {
                            const add = ADDONS.find((a) => a.id === id);
                            if (!add) return null;
                            return (
                              <span
                                key={id}
                                className={cn(
                                  "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs border",
                                  theme === "dark"
                                    ? "bg-[#18091a] border-[#2b1229] text-white"
                                    : "bg-white border-[#ecdde8] text-[#1d0f1c]"
                                )}
                              >
                                <span>{add.name}</span>
                                <span className="text-[#d9487d] font-bold">+${add.price}</span>
                                <button
                                  type="button"
                                  onClick={() => toggleAddon(id)}
                                  className="text-current/40 hover:text-rose-400 cursor-pointer ml-0.5"
                                  title="Quitar complemento"
                                >
                                  <X className="size-3" />
                                </button>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Fila 4: Total y Tiempo General */}
                    <div className="pt-2.5 border-t border-current/10 flex items-center justify-between text-xs">
                      <span className="text-current/60 font-medium">Tiempo e Inversión Total:</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-current/60 font-mono text-xs">
                          {calculatedDuration} min ·
                        </span>
                        <span className="font-display text-base font-bold text-[#d9487d]">
                          ${calculatedTotal}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">
                    2. Fecha de la Cita
                  </label>
                  <div className="grid grid-cols-7 gap-1 sm:gap-2 w-full">
                    {availableDates.map((d) => (
                      <button
                        key={d.fullDate}
                        type="button"
                        onClick={() => setSelectedDate(d.fullDate)}
                        className={cn(
                          "py-2.5 sm:py-3 px-1 sm:px-2 rounded-xl sm:rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-0.5 sm:gap-1 cursor-pointer min-w-0 w-full",
                          selectedDate === d.fullDate
                            ? "bg-[#d9487d] border-[#d9487d] text-white shadow-lg shadow-[#d9487d]/20 scale-[1.03] font-bold"
                            : theme === "dark"
                            ? "bg-[#0a050c] border-[#261025] text-[#a890a5] hover:border-[#421b3e] hover:text-white"
                            : "bg-[#faf4f8] border-[#ebdce7] text-[#695365] hover:border-[#d9487d] hover:text-black"
                        )}
                      >
                        <span className="text-[9px] sm:text-[10px] md:text-xs uppercase font-bold tracking-tight truncate w-full text-center">
                          <span className="hidden sm:inline">{d.label}</span>
                          <span className="sm:hidden">{d.shortLabel}</span>
                        </span>
                        <span className="font-display text-xs sm:text-base md:text-lg font-bold leading-none">
                          {d.dateNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-[#d9487d] block mb-2">
                    3. Franja Horaria
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5 sm:gap-2 w-full">
                    {TIME_SLOTS.map((slot) => {
                      if (!slot.available) {
                        return (
                          <div
                            key={slot.time}
                            className="py-2.5 px-1 sm:px-2 rounded-xl border border-current/10 text-current/30 text-[11px] sm:text-xs font-mono text-center line-through cursor-not-allowed flex items-center justify-center"
                          >
                            {slot.time}
                          </div>
                        );
                      }

                      const isSelected = selectedTime === slot.time;
                      return (
                        <button
                          key={slot.time}
                          type="button"
                          onClick={() => setSelectedTime(slot.time)}
                          className={cn(
                            "py-2.5 px-1 sm:px-2 rounded-xl border text-[11px] sm:text-xs font-mono font-semibold transition-all text-center flex items-center justify-center cursor-pointer",
                            isSelected
                              ? "bg-[#d9487d] border-[#d9487d] text-white font-bold shadow-md shadow-[#d9487d]/20 scale-[1.02]"
                              : theme === "dark"
                              ? "bg-[#0a050c] border-[#261025] text-white hover:border-[#d9487d]"
                              : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] hover:border-[#d9487d]"
                          )}
                        >
                          {slot.time}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div
                className={cn(
                  "lg:col-span-5 p-6 sm:p-8 rounded-3xl border",
                  theme === "dark"
                    ? "bg-[#140816] border-[#2b1328]"
                    : "bg-white border-[#ebdce7] shadow-sm"
                )}
              >
                <h3 className="font-display text-2xl font-light mb-6">Datos de Reserva</h3>

                <form onSubmit={handleSubmitBooking} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-current/70 block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Valentina Rivas"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]",
                        theme === "dark"
                          ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
                          : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-current/70 block mb-1">
                      Correo Electrónico *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tu@correo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]",
                        theme === "dark"
                          ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
                          : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-current/70 block mb-1">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+58 412 000 0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d]",
                        theme === "dark"
                          ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
                          : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400"
                      )}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-current/70 block mb-1">
                      Notas especiales
                    </label>
                    <textarea
                      rows={2}
                      placeholder="¿Tienes retiro de esmalte anterior o un diseño específico?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className={cn(
                        "w-full px-4 py-3 rounded-xl border text-sm focus:outline-none focus:border-[#d9487d] resize-none",
                        theme === "dark"
                          ? "bg-[#0a050c] border-[#261025] text-white placeholder:text-[#523b4f]"
                          : "bg-[#faf4f8] border-[#ebdce7] text-[#1d0f1c] placeholder:text-zinc-400"
                      )}
                    />
                  </div>

                  <div
                    className={cn(
                      "p-3.5 rounded-xl border text-xs space-y-1.5",
                      theme === "dark"
                        ? "bg-[#0a050c] border-[#261025]"
                        : "bg-[#faf4f8] border-[#ebdce7]"
                    )}
                  >
                    <div className="flex justify-between text-current/70">
                      <span>Día &amp; Hora:</span>
                      <span className="font-semibold">
                        {selectedDate} · {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold pt-1.5 border-t border-current/10">
                      <span>Total:</span>
                      <span className="text-[#d9487d]">${calculatedTotal}</span>
                    </div>
                  </div>

                  {rateLimitError && (
                    <div className="flex items-center gap-2.5 p-3.5 rounded-xl border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs font-medium leading-relaxed">
                      <AlertCircle className="size-4 text-rose-400 shrink-0" />
                      <span>{rateLimitError}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="w-full py-4 rounded-full bg-gradient-to-r from-[#d9487d] to-[#f29ebb] text-white font-bold text-sm uppercase tracking-wider shadow-lg shadow-[#d9487d]/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {status === "submitting" ? "Apartando tu lugar..." : `Confirmar Cita · $${calculatedTotal}`}
                  </button>

                  <p className="text-[10px] text-current/50 text-center">
                    Pagas cómodamente en el estudio al terminar tu sesión.
                  </p>
                </form>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── SECCIÓN 6: FAQ INTERACTIVO CON ANIMACIONES ─── */}
      <section id="faq" className="relative py-14 sm:py-20 lg:py-24 max-w-4xl mx-auto px-5 sm:px-8 overflow-hidden">
        {/* Glow ambiental de fondo */}
        <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#d9487d]/10 rounded-full blur-3xl" />

        <div className="relative text-center mb-8 md:mb-14 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase bg-[#d9487d]/10 text-[#d9487d] border border-[#d9487d]/20 shadow-sm backdrop-blur-xs">
            <Sparkles className="size-3.5 animate-pulse text-[#d9487d]" />
            <span>Claridad &amp; Confianza</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-tight">
            Preguntas Frecuentes
          </h2>
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
                    ? theme === "dark"
                      ? "border-[#d9487d]/50 bg-[#160819] shadow-lg shadow-[#d9487d]/5 ring-1 ring-[#d9487d]/20"
                      : "border-[#d9487d]/40 bg-white shadow-lg shadow-[#d9487d]/8 ring-1 ring-[#d9487d]/15"
                    : theme === "dark"
                      ? "border-[#261025] bg-[#120714]/90 hover:border-[#401a3d] hover:bg-[#150918] hover:-translate-y-0.5 hover:shadow-md"
                      : "border-[#ebdce7] bg-white/95 hover:border-[#dab8d4] hover:bg-white hover:-translate-y-0.5 hover:shadow-md"
                )}
              >
                {/* Línea de acento animada al expandirse */}
                <div
                  className={cn(
                    "absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#d9487d] via-[#e66c98] to-[#d9487d] transition-transform duration-300 ease-out origin-top",
                    isOpen ? "scale-y-100" : "scale-y-0"
                  )}
                />

                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="w-full px-6 py-5 sm:py-5.5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
                >
                  <span
                    className={cn(
                      "font-medium text-sm sm:text-base tracking-tight transition-colors duration-200",
                      isOpen
                        ? "text-[#d9487d] font-semibold"
                        : "text-current group-hover:text-[#d9487d]"
                    )}
                  >
                    {faq.question}
                  </span>

                  {/* Indicador animado rotatorio */}
                  <div
                    className={cn(
                      "size-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                      isOpen
                        ? "bg-[#d9487d] text-white rotate-180 shadow-md shadow-[#d9487d]/30 scale-105"
                        : theme === "dark"
                          ? "bg-[#220c22] text-[#d9487d] group-hover:bg-[#d9487d]/20 group-hover:scale-105"
                          : "bg-[#faeff5] text-[#d9487d] group-hover:bg-[#d9487d]/15 group-hover:scale-105"
                    )}
                  >
                    <ChevronDown className="size-4 transition-transform duration-300" />
                  </div>
                </button>

                {/* Acordeón con animación fluida de altura usando CSS Grid */}
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div
                      className={cn(
                        "px-6 pb-6 pt-1 text-xs sm:text-sm leading-relaxed border-t transition-all duration-300",
                        isOpen
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 -translate-y-2 pointer-events-none",
                        theme === "dark"
                          ? "text-[#a890a5] border-[#250d25]"
                          : "text-[#695365] border-[#f2e2ec]"
                      )}
                    >
                      <p className="pt-2">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tarjeta de soporte / dudas directas */}
        <div
          className={cn(
            "mt-10 p-5 sm:p-6 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row items-center justify-between gap-4",
            theme === "dark"
              ? "border-[#261025] bg-[#120714]/80 backdrop-blur-xs"
              : "border-[#ebdce7] bg-[#fdf9fb] backdrop-blur-xs"
          )}
        >
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold tracking-tight">¿Tienes alguna pregunta especial o solicitud de diseño bespoke?</p>
            <p className="text-xs text-current/60 mt-0.5">Escríbenos directamente y nuestro equipo te asesorará de inmediato.</p>
          </div>
          <a
            href="https://wa.me/?text=Hola%20Lumiere%20Nails,%20tengo%20una%20consulta"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-[#d9487d] hover:bg-[#c23b6c] text-white shadow-md shadow-[#d9487d]/20 hover:shadow-lg hover:shadow-[#d9487d]/30 hover:-translate-y-0.5 transition-all duration-200 shrink-0"
          >
            <span>Consultar por WhatsApp</span>
            <ArrowRight className="size-3.5" />
          </a>
        </div>
      </section>

      {/* ─── FOOTER MINIMALISTA DE LUJO ─── */}
      <footer
        className={cn(
          "py-12 border-t text-xs transition-colors",
          theme === "dark"
            ? "bg-[#060307] border-[#1a0b1a] text-[#705a6e]"
            : "bg-[#f5ecf3] border-[#ebdce7] text-[#786175]"
        )}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="font-display italic text-lg font-bold">Lumière Nails</span>
          </div>

          <p>© {new Date().getFullYear()} Lumière Nails Studio. Belleza y devoción en cada detalle.</p>

          <div className="flex items-center gap-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-colors",
                theme === "dark"
                  ? "bg-[#160918] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
                  : "bg-white text-[#b33261] hover:bg-[#d9487d] hover:text-white shadow-sm"
              )}
              aria-label="Instagram"
            >
              <Instagram className="size-4" />
            </a>
            <a
              href="mailto:hola@lumierenails.com"
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-colors",
                theme === "dark"
                  ? "bg-[#160918] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
                  : "bg-white text-[#b33261] hover:bg-[#d9487d] hover:text-white shadow-sm"
              )}
              aria-label="Correo"
            >
              <Mail className="size-4" />
            </a>
            <a
              href="tel:+584120000000"
              className={cn(
                "size-8 rounded-full flex items-center justify-center transition-colors",
                theme === "dark"
                  ? "bg-[#160918] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
                  : "bg-white text-[#b33261] hover:bg-[#d9487d] hover:text-white shadow-sm"
              )}
              aria-label="Teléfono"
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* ─── MODAL DE PREVIEW LOOKBOOK ─── */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20"
              aria-label="Cerrar"
            >
              <X className="size-5" />
            </button>
            <img
              src={previewImage}
              alt="Detalle de diseño"
              className="w-full rounded-2xl border border-white/20 shadow-2xl object-cover aspect-[4/3]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
