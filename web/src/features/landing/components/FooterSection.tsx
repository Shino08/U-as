import { Instagram, Mail, Phone } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

export function FooterSection() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const iconBtnClass = cn(
    "size-8 rounded-full flex items-center justify-center transition-colors",
    isDark
      ? "bg-[#160918] text-[#f29ebb] hover:bg-[#d9487d] hover:text-white"
      : "bg-white text-[#b33261] hover:bg-[#d9487d] hover:text-white shadow-sm"
  );

  return (
    <footer
      className={cn(
        "py-12 border-t text-xs transition-colors",
        isDark ? "bg-[#060307] border-[#1a0b1a] text-[#705a6e]" : "bg-[#f5ecf3] border-[#ebdce7] text-[#786175]"
      )}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <span className="font-display italic text-lg font-bold">Lumière Nails</span>
        </div>

        <p>© {new Date().getFullYear()} Lumière Nails Studio. Belleza y devoción en cada detalle.</p>

        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className={iconBtnClass} aria-label="Instagram">
            <Instagram className="size-4" />
          </a>
          <a href="mailto:hola@lumierenails.com" className={iconBtnClass} aria-label="Correo">
            <Mail className="size-4" />
          </a>
          <a href="tel:+584120000000" className={iconBtnClass} aria-label="Teléfono">
            <Phone className="size-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
