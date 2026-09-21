import { useState, useEffect, useMemo, useRef } from "react";
import classicImage from "@/assets/service-classic.jpg";
import chromeImage from "@/assets/lookbook-chrome.jpg";
import { resolveImage } from "@/lib/images";
import type { Service, LookbookItem } from "../types";

export function useLandingData() {
  const [servicesList, setServicesList] = useState<Service[]>([]);
  const [lookbookList, setLookbookList] = useState<LookbookItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("Todos");
  const servicesSliderRef = useRef<HTMLDivElement>(null);

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
            const mapped: Service[] = data.map((s) => ({
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
        console.error("Error fetching landing data:", err);
      }
    };

    fetchData();
  }, []);

  const availableCategories = useMemo(() => {
    const cats = new Set<string>(["Todos"]);
    servicesList.forEach((s) => {
      if (s.category) cats.add(s.category);
    });
    return Array.from(cats);
  }, [servicesList]);

  const filteredServices = useMemo(() => {
    if (activeCategory === "Todos") return servicesList;
    return servicesList.filter((s) => s.category === activeCategory);
  }, [activeCategory, servicesList]);

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

  return {
    servicesList,
    lookbookList,
    activeCategory,
    availableCategories,
    filteredServices,
    servicesSliderRef,
    scrollServicesSlider,
    handleCategoryChange,
  };
}
