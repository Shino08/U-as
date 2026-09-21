import { useState, useMemo } from "react";
import { Navbar } from "@/components/Navbar";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";
import { getUpcomingDates } from "./utils/dates";
import { TIME_SLOTS } from "./constants";
import { useLandingData } from "./hooks/useLandingData";
import { useBooking } from "./hooks/useBooking";
import { HeroSpotlight } from "./components/HeroSpotlight";
import { LookbookSection } from "./components/LookbookSection";
import { ServicesSection } from "./components/ServicesSection";
import { RitualSection } from "./components/RitualSection";
import { NailArtLabSection } from "./components/NailArtLabSection";
import { BookingSection } from "./components/BookingSection";
import { FaqSection } from "./components/FaqSection";
import { FooterSection } from "./components/FooterSection";
import { LookbookModal } from "./components/LookbookModal";

export function LandingPage() {
  const { theme } = useTheme();
  const availableDates = useMemo(() => getUpcomingDates(), []);
  const defaultDate = availableDates[0]?.fullDate || "2026-09-18";
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const landingData = useLandingData();
  const booking = useBooking(landingData.servicesList, defaultDate);

  return (
    <div
      className={cn(
        "min-h-screen font-sans antialiased selection:bg-[#d9487d]/35 selection:text-white transition-colors duration-300 overflow-x-hidden",
        theme === "dark" ? "bg-[#0a050c] text-[#f8f2f6]" : "bg-[#faf6f9] text-[#1d0f1c]"
      )}
    >
      <Navbar />
      <HeroSpotlight />
      <LookbookSection
        lookbookList={landingData.lookbookList}
        selectedLookbook={booking.selectedLookbook}
        onSelectLookbookStyle={booking.handleSelectLookbookStyle}
        onPreviewImage={setPreviewImage}
      />
      <ServicesSection
        filteredServices={landingData.filteredServices}
        selectedServiceId={booking.selectedServiceId}
        activeCategory={landingData.activeCategory}
        availableCategories={landingData.availableCategories}
        sliderRef={landingData.servicesSliderRef}
        onSelectService={booking.handleSelectServiceAndScroll}
        onCategoryChange={landingData.handleCategoryChange}
        onScrollSlider={landingData.scrollServicesSlider}
      />
      <RitualSection />
      <NailArtLabSection
        selectedService={booking.selectedService}
        selectedLookbook={booking.selectedLookbook}
        onClearLookbook={() => booking.setSelectedLookbook(null)}
        selectedAddons={booking.selectedAddons}
        onToggleAddon={booking.toggleAddon}
        calculatedTotal={booking.calculatedTotal}
        calculatedDuration={booking.calculatedDuration}
      />
      <BookingSection
        booking={booking}
        availableDates={availableDates}
        timeSlots={TIME_SLOTS}
      />
      <FaqSection />
      <FooterSection />
      <LookbookModal previewImage={previewImage} onClose={() => setPreviewImage(null)} />
    </div>
  );
}

export default LandingPage;
