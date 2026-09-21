import { useState, useMemo, useEffect, type FormEvent } from "react";
import type { Service, LookbookItem } from "../types";
import { ADDONS } from "../constants";

export function useBooking(servicesList: Service[], defaultDate: string) {
  const [selectedServiceId, setSelectedServiceId] = useState<string>("");
  const [selectedLookbook, setSelectedLookbook] = useState<LookbookItem | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(defaultDate);
  const [selectedTime, setSelectedTime] = useState<string>("02:00 PM");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [bookingCode, setBookingCode] = useState<string>("");

  useEffect(() => {
    if (!selectedServiceId && servicesList.length > 0) {
      setSelectedServiceId(servicesList[0].id);
    }
  }, [servicesList, selectedServiceId]);

  const selectedService = useMemo(
    () => servicesList.find((s) => s.id === selectedServiceId) ?? servicesList[0],
    [selectedServiceId, servicesList]
  );

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]));
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
    document.getElementById("reserva")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSelectLookbookStyle = (item: LookbookItem) => {
    if (selectedLookbook?.id === item.id) {
      setSelectedLookbook(null);
      return;
    }
    setSelectedLookbook(item);
    const nameMatch = servicesList.find((s) => s.name.toLowerCase().trim() === item.title.toLowerCase().trim());
    const categoryMatch = servicesList.find((s) => s.category.toLowerCase().trim() === item.category.toLowerCase().trim());
    if (nameMatch) {
      setSelectedServiceId(nameMatch.id);
    } else if (categoryMatch) {
      setSelectedServiceId(categoryMatch.id);
    }
    (document.getElementById("reserva") || document.getElementById("personalizar"))?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmitBooking = async (e: FormEvent) => {
    e.preventDefault();
    setRateLimitError(null);

    const lastAttempt = localStorage.getItem("lumiere_last_booking_time");
    const now = Date.now();
    if (lastAttempt && now - Number(lastAttempt) < 15000) {
      const waitSec = Math.ceil((15000 - (now - Number(lastAttempt))) / 1000);
      setRateLimitError(`Por favor espera ${waitSec} segundos antes de enviar otra solicitud.`);
      return;
    }

    setStatus("submitting");
    const newCode = `LUM-${Math.floor(1000 + Math.random() * 9000)}`;
    const fullNotes = [
      selectedLookbook ? `[Diseño Lookbook: ${selectedLookbook.title} (${selectedLookbook.category})]` : "",
      notes,
    ].filter(Boolean).join(" · ");

    const newAppointment = {
      id: `apt-${Date.now()}`,
      bookingCode: newCode,
      serviceId: selectedService ? (isNaN(Number(selectedService.id)) ? 1 : Number(selectedService.id)) : 1,
      serviceName: selectedService?.name || "Tratamiento Personalizado",
      clientName: name, customerName: name,
      clientEmail: email, customerEmail: email,
      clientPhone: phone, customerPhone: phone,
      notes: fullNotes, customerNotes: fullNotes,
      totalPrice: calculatedTotal,
      appointmentDate: selectedDate, appointmentTime: selectedTime,
      date: new Date(`${selectedDate} ${selectedTime.replace(" AM", ":00").replace(" PM", ":00")}`),
      addons: selectedAddons,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem("lumiere_admin_appointments");
      const list = existing ? JSON.parse(existing) : [];
      localStorage.setItem("lumiere_admin_appointments", JSON.stringify([newAppointment, ...list]));
    } catch {
      // ignore
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
        setRateLimitError(data.error || "Has superado el límite. Por favor espera unos minutos.");
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
      localStorage.setItem("lumiere_last_booking_time", String(now));
      setBookingCode(newCode);
      setStatus("success");
    }
  };

  const resetBooking = () => {
    setStatus("idle"); setName(""); setEmail(""); setPhone(""); setNotes("");
  };

  return {
    selectedServiceId, setSelectedServiceId, selectedService,
    selectedLookbook, setSelectedLookbook, selectedAddons, toggleAddon,
    selectedDate, setSelectedDate, selectedTime, setSelectedTime,
    name, setName, email, setEmail, phone, setPhone, notes, setNotes,
    rateLimitError, status, bookingCode, calculatedTotal, calculatedDuration,
    handleSelectServiceAndScroll, handleSelectLookbookStyle,
    handleSubmitBooking, resetBooking,
  };
}
