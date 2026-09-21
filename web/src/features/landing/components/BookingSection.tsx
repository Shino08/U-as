import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import type { LandingDate, TimeSlot } from "../types";
import type { useBooking } from "../hooks/useBooking";
import { BookingSuccess } from "./BookingSuccess";
import { BookingSummary } from "./BookingSummary";
import { BookingSchedule } from "./BookingSchedule";
import { BookingForm } from "./BookingForm";

interface BookingSectionProps {
  booking: ReturnType<typeof useBooking>;
  availableDates: LandingDate[];
  timeSlots: TimeSlot[];
}

export function BookingSection({ booking, availableDates, timeSlots }: BookingSectionProps) {
  const { theme } = useTheme();

  return (
    <section id="reserva" className={cn("py-14 sm:py-20 lg:py-24 border-t scroll-mt-20 transition-colors", theme === "dark" ? "bg-[#0e0610] border-[#261226]" : "bg-[#f5eef4] border-[#ebdce7]")}>
      <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-8 md:mb-14 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#d9487d]">Confirmación Inmediata</span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light">Reserva tu Cita en Línea</h2>
          <p className={cn("text-sm", theme === "dark" ? "text-[#a890a5]" : "text-[#695365]")}>
            Selecciona tu día y franja horaria. Sin cargos adelantados ni esperas de confirmación.
          </p>
        </div>

        {booking.status === "success" ? (
          <BookingSuccess
            name={booking.name} email={booking.email} bookingCode={booking.bookingCode}
            serviceName={booking.selectedService?.name} selectedDate={booking.selectedDate}
            selectedTime={booking.selectedTime} calculatedTotal={booking.calculatedTotal}
            onReset={booking.resetBooking}
          />
        ) : (
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-start">
            <div className="space-y-6">
              <BookingSummary
                selectedService={booking.selectedService}
                selectedLookbook={booking.selectedLookbook}
                onClearLookbook={() => booking.setSelectedLookbook(null)}
                selectedAddons={booking.selectedAddons}
                onToggleAddon={booking.toggleAddon}
                calculatedTotal={booking.calculatedTotal}
                calculatedDuration={booking.calculatedDuration}
              />
              <BookingSchedule
                availableDates={availableDates}
                selectedDate={booking.selectedDate}
                onSelectDate={booking.setSelectedDate}
                timeSlots={timeSlots}
                selectedTime={booking.selectedTime}
                onSelectTime={booking.setSelectedTime}
              />
            </div>
            <div>
              <BookingForm
                name={booking.name}
                onChangeName={booking.setName}
                email={booking.email}
                onChangeEmail={booking.setEmail}
                phone={booking.phone}
                onChangePhone={booking.setPhone}
                notes={booking.notes}
                onChangeNotes={booking.setNotes}
                selectedDate={booking.selectedDate}
                selectedTime={booking.selectedTime}
                calculatedTotal={booking.calculatedTotal}
                rateLimitError={booking.rateLimitError}
                isSubmitting={booking.status === "submitting"}
                onSubmit={booking.handleSubmitBooking}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
