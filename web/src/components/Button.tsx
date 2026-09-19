import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "filter" | "slot";
  active?: boolean;
};

export function Button({ children, className, variant = "primary", active, ...props }: ButtonProps) {
  const styles = {
    primary: "bg-ink text-pearl hover:bg-plum shadow-soft",
    secondary: "border border-glass-border bg-glass text-ink hover:bg-glass-strong",
    filter: active ? "bg-ink text-pearl" : "text-plum/70 hover:text-orchid",
    slot: active
      ? "border border-orchid bg-orchid/15 text-orchid ring-2 ring-orchid/20"
      : "border border-glass-border bg-glass text-ink hover:border-orchid hover:text-orchid",
  };

  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-semibold transition duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orchid disabled:cursor-not-allowed disabled:opacity-45",
        styles[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}