import React from "react";
import { MdClose, MdDeleteOutline, MdWarningAmber, MdInfoOutline } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";

export interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "danger",
  isLoading = false,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (!isOpen) return null;

  const isAlertOnly = !onConfirm;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-3xl p-6 sm:p-7 shadow-2xl border relative transition-all duration-200 transform scale-100 ${
          isDark
            ? "bg-[#130715] border-[#2d1230] text-white"
            : "bg-white border-[#ecd6e5] text-slate-800"
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Botón de cerrar */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className={`absolute top-5 right-5 p-2 rounded-xl transition-colors cursor-pointer ${
            isDark
              ? "text-[#8c6e88] hover:text-white hover:bg-[#1f0a22]"
              : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
          }`}
        >
          <MdClose className="size-5" />
        </button>

        {/* Icono temático */}
        <div className="flex items-start gap-4 mb-4">
          <div
            className={`size-12 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
              type === "danger"
                ? "bg-rose-500/15 text-rose-400 border border-rose-500/20"
                : type === "warning"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "bg-[#d9487d]/15 text-[#d9487d] border border-[#d9487d]/20"
            }`}
          >
            {type === "danger" ? (
              <MdDeleteOutline className="size-6" />
            ) : type === "warning" ? (
              <MdWarningAmber className="size-6" />
            ) : (
              <MdInfoOutline className="size-6" />
            )}
          </div>

          <div className="pt-1 pr-6">
            <h3
              className={`text-base font-semibold leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {title}
            </h3>
            <p
              className={`text-xs mt-1.5 leading-relaxed ${
                isDark ? "text-[#a88ea4]" : "text-[#765a71]"
              }`}
            >
              {description}
            </p>
          </div>
        </div>

        {/* Acciones */}
        <div className={`flex items-center justify-end gap-2.5 pt-4 mt-2 border-t ${
          isDark ? "border-[#240d26]" : "border-[#f1e1ed]"
        }`}>
          {!isAlertOnly && (
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className={`h-10 px-4 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? "text-[#a88ea4] hover:text-white hover:bg-[#1c0a1e]"
                  : "text-[#765a71] hover:text-slate-900 hover:bg-[#faeef5]"
              }`}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              if (onConfirm) {
                onConfirm();
              } else {
                onClose();
              }
            }}
            disabled={isLoading}
            className={`h-10 px-5 rounded-xl text-xs font-semibold shadow-lg transition-all cursor-pointer disabled:opacity-50 ${
              type === "danger"
                ? "bg-gradient-to-r from-rose-600 to-[#bf366a] hover:from-rose-500 hover:to-[#cb3e72] text-white shadow-rose-900/20"
                : type === "warning"
                ? "bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white shadow-amber-900/20"
                : "bg-gradient-to-r from-[#d9487d] to-[#bf366a] hover:from-[#e2568a] hover:to-[#cb3e72] text-white shadow-[#d9487d]/20"
            }`}
          >
            {isLoading ? "Procesando..." : isAlertOnly ? "Entendido" : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};
