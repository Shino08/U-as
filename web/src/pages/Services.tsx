import { useEffect, useState, useRef, type FormEvent, type ChangeEvent } from "react";
import api from "@/api/client";
import {
  MdAdd,
  MdEdit,
  MdDelete,
  MdClose,
  MdSearch,
  MdToggleOn,
  MdToggleOff,
  MdContentCut,
  MdViewModule,
  MdViewList,
  MdCloudUpload,
  MdCheck,
  MdCategory,
  MdStyle,
} from "react-icons/md";
import { Sparkles, Check, ArrowRight } from "lucide-react";
import { resolveImage, PRESET_IMAGES } from "@/lib/images";
import { useTheme } from "@/context/ThemeContext";
import { ConfirmModal } from "@/components/ConfirmModal";

interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  image: string;
  tag?: string;
  features?: string[];
  active: boolean;
}

interface LookbookItem {
  id: string;
  title: string;
  category: string;
  image: string;
  technique: string;
  durationBonus: string;
  estimatedPrice: number;
  active?: boolean;
}

const DEFAULT_SERVICE_CATEGORIES = ["Manicura", "Nail Art", "Extensiones", "Pedicura"];
const DEFAULT_LOOKBOOK_CATEGORIES = ["Glazed & Chrome", "Velvet Cat Eye", "Esculturas 3D", "Clean Girl French"];

export default function Services() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState<"services" | "lookbook" | "categories">("services");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const [services, setServices] = useState<Service[]>([]);
  const [lookbookItems, setLookbookItems] = useState<LookbookItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Dynamic Categories State
  const [serviceCategories, setServiceCategories] = useState<string[]>(DEFAULT_SERVICE_CATEGORIES);
  const [lookbookCategories, setLookbookCategories] = useState<string[]>(DEFAULT_LOOKBOOK_CATEGORIES);
  const [newServiceCat, setNewServiceCat] = useState("");
  const [newLookbookCat, setNewLookbookCat] = useState("");
  const [showCustomServiceCat, setShowCustomServiceCat] = useState(false);
  const [customServiceCat, setCustomServiceCat] = useState("");
  const [showCustomLookbookCat, setShowCustomLookbookCat] = useState(false);
  const [customLookbookCat, setCustomLookbookCat] = useState("");

  // Pagination
  const [svcPage, setSvcPage] = useState(1);
  const [lookPage, setLookPage] = useState(1);
  const PAGE_SIZE = 8;

  // Reusable Confirm / Alert Modal State
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    onConfirm?: () => void;
  }>({
    isOpen: false,
    title: "",
    description: "",
  });

  const showConfirm = (options: {
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    type?: "danger" | "warning" | "info";
    onConfirm: () => void;
  }) => {
    setConfirmModal({
      isOpen: true,
      title: options.title,
      description: options.description,
      confirmText: options.confirmText || "Eliminar",
      cancelText: options.cancelText || "Cancelar",
      type: options.type || "danger",
      onConfirm: () => {
        options.onConfirm();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  const showAlert = (title: string, description: string, type: "warning" | "info" = "warning") => {
    setConfirmModal({
      isOpen: true,
      title,
      description,
      type,
      confirmText: "Entendido",
      onConfirm: undefined,
    });
  };

  // Service Modal State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [serviceFilePreview, setServiceFilePreview] = useState<string | null>(null);
  const serviceFileInputRef = useRef<HTMLInputElement>(null);

  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "50",
    category: "Manicura",
    image: "service-classic.jpg",
    tag: "Esencial",
    features: "Técnica de alta precisión\nMateriales hipoalergénicos\nSellado de larga duración",
  });

  // Lookbook Modal State
  const [showLookbookForm, setShowLookbookForm] = useState(false);
  const [editingLookbook, setEditingLookbook] = useState<LookbookItem | null>(null);
  const [lookbookFilePreview, setLookbookFilePreview] = useState<string | null>(null);
  const lookbookFileInputRef = useRef<HTMLInputElement>(null);

  const [lookbookForm, setLookbookForm] = useState({
    title: "",
    category: "Glazed & Chrome",
    technique: "",
    durationBonus: "+15 min",
    estimatedPrice: "45",
    image: "lookbook-chrome.jpg",
  });

  const loadData = async () => {
    try {
      const [svcData, landingData] = await Promise.all([
        api.get("/services?all=true").catch(() => []),
        api.get("/landing").catch(() => ({})),
      ]);

      if (Array.isArray(svcData)) {
        setServices(svcData);
      }

      if (landingData?.lookbook && Array.isArray(landingData.lookbook)) {
        setLookbookItems(landingData.lookbook);
      } else {
        setLookbookItems([]);
      }

      const savedSvcCats = Array.isArray(landingData?.categories?.services)
        ? landingData.categories.services
        : DEFAULT_SERVICE_CATEGORIES;
      const savedLookCats = Array.isArray(landingData?.categories?.lookbook)
        ? landingData.categories.lookbook
        : DEFAULT_LOOKBOOK_CATEGORIES;

      const mergedSvcCats = Array.from(
        new Set([
          ...savedSvcCats,
          ...(Array.isArray(svcData) ? svcData.map((s: Service) => s.category).filter(Boolean) : []),
        ])
      );
      const mergedLookCats = Array.from(
        new Set([
          ...savedLookCats,
          ...(landingData?.lookbook ? landingData.lookbook.map((l: LookbookItem) => l.category).filter(Boolean) : []),
        ])
      );

      setServiceCategories(mergedSvcCats);
      setLookbookCategories(mergedLookCats);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddServiceCategory = async (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return;
    if (serviceCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showAlert("Categoría Duplicada", "Esta categoría ya existe en la lista de tratamientos.");
      return;
    }
    const updated = [...serviceCategories, trimmed];
    setServiceCategories(updated);
    setNewServiceCat("");
    await api.put("/landing", {
      categories: {
        services: updated,
        lookbook: lookbookCategories,
      },
    }).catch(() => {});
  };

  const handleDeleteServiceCategory = (catName: string) => {
    const count = services.filter((s) => s.category === catName).length;
    showConfirm({
      title: "¿Eliminar Categoría?",
      description:
        count > 0
          ? `La categoría "${catName}" tiene ${count} servicio(s) asociados actualmente. ¿Deseas eliminarla del catálogo de categorías?`
          : `¿Estás seguro de que deseas eliminar la categoría "${catName}"?`,
      confirmText: "Eliminar Categoría",
      onConfirm: async () => {
        const updated = serviceCategories.filter((c) => c !== catName);
        setServiceCategories(updated);
        await api.put("/landing", {
          categories: {
            services: updated,
            lookbook: lookbookCategories,
          },
        }).catch(() => {});
      },
    });
  };

  const handleAddLookbookCategory = async (catName: string) => {
    const trimmed = catName.trim();
    if (!trimmed) return;
    if (lookbookCategories.some((c) => c.toLowerCase() === trimmed.toLowerCase())) {
      showAlert("Estilo Duplicado", "Este estilo ya existe en el catálogo de lookbook.");
      return;
    }
    const updated = [...lookbookCategories, trimmed];
    setLookbookCategories(updated);
    setNewLookbookCat("");
    await api.put("/landing", {
      categories: {
        services: serviceCategories,
        lookbook: updated,
      },
    }).catch(() => {});
  };

  const handleDeleteLookbookCategory = (catName: string) => {
    const count = lookbookItems.filter((l) => l.category === catName).length;
    showConfirm({
      title: "¿Eliminar Estilo?",
      description:
        count > 0
          ? `El estilo "${catName}" tiene ${count} diseño(s) en el lookbook. ¿Deseas eliminarlo del catálogo?`
          : `¿Estás seguro de que deseas eliminar el estilo "${catName}"?`,
      confirmText: "Eliminar Estilo",
      onConfirm: async () => {
        const updated = lookbookCategories.filter((c) => c !== catName);
        setLookbookCategories(updated);
        await api.put("/landing", {
          categories: {
            services: serviceCategories,
            lookbook: updated,
          },
        }).catch(() => {});
      },
    });
  };

  // Filter Services
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase()) ||
      (s.tag && s.tag.toLowerCase().includes(search.toLowerCase()));

    const matchesCategory =
      selectedCategory === "Todos" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Filter Lookbook
  const filteredLookbook = lookbookItems.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase()) ||
    item.technique.toLowerCase().includes(search.toLowerCase())
  );

  // Paginated
  const svcTotalPages = Math.ceil(filteredServices.length / PAGE_SIZE);
  const paginatedServices = filteredServices.slice((svcPage - 1) * PAGE_SIZE, svcPage * PAGE_SIZE);
  const lookTotalPages = Math.ceil(filteredLookbook.length / PAGE_SIZE);
  const paginatedLookbook = filteredLookbook.slice((lookPage - 1) * PAGE_SIZE, lookPage * PAGE_SIZE);

  // Reset page on filter change
  useEffect(() => { setSvcPage(1); }, [search, selectedCategory]);
  useEffect(() => { setLookPage(1); }, [search]);

  // Service Modal Openers
  const openCreateService = () => {
    setEditingService(null);
    setServiceFilePreview(null);
    setServiceForm({
      name: "",
      description: "",
      price: "",
      duration: "50",
      category: "Manicura",
      image: "service-classic.jpg",
      tag: "Esencial",
      features: "Técnica de alta precisión\nMateriales hipoalergénicos\nSellado de larga duración",
    });
    setShowServiceForm(true);
  };

  const openEditService = (svc: Service) => {
    setEditingService(svc);
    setServiceFilePreview(null);
    setServiceForm({
      name: svc.name,
      description: svc.description || "",
      price: String(svc.price),
      duration: String(svc.duration),
      category: svc.category || "Manicura",
      image: svc.image || "service-classic.jpg",
      tag: svc.tag || "Esencial",
      features: Array.isArray(svc.features)
        ? svc.features.join("\n")
        : "Técnica de alta precisión\nMateriales hipoalergénicos\nSellado de larga duración",
    });
    setShowServiceForm(true);
  };

  // Service File Upload Handler
  const handleServiceFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Visual preview
    const previewUrl = URL.createObjectURL(file);
    setServiceFilePreview(previewUrl);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.upload<{ filename: string; path: string }>("/upload/service", formData);
      if (res?.path) {
        setServiceForm((prev) => ({ ...prev, image: res.path }));
      } else {
        // Fallback to Data URL
        const reader = new FileReader();
        reader.onloadend = () => {
          setServiceForm((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch {
      // Fallback if server upload is offline
      const reader = new FileReader();
      reader.onloadend = () => {
        setServiceForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  // Save Service
  const handleSaveService = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const parsedFeatures = serviceForm.features
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean);

      const payload = {
        name: serviceForm.name,
        description: serviceForm.description,
        price: parseFloat(serviceForm.price),
        duration: parseInt(serviceForm.duration),
        category: serviceForm.category,
        image: serviceForm.image,
        tag: serviceForm.tag,
        features: parsedFeatures,
      };

      if (editingService) {
        await api.put(`/services/${editingService.id}`, payload);
      } else {
        await api.post("/services", payload);
      }
      setShowServiceForm(false);
      loadData();
    } catch (err: any) {
      showAlert("Error al Guardar", err.message || "Error al guardar el tratamiento.", "warning");
    } finally {
      setSaving(false);
    }
  };

  const toggleServiceActive = async (svc: Service) => {
    await api.put(`/services/${svc.id}`, { active: !svc.active });
    loadData();
  };

  const deleteService = (svc: Service) => {
    showConfirm({
      title: "¿Eliminar Tratamiento?",
      description: `¿Estás segura de que deseas eliminar permanentemente "${svc.name}" de la carta de servicios? Esta acción no se puede deshacer.`,
      confirmText: "Eliminar Servicio",
      onConfirm: async () => {
        await api.delete(`/services/${svc.id}`);
        loadData();
      },
    });
  };

  // Lookbook Modal Openers & File Upload
  const openCreateLookbook = () => {
    setEditingLookbook(null);
    setLookbookFilePreview(null);
    setLookbookForm({
      title: "",
      category: "Glazed & Chrome",
      technique: "",
      durationBonus: "+15 min",
      estimatedPrice: "45",
      image: "lookbook-chrome.jpg",
    });
    setShowLookbookForm(true);
  };

  const openEditLookbook = (item: LookbookItem) => {
    setEditingLookbook(item);
    setLookbookFilePreview(null);
    setLookbookForm({
      title: item.title,
      category: item.category,
      technique: item.technique,
      durationBonus: item.durationBonus,
      estimatedPrice: String(item.estimatedPrice),
      image: item.image,
    });
    setShowLookbookForm(true);
  };

  const handleLookbookFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setLookbookFilePreview(previewUrl);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await api.upload<{ filename: string; path: string }>("/upload/service", formData);
      if (res?.path) {
        setLookbookForm((prev) => ({ ...prev, image: res.path }));
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setLookbookForm((prev) => ({ ...prev, image: reader.result as string }));
        };
        reader.readAsDataURL(file);
      }
    } catch {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLookbookForm((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveLookbook = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      let updated: LookbookItem[];
      if (editingLookbook) {
        updated = lookbookItems.map((item) =>
          item.id === editingLookbook.id
            ? {
                ...item,
                title: lookbookForm.title,
                category: lookbookForm.category,
                technique: lookbookForm.technique,
                durationBonus: lookbookForm.durationBonus,
                estimatedPrice: parseFloat(lookbookForm.estimatedPrice),
                image: lookbookForm.image,
              }
            : item
        );
      } else {
        const newItem: LookbookItem = {
          id: `look-${Date.now()}`,
          title: lookbookForm.title,
          category: lookbookForm.category,
          technique: lookbookForm.technique,
          durationBonus: lookbookForm.durationBonus,
          estimatedPrice: parseFloat(lookbookForm.estimatedPrice),
          image: lookbookForm.image,
          active: true,
        };
        updated = [...lookbookItems, newItem];
      }

      setLookbookItems(updated);
      await api.put("/landing", { lookbook: updated }).catch(() => {});
      setShowLookbookForm(false);
    } catch (err: any) {
      showAlert("Error al guardar", err.message || "Error al guardar lookbook", "warning");
    } finally {
      setSaving(false);
    }
  };

  const deleteLookbookItem = (id: string) => {
    showConfirm({
      title: "¿Eliminar diseño del lookbook?",
      description: "Esta pieza de diseño e inspiración será removida de la galería pública.",
      confirmText: "Eliminar diseño",
      onConfirm: async () => {
        const updated = lookbookItems.filter((item) => item.id !== id);
        setLookbookItems(updated);
        await api.put("/landing", { lookbook: updated }).catch(() => {});
      },
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className={`h-10 w-48 rounded-2xl ${isDark ? "bg-[#1e0a20]" : "bg-[#eedbe8]"}`} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className={`h-80 rounded-3xl border ${isDark ? "bg-[#18091a] border-[#260e28]" : "bg-white border-[#eedbe8]"}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* ─── ENCABEZADO & TABS PRINCIPALES ─── */}
      <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-6 ${isDark ? "border-[#240d26]" : "border-[#eedbe8]"}`}>
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#d9487d]/10 border border-[#d9487d]/20 text-[11px] font-semibold tracking-wider uppercase text-[#d9487d] mb-2">
            <Sparkles className="size-3 text-[#d9487d]" />
            <span>Catálogo Exclusivo</span>
          </div>
          <h1 className={`text-2xl sm:text-3xl font-display italic font-light tracking-tight ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
            {activeTab === "services"
              ? "Carta de Tratamientos"
              : activeTab === "lookbook"
              ? "Inspiración & Estilo"
              : "Gestión de Categorías"}
          </h1>
          <p className={`text-xs mt-1 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
            {activeTab === "services"
              ? "Gestión integral de servicios, imágenes de alta resolución, tiempos y precios."
              : activeTab === "lookbook"
              ? "Galería de tendencias y diseños de autor para visualización y reserva."
              : "Crea, personaliza y organiza las categorías de tratamientos y estilos del lookbook."}
          </p>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center gap-3">
          {activeTab === "services" && (
            <button
              onClick={openCreateService}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] px-4 text-xs font-semibold text-white shadow-lg shadow-[#d9487d]/20 hover:shadow-xl hover:shadow-[#d9487d]/30 transition-all cursor-pointer"
            >
              <MdAdd className="size-4" />
              <span>Nuevo Servicio</span>
            </button>
          )}
          {activeTab === "lookbook" && (
            <button
              onClick={openCreateLookbook}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] px-4 text-xs font-semibold text-white shadow-lg shadow-[#d9487d]/20 hover:shadow-xl hover:shadow-[#d9487d]/30 transition-all cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              <span>Nuevo Diseño Lookbook</span>
            </button>
          )}
        </div>
      </div>

      {/* ─── PESTAÑAS & CONTROLES SUPERIORES ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Switcher de Pestaña */}
        <div className={`flex flex-wrap p-1 rounded-2xl border w-fit gap-1 ${isDark ? "bg-[#140616] border-[#260e28]" : "bg-white border-[#eedbe8] shadow-xs"}`}>
          <button
            onClick={() => setActiveTab("services")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "services"
                ? "bg-[#d9487d]/20 text-[#d9487d] border border-[#d9487d]/30 shadow-sm"
                : isDark ? "text-[#a88ea4] hover:text-white" : "text-[#765a71] hover:text-[#1e0a1d]"
            }`}
          >
            <MdContentCut className="size-4 text-[#d9487d]" />
            <span>Servicios Exclusivos</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono ${isDark ? "bg-[#2a0e2a] text-[#f49bbd]" : "bg-[#fcf2f7] text-[#bf366a]"}`}>
              {services.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("lookbook")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "lookbook"
                ? "bg-[#d9487d]/20 text-[#d9487d] border border-[#d9487d]/30 shadow-sm"
                : isDark ? "text-[#a88ea4] hover:text-white" : "text-[#765a71] hover:text-[#1e0a1d]"
            }`}
          >
            <Sparkles className="size-3.5 text-[#d9487d]" />
            <span>Lookbook de Tendencias</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono ${isDark ? "bg-[#2a0e2a] text-[#f49bbd]" : "bg-[#fcf2f7] text-[#bf366a]"}`}>
              {lookbookItems.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("categories")}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTab === "categories"
                ? "bg-[#d9487d]/20 text-[#d9487d] border border-[#d9487d]/30 shadow-sm"
                : isDark ? "text-[#a88ea4] hover:text-white" : "text-[#765a71] hover:text-[#1e0a1d]"
            }`}
          >
            <MdCategory className="size-4 text-[#d9487d]" />
            <span>Gestión de Categorías</span>
            <span className={`ml-1 text-[10px] px-2 py-0.5 rounded-full font-mono ${isDark ? "bg-[#2a0e2a] text-[#f49bbd]" : "bg-[#fcf2f7] text-[#bf366a]"}`}>
              {serviceCategories.length + lookbookCategories.length}
            </span>
          </button>
        </div>

        {/* Buscador & Alternador Cards / Tabla */}
        {activeTab !== "categories" && (
          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <MdSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8c6e88] size-4" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar servicio o técnica..."
                className={`h-10 w-full rounded-xl border pl-10 pr-4 text-xs focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 transition-colors ${
                  isDark
                    ? "border-[#2c122e] bg-[#140716] text-white placeholder:text-[#6e526b]"
                    : "border-[#eedbe8] bg-white text-[#1e0a1d] placeholder:text-[#9e8398] shadow-xs"
                }`}
              />
            </div>

            {activeTab === "services" && (
              <div className={`hidden sm:flex border rounded-xl p-1 shrink-0 ${isDark ? "border-[#2c122e] bg-[#140716]" : "border-[#eedbe8] bg-white shadow-xs"}`}>
                <button
                  type="button"
                  onClick={() => setViewMode("cards")}
                  title="Vista en Tarjetas"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "cards"
                      ? "bg-[#d9487d]/20 text-[#d9487d]"
                      : isDark ? "text-[#8c6e88] hover:text-white" : "text-[#8d6f88] hover:text-[#1e0a1d]"
                  }`}
                >
                  <MdViewModule className="size-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("table")}
                  title="Vista en Tabla"
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    viewMode === "table"
                      ? "bg-[#d9487d]/20 text-[#d9487d]"
                      : isDark ? "text-[#8c6e88] hover:text-white" : "text-[#8d6f88] hover:text-[#1e0a1d]"
                  }`}
                >
                  <MdViewList className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── FILTROS DE CATEGORÍA DINÁMICOS ─── */}
      {activeTab === "services" && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {["Todos", ...serviceCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? "bg-[#d9487d] text-white shadow-md shadow-[#d9487d]/20"
                  : isDark
                  ? "bg-[#140716] border border-[#2c122e] text-[#a88ea4] hover:border-[#441a46] hover:text-white"
                  : "bg-white border border-[#eedbe8] text-[#765a71] hover:border-[#d9487d] hover:text-[#1e0a1d] shadow-xs"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 1: SERVICIOS EXCLUSIVOS
         ══════════════════════════════════════════════════════════ */}
      {activeTab === "services" && (
        <>
          {filteredServices.length === 0 ? (
            <div className={`rounded-3xl border py-16 text-center shadow-xl ${isDark ? "border-[#240d26] bg-[#120614]/90" : "border-[#eedbe8] bg-white shadow-sm"}`}>
              <div className={`mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl ${isDark ? "bg-[#1e0a20]" : "bg-[#fcf2f7]"} text-[#d9487d]`}>
                <MdContentCut className="size-6" />
              </div>
              <p className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>No se encontraron servicios</p>
              <p className={`text-xs mt-1 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>Prueba con otro término de búsqueda o categoría</p>
            </div>
          ) : viewMode === "cards" ? (
            /* ─── VISTA CARDS SIMÉTRICA ─── */
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedServices.map((svc) => (
                <div
                  key={svc.id}
                  className={`group rounded-3xl border overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col justify-between ${
                    isDark
                      ? svc.active
                        ? "border-[#280e2a] hover:border-[#d9487d]/50 bg-[#120614]/90"
                        : "border-[#200a22] opacity-60 bg-[#0e0410]"
                      : svc.active
                        ? "border-[#eedbe8] hover:border-[#d9487d]/50 bg-white shadow-sm"
                        : "border-[#eedbe8] opacity-60 bg-gray-50"
                  }`}
                >
                  <div>
                    {/* Imagen con badges */}
                    <div className={`relative aspect-[16/10] w-full overflow-hidden ${isDark ? "bg-[#18081a]" : "bg-gray-100"}`}>
                      <img
                        src={resolveImage(svc.image)}
                        alt={svc.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-white border border-white/20">
                          {svc.category}
                        </span>
                        {svc.tag && (
                          <span className="rounded-full bg-[#d9487d] px-2.5 py-1 text-[10px] font-semibold tracking-wider uppercase text-white shadow-sm">
                            {svc.tag}
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3">
                        <button
                          type="button"
                          onClick={() => toggleServiceActive(svc)}
                          title={svc.active ? "Desactivar" : "Activar"}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold backdrop-blur-md transition-colors cursor-pointer ${
                            svc.active
                              ? "bg-emerald-500/90 text-white shadow-sm"
                              : "bg-rose-500/80 text-white"
                          }`}
                        >
                          <span className="size-1.5 rounded-full bg-white animate-pulse" />
                          <span>{svc.active ? "Activo" : "Inactivo"}</span>
                        </button>
                      </div>

                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="font-display italic text-lg text-white font-medium drop-shadow-sm leading-tight">
                          {svc.name}
                        </h3>
                      </div>
                    </div>

                    {/* Descripción y características */}
                    <div className="p-6 space-y-4">
                      <p className={`text-xs leading-relaxed line-clamp-3 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                        {svc.description}
                      </p>

                      {Array.isArray(svc.features) && svc.features.length > 0 && (
                        <div className={`space-y-1.5 pt-2 border-t ${isDark ? "border-[#200b22]" : "border-[#eedbe8]"}`}>
                          {svc.features.map((feat, fIdx) => (
                            <div key={fIdx} className={`flex items-center gap-2 text-[11px] ${isDark ? "text-[#c7a9c3]" : "text-[#5e4359]"}`}>
                              <Check className="size-3 text-[#d9487d] shrink-0" />
                              <span className="truncate">{feat}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer de Tarjeta */}
                  <div className={`p-6 pt-0 border-t mt-2 ${isDark ? "border-[#200b22]" : "border-[#eedbe8]"}`}>
                    <div className="flex items-baseline justify-between py-3">
                      <div>
                        <span className={`text-[10px] uppercase font-bold tracking-wider block ${isDark ? "text-[#8c6e88]" : "text-[#8d6f88]"}`}>
                          Inversión
                        </span>
                        <div className="flex items-baseline gap-1.5">
                          <span className={`text-2xl font-bold tracking-tight font-display ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                            ${svc.price}
                          </span>
                          <span className={`text-xs font-mono ${isDark ? "text-[#8c6e88]" : "text-[#8d6f88]"}`}>
                            / {svc.duration} min
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditService(svc)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? "text-[#a88ea4] hover:text-[#f49bbd] hover:bg-[#d9487d]/15" : "text-[#765a71] hover:text-[#bf366a] hover:bg-[#d9487d]/10"
                          }`}
                          title="Editar Servicio"
                        >
                          <MdEdit className="size-4" />
                        </button>
                        <button
                          onClick={() => deleteService(svc)}
                          className={`p-2 rounded-xl transition-colors cursor-pointer ${
                            isDark ? "text-[#a88ea4] hover:text-rose-400 hover:bg-rose-950/40" : "text-[#765a71] hover:text-rose-600 hover:bg-rose-50"
                          }`}
                          title="Eliminar Servicio"
                        >
                          <MdDelete className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ─── VISTA TABLA OSCURA MINIMALISTA ─── */
            <div className={`rounded-3xl border overflow-hidden shadow-xl ${isDark ? "border-[#240d26] bg-[#120614]/90" : "border-[#eedbe8] bg-white shadow-sm"}`}>
              <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[640px]">
                <thead>
                  <tr className={`border-b uppercase tracking-wider text-[10px] font-semibold ${
                    isDark ? "border-[#240d26] bg-[#160818] text-[#8c6e88]" : "border-[#eedbe8] bg-[#fcf5f9] text-[#765a71]"
                  }`}>
                    <th className="px-6 py-4">Tratamiento</th>
                    <th className="px-4 py-4">Categoría</th>
                    <th className="px-4 py-4">Etiqueta</th>
                    <th className="px-4 py-4 text-right">Inversión</th>
                    <th className="px-4 py-4 text-right">Duración</th>
                    <th className="px-4 py-4 text-center">Estado</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? "divide-[#200b22]" : "divide-[#eedbe8]"}`}>
                  {paginatedServices.map((svc) => (
                    <tr key={svc.id} className={`transition-colors ${isDark ? "hover:bg-[#18091b]/50" : "hover:bg-[#fcf5f9]/70"}`}>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={resolveImage(svc.image)}
                            alt={svc.name}
                            className={`size-11 rounded-xl object-cover shrink-0 border ${isDark ? "border-[#2a0e2c]" : "border-[#eedbe8]"}`}
                          />
                          <div className="min-w-0">
                            <p className={`font-semibold text-sm ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>{svc.name}</p>
                            <p className={`truncate max-w-xs ${isDark ? "text-[#8c6e88]" : "text-[#8d6f88]"}`}>{svc.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider border ${
                          isDark ? "bg-[#1c0a1e] text-[#caa2c2] border-[#2c122e]" : "bg-[#fcf5f9] text-[#765a71] border-[#eedbe8]"
                        }`}>
                          {svc.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        {svc.tag ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-[#d9487d]/15 text-[#d9487d] border border-[#d9487d]/30">
                            {svc.tag}
                          </span>
                        ) : (
                          <span className={isDark ? "text-[#5a3e56]" : "text-[#9e8398]"}>-</span>
                        )}
                      </td>
                      <td className={`px-4 py-4 text-right font-semibold text-sm font-display ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                        ${svc.price}
                      </td>
                      <td className={`px-4 py-4 text-right font-mono ${isDark ? "text-[#8c6e88]" : "text-[#8d6f88]"}`}>
                        {svc.duration} min
                      </td>
                      <td className="px-4 py-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleServiceActive(svc)}
                          className={`cursor-pointer transition-colors ${
                            svc.active ? "text-emerald-500" : isDark ? "text-[#5a3e56]" : "text-[#9e8398]"
                          }`}
                        >
                          {svc.active ? <MdToggleOn className="size-7" /> : <MdToggleOff className="size-7" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => openEditService(svc)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isDark ? "text-[#a88ea4] hover:text-[#f49bbd] hover:bg-[#d9487d]/15" : "text-[#765a71] hover:text-[#bf366a] hover:bg-[#d9487d]/10"
                            }`}
                            title="Editar"
                          >
                            <MdEdit className="size-4" />
                          </button>
                          <button
                            onClick={() => deleteService(svc)}
                            className={`p-2 rounded-xl transition-colors cursor-pointer ${
                              isDark ? "text-[#a88ea4] hover:text-rose-400 hover:bg-rose-950/40" : "text-[#765a71] hover:text-rose-600 hover:bg-rose-50"
                            }`}
                            title="Eliminar"
                          >
                            <MdDelete className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              </div>
            </div>
          )}

          {/* Services Pagination */}
          {svcTotalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className={`text-xs ${isDark ? "text-[#8c6e88]" : "text-[#765a71]"}`}>
                Mostrando {(svcPage - 1) * PAGE_SIZE + 1}–{Math.min(svcPage * PAGE_SIZE, filteredServices.length)} de {filteredServices.length}
              </p>
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setSvcPage((p) => Math.max(1, p - 1))} disabled={svcPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>Anterior</button>
                {Array.from({ length: svcTotalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setSvcPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${p === svcPage ? "bg-[#d9487d] text-white" : isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>{p}</button>
                ))}
                <button onClick={() => setSvcPage((p) => Math.min(svcTotalPages, p + 1))} disabled={svcPage === svcTotalPages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>Siguiente</button>
              </div>
            </div>
          )}
        </>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 2: LOOKBOOK DE TENDENCIAS
         ══════════════════════════════════════════════════════════ */}
      {activeTab === "lookbook" && (
        <div className="space-y-6">
          <div className={`rounded-3xl border p-5 flex items-center justify-between gap-4 shadow-xl ${
            isDark ? "border-[#2b102d] bg-[#140616]/90" : "border-[#eedbe8] bg-white shadow-sm"
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="size-11 rounded-2xl bg-gradient-to-tr from-[#d9487d] to-[#bf366a] text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-[#d9487d]/20">
                <Sparkles className="size-5" />
              </div>
              <div>
                <h4 className={`text-sm font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>Inspiración &amp; Estilo de Autor</h4>
                <p className={`text-xs mt-0.5 ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                  Los diseños publicados aquí se reflejan directamente en el lookbook de la landing page.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            {paginatedLookbook.map((look) => (
              <div
                key={look.id}
                className={`group rounded-3xl border overflow-hidden shadow-xl hover:shadow-2xl hover:border-[#d9487d]/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                  isDark ? "border-[#280e2a] bg-[#120614]/90" : "border-[#eedbe8] bg-white shadow-sm"
                }`}
              >
                <div>
                  <div className={`relative aspect-square w-full overflow-hidden ${isDark ? "bg-[#18081a]" : "bg-gray-100"}`}>
                    <img
                      src={resolveImage(look.image)}
                      alt={look.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-black/70 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white border border-white/20">
                        {look.category}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-[#d9487d] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white font-mono shadow-sm">
                        {look.durationBonus}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3 right-3">
                      <h4 className="font-display italic text-base font-semibold text-white leading-tight">
                        {look.title}
                      </h4>
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <p className={`text-xs leading-relaxed min-h-[38px] ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                      {look.technique}
                    </p>
                  </div>
                </div>

                <div className={`p-5 pt-3 border-t flex items-center justify-between ${isDark ? "border-[#200b22]" : "border-[#eedbe8]"}`}>
                  <div>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider block ${isDark ? "text-[#8c6e88]" : "text-[#8d6f88]"}`}>
                      Estimado
                    </span>
                    <span className={`text-xl font-bold font-display ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                      ${look.estimatedPrice}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditLookbook(look)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isDark ? "text-[#a88ea4] hover:text-[#f49bbd] hover:bg-[#d9487d]/15" : "text-[#765a71] hover:text-[#bf366a] hover:bg-[#d9487d]/10"
                      }`}
                      title="Editar look"
                    >
                      <MdEdit className="size-4" />
                    </button>
                    <button
                      onClick={() => deleteLookbookItem(look.id)}
                      className={`p-2 rounded-xl transition-colors cursor-pointer ${
                        isDark ? "text-[#a88ea4] hover:text-rose-400 hover:bg-rose-950/40" : "text-[#765a71] hover:text-rose-600 hover:bg-rose-50"
                      }`}
                      title="Eliminar look"
                    >
                      <MdDelete className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Lookbook Pagination */}
          {lookTotalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className={`text-xs ${isDark ? "text-[#8c6e88]" : "text-[#765a71]"}`}>
                Mostrando {(lookPage - 1) * PAGE_SIZE + 1}–{Math.min(lookPage * PAGE_SIZE, filteredLookbook.length)} de {filteredLookbook.length}
              </p>
              <div className="flex flex-wrap gap-1">
                <button onClick={() => setLookPage((p) => Math.max(1, p - 1))} disabled={lookPage === 1}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>Anterior</button>
                {Array.from({ length: lookTotalPages }, (_, i) => i + 1).map((p) => (
                  <button key={p} onClick={() => setLookPage(p)}
                    className={`w-8 h-8 rounded-lg text-xs font-medium transition-all cursor-pointer ${p === lookPage ? "bg-[#d9487d] text-white" : isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>{p}</button>
                ))}
                <button onClick={() => setLookPage((p) => Math.min(lookTotalPages, p + 1))} disabled={lookPage === lookTotalPages}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer disabled:opacity-40 ${isDark ? "bg-[#1a081d] text-white border border-[#240d26]" : "bg-white text-[#1e0a1d] border border-[#eedbe8]"}`}>Siguiente</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          TAB 3: GESTIÓN DE CATEGORÍAS & ESTILOS
         ══════════════════════════════════════════════════════════ */}
      {activeTab === "categories" && (
        <div className="space-y-6">
          {/* Banner Explicativo */}
          <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl ${
            isDark ? "border-[#2b102d] bg-[#140616]/90 text-white" : "border-[#eedbe8] bg-white text-[#1e0a1d] shadow-sm"
          }`}>
            <div className="flex items-center gap-3.5">
              <div className="size-12 rounded-2xl bg-gradient-to-tr from-[#d9487d] to-[#bf366a] text-white flex items-center justify-center font-bold shrink-0 shadow-md shadow-[#d9487d]/20">
                <MdCategory className="size-6" />
              </div>
              <div>
                <h2 className="text-lg font-display italic font-semibold">Taxonomía del Estudio</h2>
                <p className={`text-xs mt-0.5 max-w-xl ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                  Administra las categorías para clasificar tus tratamientos y estilos de inspiración. Los cambios se sincronizan en vivo con los filtros de la landing page y la base de datos PostgreSQL.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs font-mono font-semibold px-3 py-1.5 rounded-xl border border-[#d9487d]/30 bg-[#d9487d]/10 text-[#d9487d]">
              <span>{serviceCategories.length + lookbookCategories.length} Total</span>
            </div>
          </div>

          {/* Paneles Simétricos en Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {/* PANEL 1: CATEGORÍAS DE SERVICIOS */}
            <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-[#130715] border-[#2d1230]" : "bg-white border-[#eedbe8] shadow-sm"
            }`}>
              <div>
                <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? "border-[#240d26]" : "border-[#f1e1ed]"}`}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#d9487d]/15 text-[#d9487d] flex items-center justify-center">
                      <MdContentCut className="size-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm sm:text-base font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                        Categorías de Servicios
                      </h3>
                      <p className={`text-xs ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                        Organizan la carta de tratamientos
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold bg-[#d9487d]/15 text-[#d9487d]">
                    {serviceCategories.length} activas
                  </span>
                </div>

                {/* Formulario rápido para agregar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddServiceCategory(newServiceCat);
                  }}
                  className="flex gap-2 mb-6"
                >
                  <input
                    type="text"
                    value={newServiceCat}
                    onChange={(e) => setNewServiceCat(e.target.value)}
                    placeholder="Nueva categoría (ej. Spa Relax, Cuidado Natural)..."
                    className={`h-11 flex-1 rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark
                        ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]"
                        : "border-[#eedbe8] bg-[#fbf7f9] text-[#1e0a1d] placeholder:text-[#9e8398]"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!newServiceCat.trim()}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] text-white text-xs font-semibold hover:from-[#e2568a] hover:to-[#cb3e72] shadow-md shadow-[#d9487d]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    <MdAdd className="size-4" />
                    <span>Crear</span>
                  </button>
                </form>

                {/* Lista de categorías */}
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {serviceCategories.length === 0 ? (
                    <div className="text-center py-8 text-xs text-current/60 border border-dashed rounded-2xl p-4">
                      No hay categorías registradas.
                    </div>
                  ) : (
                    serviceCategories.map((cat) => {
                      const count = services.filter((s) => s.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                            isDark ? "border-[#230d25] bg-[#170819]" : "border-[#f1e1ed] bg-[#fdfafc]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="size-2 rounded-full bg-[#d9487d] shrink-0" />
                            <span className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                              {cat}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                              isDark ? "bg-[#250d27] text-[#a88ea4]" : "bg-[#f5e9f1] text-[#765a71]"
                            }`}>
                              {count} {count === 1 ? "servicio" : "servicios"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteServiceCategory(cat)}
                            className="p-1.5 rounded-lg text-[#8c6e88] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0 ml-2"
                            title="Eliminar categoría"
                          >
                            <MdDelete className="size-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>

            {/* PANEL 2: ESTILOS DE LOOKBOOK */}
            <div className={`p-6 sm:p-7 rounded-3xl border flex flex-col justify-between ${
              isDark ? "bg-[#130715] border-[#2d1230]" : "bg-white border-[#eedbe8] shadow-sm"
            }`}>
              <div>
                <div className={`flex items-center justify-between pb-4 mb-5 border-b ${isDark ? "border-[#240d26]" : "border-[#f1e1ed]"}`}>
                  <div className="flex items-center gap-3">
                    <div className="size-10 rounded-xl bg-[#d9487d]/15 text-[#d9487d] flex items-center justify-center">
                      <Sparkles className="size-5" />
                    </div>
                    <div>
                      <h3 className={`text-sm sm:text-base font-semibold ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                        Estilos &amp; Técnicas de Lookbook
                      </h3>
                      <p className={`text-xs ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                        Categorías de inspiración y showroom
                      </p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold bg-[#d9487d]/15 text-[#d9487d]">
                    {lookbookCategories.length} activos
                  </span>
                </div>

                {/* Formulario rápido para agregar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleAddLookbookCategory(newLookbookCat);
                  }}
                  className="flex gap-2 mb-6"
                >
                  <input
                    type="text"
                    value={newLookbookCat}
                    onChange={(e) => setNewLookbookCat(e.target.value)}
                    placeholder="Nuevo estilo (ej. Clean French, Efecto Aurora)..."
                    className={`h-11 flex-1 rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark
                        ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]"
                        : "border-[#eedbe8] bg-[#fbf7f9] text-[#1e0a1d] placeholder:text-[#9e8398]"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!newLookbookCat.trim()}
                    className="h-11 px-4 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] text-white text-xs font-semibold hover:from-[#e2568a] hover:to-[#cb3e72] shadow-md shadow-[#d9487d]/20 transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                  >
                    <MdAdd className="size-4" />
                    <span>Crear</span>
                  </button>
                </form>

                {/* Lista de estilos */}
                <div className="space-y-2.5 max-h-[450px] overflow-y-auto pr-1">
                  {lookbookCategories.length === 0 ? (
                    <div className="text-center py-8 text-xs text-current/60 border border-dashed rounded-2xl p-4">
                      No hay estilos registrados.
                    </div>
                  ) : (
                    lookbookCategories.map((cat) => {
                      const count = lookbookItems.filter((l) => l.category === cat).length;
                      return (
                        <div
                          key={cat}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                            isDark ? "border-[#230d25] bg-[#170819]" : "border-[#f1e1ed] bg-[#fdfafc]"
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="size-2 rounded-full bg-[#d9487d] shrink-0" />
                            <span className={`text-xs font-semibold truncate ${isDark ? "text-white" : "text-[#1e0a1d]"}`}>
                              {cat}
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono shrink-0 ${
                              isDark ? "bg-[#250d27] text-[#a88ea4]" : "bg-[#f5e9f1] text-[#765a71]"
                            }`}>
                              {count} {count === 1 ? "diseño" : "diseños"}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleDeleteLookbookCategory(cat)}
                            className="p-1.5 rounded-lg text-[#8c6e88] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer shrink-0 ml-2"
                            title="Eliminar estilo"
                          >
                            <MdDelete className="size-4" />
                          </button>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: NUEVO / EDITAR SERVICIO (CON FILE UPLOAD)
         ══════════════════════════════════════════════════════════ */}
      {showServiceForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-xl rounded-3xl p-7 sm:p-8 shadow-2xl border max-h-[90vh] overflow-y-auto relative transition-colors ${
            isDark ? "bg-[#130715] border-[#2d1230] text-white" : "bg-white border-[#ecd6e5] text-slate-800"
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
              isDark ? "border-[#240d26]" : "border-[#f1e1ed]"
            }`}>
              <div>
                <h3 className={`text-lg font-display italic font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {editingService ? "Editar Tratamiento" : "Nuevo Tratamiento Exclusivo"}
                </h3>
                <p className={`text-xs mt-0.5 ${
                  isDark ? "text-[#a88ea4]" : "text-[#8c6e88]"
                }`}>Configura los detalles del servicio y su imagen</p>
              </div>
              <button
                onClick={() => setShowServiceForm(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-[#8c6e88] hover:text-white hover:bg-[#1f0a22]" : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
                }`}
              >
                <MdClose className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-5">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Nombre del Servicio
                </label>
                <input
                  type="text"
                  required
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder="ej. Manicura Rusa & Nivelación Rubber"
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                    }`}>
                      Categoría
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomServiceCat(!showCustomServiceCat)}
                      className="text-[10px] text-[#d9487d] hover:underline font-semibold cursor-pointer"
                    >
                      {showCustomServiceCat ? "← Existentes" : "+ Nueva"}
                    </button>
                  </div>

                  {showCustomServiceCat ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Nombre nueva categoría..."
                        value={customServiceCat}
                        onChange={(e) => setCustomServiceCat(e.target.value)}
                        className={`h-11 flex-1 rounded-xl border px-3 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-1 focus:ring-[#d9487d]/20 ${
                          isDark
                            ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]"
                            : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customServiceCat.trim()) {
                            handleAddServiceCategory(customServiceCat.trim());
                            setServiceForm({ ...serviceForm, category: customServiceCat.trim() });
                            setCustomServiceCat("");
                            setShowCustomServiceCat(false);
                          }
                        }}
                        disabled={!customServiceCat.trim()}
                        className="px-3 rounded-xl bg-[#d9487d] text-white text-xs font-semibold hover:bg-[#e2568a] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        Usar
                      </button>
                    </div>
                  ) : (
                    <select
                      value={serviceForm.category}
                      onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                        isDark ? "border-[#2d1230] bg-[#1a081d] text-white" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 focus:bg-white"
                      }`}
                    >
                      {serviceCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                  }`}>
                    Etiqueta / Badge (Opcional)
                  </label>
                  <input
                    type="text"
                    value={serviceForm.tag}
                    onChange={(e) => setServiceForm({ ...serviceForm, tag: e.target.value })}
                    placeholder="Signature, Esencial, Alta Gama..."
                    className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                  }`}>
                    Inversión ($ USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="32.00"
                    className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                    }`}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                  }`}>
                    Duración (minutos)
                  </label>
                  <input
                    type="number"
                    required
                    value={serviceForm.duration}
                    onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })}
                    placeholder="50"
                    className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              {/* ─── SUBIR ARCHIVO DE IMAGEN (TIPO FILE) ─── */}
              <div className="space-y-3 pt-2">
                <label className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  <span>Fotografía del Servicio</span>
                  <span className={`text-[10px] font-normal ${isDark ? "text-[#8c6e88]" : "text-[#8c6e88]"}`}>Sube cualquier archivo de imagen</span>
                </label>

                {/* Zona Drag & Drop / Selección de Archivo tipo File */}
                <div className="relative">
                  <input
                    type="file"
                    accept="image/png, image/jpeg, image/webp, image/gif"
                    id="service-file-upload"
                    ref={serviceFileInputRef}
                    onChange={handleServiceFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="service-file-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-5 cursor-pointer transition-all duration-200 group text-center ${
                      isDark
                        ? "border-[#341436] hover:border-[#d9487d]/60 bg-[#17081a] hover:bg-[#1d0a20]"
                        : "border-[#e7d0e1] hover:border-[#d9487d]/60 bg-[#fcf9fb] hover:bg-[#faeef5]"
                    }`}
                  >
                    <div className={`size-10 rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform ${
                      isDark ? "bg-[#260e28] text-[#d9487d]" : "bg-[#fbe8f1] text-[#bf366a]"
                    }`}>
                      <MdCloudUpload className="size-6" />
                    </div>
                    <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {uploadingImage ? "Subiendo archivo..." : "Seleccionar archivo de imagen"}
                    </span>
                    <span className="text-[11px] text-[#8c6e88] mt-0.5">
                      Haz clic aquí para examinar archivos (JPG, PNG, WEBP, GIF hasta 5MB)
                    </span>
                  </label>
                </div>

                {/* Previsualización de la fotografía seleccionada */}
                {(serviceFilePreview || serviceForm.image) && (
                  <div className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                    isDark ? "border-[#2a0e2c] bg-[#170819]" : "border-[#ecd6e5] bg-[#faeef5]"
                  }`}>
                    <img
                      src={serviceFilePreview || resolveImage(serviceForm.image)}
                      alt="Preview"
                      className={`size-14 rounded-xl object-cover shrink-0 border ${
                        isDark ? "border-[#38153a]" : "border-[#e7d0e1]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Check className="size-3" />
                          <span>Fotografía lista</span>
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 truncate ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                        {PRESET_IMAGES.find((p) => p.id === serviceForm.image)?.label || "Fotografía personalizada"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setServiceFilePreview(null);
                        setServiceForm({ ...serviceForm, image: "service-classic.jpg" });
                        if (serviceFileInputRef.current) serviceFileInputRef.current.value = "";
                      }}
                      className="p-2 rounded-xl text-[#8c6e88] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Restablecer fotografía"
                    >
                      <MdClose className="size-4" />
                    </button>
                  </div>
                )}

                {/* O seleccionar de los presets de estudio */}
                <div className="pt-2">
                  <p className="text-[10px] font-semibold text-[#8c6e88] uppercase tracking-wider mb-2">
                    O selecciona una fotografía del estudio:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setServiceFilePreview(null);
                          setServiceForm({ ...serviceForm, image: img.id });
                        }}
                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          serviceForm.image === img.id && !serviceFilePreview
                            ? "border-[#d9487d] ring-2 ring-[#d9487d]/30 scale-95"
                            : isDark
                            ? "border-[#2d1230] hover:border-[#441a46] opacity-60 hover:opacity-100"
                            : "border-[#ecd6e5] hover:border-[#d9487d]/50 opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="h-full w-full object-cover" />
                        {serviceForm.image === img.id && !serviceFilePreview && (
                          <div className="absolute inset-0 bg-[#d9487d]/40 flex items-center justify-center">
                            <MdCheck className="size-5 text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Descripción Detallada
                </label>
                <textarea
                  rows={2}
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Explica el procedimiento, beneficios y resultado..."
                  className={`w-full rounded-xl border p-3 text-xs transition-all resize-none focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Características Destacadas (Una por línea)
                </label>
                <textarea
                  rows={3}
                  value={serviceForm.features}
                  onChange={(e) => setServiceForm({ ...serviceForm, features: e.target.value })}
                  className={`w-full rounded-xl border p-3 text-xs font-mono transition-all resize-none focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 focus:bg-white"
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
                isDark ? "border-[#240d26]" : "border-[#f1e1ed]"
              }`}>
                <button
                  type="button"
                  onClick={() => setShowServiceForm(false)}
                  className={`h-11 px-5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? "text-[#a88ea4] hover:text-white hover:bg-[#1c0a1e]" : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] text-white text-xs font-semibold hover:from-[#e2568a] hover:to-[#cb3e72] shadow-lg shadow-[#d9487d]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editingService ? "Actualizar Tratamiento" : "Crear Tratamiento"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════
          MODAL: NUEVO / EDITAR LOOKBOOK (CON FILE UPLOAD)
         ══════════════════════════════════════════════════════════ */}
      {showLookbookForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-7 shadow-2xl border max-h-[90vh] overflow-y-auto relative transition-colors ${
            isDark ? "bg-[#130715] border-[#2d1230] text-white" : "bg-white border-[#ecd6e5] text-slate-800"
          }`}>
            <div className={`flex items-center justify-between border-b pb-4 mb-6 ${
              isDark ? "border-[#240d26]" : "border-[#f1e1ed]"
            }`}>
              <div>
                <h3 className={`text-lg font-display italic font-semibold ${
                  isDark ? "text-white" : "text-slate-900"
                }`}>
                  {editingLookbook ? "Editar Diseño Lookbook" : "Nuevo Diseño de Referencia"}
                </h3>
                <p className={`text-xs mt-0.5 ${
                  isDark ? "text-[#a88ea4]" : "text-[#8c6e88]"
                }`}>Se mostrará en la sección de inspiración de la landing</p>
              </div>
              <button
                onClick={() => setShowLookbookForm(false)}
                className={`p-2 rounded-xl transition-colors cursor-pointer ${
                  isDark ? "text-[#8c6e88] hover:text-white hover:bg-[#1f0a22]" : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
                }`}
              >
                <MdClose className="size-5" />
              </button>
            </div>

            <form onSubmit={handleSaveLookbook} className="space-y-5">
              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Título del Diseño
                </label>
                <input
                  type="text"
                  required
                  value={lookbookForm.title}
                  onChange={(e) => setLookbookForm({ ...lookbookForm, title: e.target.value })}
                  placeholder="ej. Glazed Pearl Chrome"
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                  }`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                    }`}>
                      Estilo / Categoría
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCustomLookbookCat(!showCustomLookbookCat)}
                      className="text-[10px] text-[#d9487d] hover:underline font-semibold cursor-pointer"
                    >
                      {showCustomLookbookCat ? "← Existentes" : "+ Nuevo estilo"}
                    </button>
                  </div>

                  {showCustomLookbookCat ? (
                    <div className="flex gap-1.5">
                      <input
                        type="text"
                        placeholder="Nombre nuevo estilo..."
                        value={customLookbookCat}
                        onChange={(e) => setCustomLookbookCat(e.target.value)}
                        className={`h-11 flex-1 rounded-xl border px-3 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-1 focus:ring-[#d9487d]/20 ${
                          isDark
                            ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]"
                            : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customLookbookCat.trim()) {
                            handleAddLookbookCategory(customLookbookCat.trim());
                            setLookbookForm({ ...lookbookForm, category: customLookbookCat.trim() });
                            setCustomLookbookCat("");
                            setShowCustomLookbookCat(false);
                          }
                        }}
                        disabled={!customLookbookCat.trim()}
                        className="px-3 rounded-xl bg-[#d9487d] text-white text-xs font-semibold hover:bg-[#e2568a] transition-colors cursor-pointer disabled:opacity-50 shrink-0"
                      >
                        Usar
                      </button>
                    </div>
                  ) : (
                    <select
                      value={lookbookForm.category}
                      onChange={(e) => setLookbookForm({ ...lookbookForm, category: e.target.value })}
                      className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                        isDark ? "border-[#2d1230] bg-[#1a081d] text-white" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 focus:bg-white"
                      }`}
                    >
                      {lookbookCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                    isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                  }`}>
                    Tiempo Adicional
                  </label>
                  <input
                    type="text"
                    value={lookbookForm.durationBonus}
                    onChange={(e) => setLookbookForm({ ...lookbookForm, durationBonus: e.target.value })}
                    placeholder="+15 min"
                    className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                      isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                    }`}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Inversión Estimada ($ USD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={lookbookForm.estimatedPrice}
                  onChange={(e) => setLookbookForm({ ...lookbookForm, estimatedPrice: e.target.value })}
                  placeholder="42.00"
                  className={`h-11 w-full rounded-xl border px-3.5 text-xs transition-all focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                  }`}
                />
              </div>

              {/* Subir archivo de Lookbook tipo File */}
              <div className="space-y-3 pt-1">
                <label className={`text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  <span>Fotografía de Muestra</span>
                  <span className={`text-[10px] font-normal ${isDark ? "text-[#8c6e88]" : "text-[#8c6e88]"}`}>Sube cualquier archivo</span>
                </label>

                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    id="lookbook-file-upload"
                    ref={lookbookFileInputRef}
                    onChange={handleLookbookFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="lookbook-file-upload"
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-4 cursor-pointer transition-all duration-200 group text-center ${
                      isDark
                        ? "border-[#341436] hover:border-[#d9487d]/60 bg-[#17081a] hover:bg-[#1d0a20]"
                        : "border-[#e7d0e1] hover:border-[#d9487d]/60 bg-[#fcf9fb] hover:bg-[#faeef5]"
                    }`}
                  >
                    <MdCloudUpload className="size-6 text-[#d9487d] mb-1.5 group-hover:scale-110 transition-transform" />
                    <span className={`text-xs font-semibold ${isDark ? "text-white" : "text-slate-900"}`}>
                      {uploadingImage ? "Subiendo..." : "Subir archivo de lookbook"}
                    </span>
                    <span className="text-[10px] text-[#8c6e88] mt-0.5">JPG, PNG o WEBP</span>
                  </label>
                </div>

                {(lookbookFilePreview || lookbookForm.image) && (
                  <div className={`flex items-center gap-3.5 p-3 rounded-2xl border transition-all ${
                    isDark ? "border-[#2a0e2c] bg-[#170819]" : "border-[#ecd6e5] bg-[#faeef5]"
                  }`}>
                    <img
                      src={lookbookFilePreview || resolveImage(lookbookForm.image)}
                      alt="Look preview"
                      className={`size-14 rounded-xl object-cover shrink-0 border ${
                        isDark ? "border-[#38153a]" : "border-[#e7d0e1]"
                      }`}
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <Check className="size-3" />
                          <span>Fotografía lista</span>
                        </span>
                      </div>
                      <p className={`text-[11px] mt-1 truncate ${isDark ? "text-[#a88ea4]" : "text-[#765a71]"}`}>
                        {PRESET_IMAGES.find((p) => p.id === lookbookForm.image)?.label || "Fotografía personalizada"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setLookbookFilePreview(null);
                        setLookbookForm({ ...lookbookForm, image: "lookbook-chrome.jpg" });
                        if (lookbookFileInputRef.current) lookbookFileInputRef.current.value = "";
                      }}
                      className="p-2 rounded-xl text-[#8c6e88] hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Restablecer fotografía"
                    >
                      <MdClose className="size-4" />
                    </button>
                  </div>
                )}

                {/* O seleccionar de los presets de estudio */}
                <div className="pt-2">
                  <p className="text-[10px] font-semibold text-[#8c6e88] uppercase tracking-wider mb-2">
                    O selecciona una fotografía del estudio:
                  </p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {PRESET_IMAGES.map((img) => (
                      <button
                        key={img.id}
                        type="button"
                        onClick={() => {
                          setLookbookFilePreview(null);
                          setLookbookForm({ ...lookbookForm, image: img.id });
                          if (lookbookFileInputRef.current) lookbookFileInputRef.current.value = "";
                        }}
                        className={`group relative aspect-square rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                          lookbookForm.image === img.id
                            ? "border-[#d9487d] ring-2 ring-[#d9487d]/30 scale-95"
                            : "border-transparent opacity-60 hover:opacity-100 hover:border-white/40"
                        }`}
                      >
                        <img src={img.src} alt={img.label} className="w-full h-full object-cover" />
                        {lookbookForm.image === img.id && (
                          <div className="absolute inset-0 bg-[#d9487d]/40 flex items-center justify-center">
                            <Check className="size-4 text-white drop-shadow" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className={`text-[11px] font-semibold uppercase tracking-wider ${
                  isDark ? "text-[#d0b4cc]" : "text-[#765a71]"
                }`}>
                  Técnica de Autor
                </label>
                <textarea
                  rows={2}
                  required
                  value={lookbookForm.technique}
                  onChange={(e) => setLookbookForm({ ...lookbookForm, technique: e.target.value })}
                  placeholder="Detalla los polvos, imanes o relieves utilizados..."
                  className={`w-full rounded-xl border p-3 text-xs transition-all resize-none focus:border-[#d9487d] focus:outline-none focus:ring-2 focus:ring-[#d9487d]/20 ${
                    isDark ? "border-[#2d1230] bg-[#1a081d] text-white placeholder:text-[#6e526b]" : "border-[#e7d0e1] bg-[#fbf7f9] text-slate-900 placeholder:text-[#b498b0] focus:bg-white"
                  }`}
                />
              </div>

              <div className={`flex items-center justify-end gap-3 pt-4 border-t ${
                isDark ? "border-[#240d26]" : "border-[#f1e1ed]"
              }`}>
                <button
                  type="button"
                  onClick={() => setShowLookbookForm(false)}
                  className={`h-11 px-5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    isDark ? "text-[#a88ea4] hover:text-white hover:bg-[#1c0a1e]" : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
                  }`}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={saving || uploadingImage}
                  className="h-11 px-6 rounded-xl bg-gradient-to-r from-[#d9487d] to-[#bf366a] text-white text-xs font-semibold hover:from-[#e2568a] hover:to-[#cb3e72] shadow-lg shadow-[#d9487d]/20 transition-all cursor-pointer disabled:opacity-50"
                >
                  {saving ? "Guardando..." : editingLookbook ? "Actualizar Lookbook" : "Crear Lookbook"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── MODAL DE CONFIRMACIÓN / ALERTAS ─── */}
      <ConfirmModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        description={confirmModal.description}
        confirmText={confirmModal.confirmText}
        cancelText={confirmModal.cancelText}
        type={confirmModal.type}
      />
    </div>
  );
}
