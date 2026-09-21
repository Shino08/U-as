import classicImage from "@/assets/service-classic.jpg";
import artImage from "@/assets/service-art.jpg";
import gelImage from "@/assets/service-gel.jpg";
import chromeImage from "@/assets/lookbook-chrome.jpg";
import cateyeImage from "@/assets/lookbook-cateye.jpg";
import heroImage from "@/assets/lumiere-hero.jpg";
import spotlightImage from "@/assets/hero-spotlight.jpg";

export const IMAGE_MAP: Record<string, string> = {
  "service-classic.jpg": classicImage,
  "service-art.jpg": artImage,
  "service-gel.jpg": gelImage,
  "lookbook-chrome.jpg": chromeImage,
  "lookbook-cateye.jpg": cateyeImage,
  "lumiere-hero.jpg": heroImage,
  "hero-spotlight.jpg": spotlightImage,
  "/service-classic.jpg": classicImage,
  "/service-art.jpg": artImage,
  "/service-gel.jpg": gelImage,
  "/lookbook-chrome.jpg": chromeImage,
  "/lookbook-cateye.jpg": cateyeImage,
  "/lumiere-hero.jpg": heroImage,
  "/hero-spotlight.jpg": spotlightImage,
};

export const PRESET_IMAGES = [
  { id: "service-classic.jpg", label: "Manicura Rusa Classic", src: classicImage },
  { id: "service-art.jpg", label: "Nail Art 3D Signature", src: artImage },
  { id: "service-gel.jpg", label: "Extensiones Hard Gel", src: gelImage },
  { id: "lookbook-chrome.jpg", label: "Glazed Pearl Chrome", src: chromeImage },
  { id: "lookbook-cateye.jpg", label: "Velvet Mauve Cat-Eye", src: cateyeImage },
  { id: "lumiere-hero.jpg", label: "Lumière Editorial Studio", src: heroImage },
];

export function resolveImage(img?: string | null): string {
  if (!img) return classicImage;
  if (IMAGE_MAP[img]) return IMAGE_MAP[img];
  if (img.startsWith("http://") || img.startsWith("https://") || img.startsWith("data:")) {
    return img;
  }
  if (img.startsWith("/uploads/")) {
    const backendUrl = import.meta.env.VITE_API_URL?.replace("/api", "") || "http://localhost:3000";
    return `${backendUrl}${img}`;
  }
  return `/${img.replace(/^\//, "")}`;
}
