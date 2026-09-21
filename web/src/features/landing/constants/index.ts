import type { AddOn, FAQItem, RitualStep, TimeSlot } from "../types";

export const ADDONS: AddOn[] = [
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

export const RITUAL_STEPS: RitualStep[] = [
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

export const FAQS: FAQItem[] = [
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

export const TIME_SLOTS: TimeSlot[] = [
  { time: "10:30 AM", available: true },
  { time: "12:00 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "03:45 PM", available: true },
  { time: "05:15 PM", available: true },
  { time: "06:45 PM", available: true },
];
