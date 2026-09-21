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
    question: "¿Cómo reservo mi cita en línea?",
    answer:
      "Elige tu servicio en el catálogo, selecciona el día y la franja horaria disponible, y completa tus datos de contacto. Recibirás la confirmación al instante por correo, sin necesidad de pagar por adelantado.",
  },
  {
    question: "¿Cuál es la política de cancelación o reprogramación?",
    answer:
      "Puedes reprogramar o cancelar tu cita hasta 12 horas antes sin ningún cargo, escribiéndonos por WhatsApp con tu código de reserva. Las cancelaciones fuera de este plazo pueden requerir un nuevo agendamiento según disponibilidad.",
  },
  {
    question: "¿Qué medidas de bioseguridad manejan en el estudio?",
    answer:
      "Todo nuestro instrumental se esteriliza en autoclave entre cada clienta, usamos limas y buffers desechables por sesión, y nuestras especialistas trabajan con guantes y superficies desinfectadas en cada estación.",
  },
  {
    question: "¿Qué formas de pago aceptan?",
    answer:
      "Aceptas pagar cómodamente en el estudio al finalizar tu sesión, con efectivo, pago móvil, transferencia o tarjeta. La reserva en línea no requiere adelanto ni tarjeta registrada.",
  },
  {
    question: "¿Cuánto duran los diseños de nail art o extensiones?",
    answer:
      "En promedio una extensión de gel dura entre 3 y 4 semanas con el mantenimiento adecuado, y una manicura clásica entre 2 y 3 semanas. Cada especialista te recomendará el retoque ideal según tu tipo de uña.",
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
