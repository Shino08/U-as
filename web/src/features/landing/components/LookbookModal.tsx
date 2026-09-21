import { X } from "lucide-react";

interface LookbookModalProps {
  previewImage: string | null;
  onClose: () => void;
}

export function LookbookModal({ previewImage, onClose }: LookbookModalProps) {
  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 sm:-top-12 sm:right-0 size-11 rounded-full bg-black/60 sm:bg-white/10 text-white flex items-center justify-center hover:bg-black/80 sm:hover:bg-white/20 cursor-pointer shadow-lg z-10"
          aria-label="Cerrar modal"
        >
          <X className="size-5" />
        </button>
        <img
          src={previewImage}
          alt="Detalle de diseño"
          className="w-full rounded-2xl border border-white/20 shadow-2xl object-contain max-h-[85vh]"
        />
      </div>
    </div>
  );
}
