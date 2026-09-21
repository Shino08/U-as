import { X } from "lucide-react";

interface LookbookModalProps {
  previewImage: string | null;
  onClose: () => void;
}

export function LookbookModal({ previewImage, onClose }: LookbookModalProps) {
  if (!previewImage) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in"
      onClick={onClose}
    >
      <div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-12 right-0 size-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/20 cursor-pointer"
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
  );
}
