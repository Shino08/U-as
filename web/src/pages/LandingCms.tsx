import { useEffect, useState, type FormEvent } from "react";
import api from "@/api/client";
import { Globe, Save, Loader2, Image, ChevronDown, ChevronUp } from "lucide-react";

interface LandingSection {
  section: string;
  content: Record<string, any>;
  image?: string;
}

const SECTIONS = [
  { key: "hero", label: "Hero", fields: ["headline", "subheadline", "cta"] },
  { key: "about", label: "Sobre Nosotros", fields: ["title", "description", "stats"] },
  { key: "services", label: "Servicios", fields: ["title", "description"] },
  { key: "lookbook", label: "Lookbook", fields: ["title", "description"] },
  { key: "ritual", label: "Ritual", fields: ["title", "steps"] },
  { key: "faq", label: "FAQ", fields: ["title", "items"] },
  { key: "contact", label: "Contacto", fields: ["address", "phone", "email", "hours"] },
  { key: "footer", label: "Footer", fields: ["brand", "tagline"] },
];

export default function LandingCms() {
  const [sections, setSections] = useState<LandingSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data } = await api.get("/landing");
        const mapped = Object.entries(data).map(([section, content]) => ({
          section,
          content: content as Record<string, any>,
          image: (content as any)?.image,
        }));
        setSections(mapped);
      } catch {
        // offline
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleFieldChange = (sectionKey: string, field: string, value: string) => {
    setSections((prev) =>
      prev.map((s) =>
        s.section === sectionKey
          ? { ...s, content: { ...s.content, [field]: value } }
          : s
      )
    );
  };

  const saveSection = async (sectionKey: string) => {
    setSaving(sectionKey);
    try {
      const section = sections.find((s) => s.section === sectionKey);
      if (section) {
        await api.put("/landing", { [sectionKey]: section.content });
      }
    } catch (err: any) {
      alert(err.response?.data?.error || "Error al guardar");
    } finally {
      setSaving(null);
    }
  };

  const renderField = (sectionKey: string, field: string, value: any) => {
    if (typeof value === "string") {
      const isLong = value.length > 80;
      return (
        <div key={field} className="space-y-1.5">
          <label className="text-xs font-medium capitalize text-muted-foreground">
            {field.replace(/_/g, " ")}
          </label>
          {isLong ? (
            <textarea
              value={value}
              onChange={(e) => handleFieldChange(sectionKey, field, e.target.value)}
              rows={3}
              className="flex w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orchid/30"
            />
          ) : (
            <input
              type="text"
              value={value}
              onChange={(e) => handleFieldChange(sectionKey, field, e.target.value)}
              className="flex h-9 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orchid/30"
            />
          )}
        </div>
      );
    }

    if (Array.isArray(value)) {
      return (
        <div key={field} className="space-y-1.5">
          <label className="text-xs font-medium capitalize text-muted-foreground">
            {field.replace(/_/g, " ")} ({value.length} items)
          </label>
          <div className="rounded-lg border border-border bg-background p-3">
            <pre className="whitespace-pre-wrap text-xs text-muted-foreground">
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        </div>
      );
    }

    if (typeof value === "object" && value !== null) {
      return (
        <div key={field} className="space-y-1.5">
          <label className="text-xs font-medium capitalize text-muted-foreground">
            {field.replace(/_/g, " ")}
          </label>
          <div className="space-y-2 rounded-lg border border-border bg-background p-3">
            {Object.entries(value).map(([k, v]) => (
              <div key={k} className="space-y-1">
                <label className="text-[10px] font-medium text-muted-foreground">{k}</label>
                <input
                  type="text"
                  value={String(v)}
                  onChange={(e) => {
                    const newObj = { ...value, [k]: e.target.value };
                    handleFieldChange(sectionKey, field, JSON.stringify(newObj));
                  }}
                  className="flex h-8 w-full rounded-md border border-border bg-card px-2 text-xs focus:outline-none focus:ring-2 focus:ring-orchid/30"
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-orchid border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">
          Landing CMS
        </h1>
        <p className="text-sm text-muted-foreground">
          Edita el contenido de la pagina de inicio
        </p>
      </div>

      <div className="space-y-3">
        {SECTIONS.map((sec) => {
          const data = sections.find((s) => s.section === sec.key);
          const isExpanded = expandedSection === sec.key;
          const fieldCount = sec.fields.length;

          return (
            <div
              key={sec.key}
              className="rounded-xl border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedSection(isExpanded ? null : sec.key)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orchid/8">
                    <Globe className="h-4 w-4 text-orchid" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{sec.label}</p>
                    <p className="text-xs text-muted-foreground">
                      {fieldCount} campos{data ? " | Guardado" : " | Sin datos"}
                    </p>
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-muted-foreground" />
                )}
              </button>

              {isExpanded && (
                <div className="border-t border-border px-5 py-4">
                  {data ? (
                    <div className="space-y-4">
                      {sec.fields.map((field) =>
                        renderField(sec.key, field, data.content[field])
                      )}
                      <div className="flex justify-end pt-2">
                        <button
                          onClick={() => saveSection(sec.key)}
                          disabled={saving === sec.key}
                          className="inline-flex items-center gap-2 rounded-lg bg-orchid px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orchid/90 disabled:opacity-50"
                        >
                          {saving === sec.key ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                          Guardar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      Este section no tiene datos en la base de datos.
                      <br />
                      <span className="text-xs">
                        El contenido se carga desde los defaults de la API.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
