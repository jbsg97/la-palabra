"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface LargeButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg" | "xl";
  fullWidth?: boolean;
}

const sizeClasses = {
  md: "min-h-[48px] px-5 text-base",
  lg: "min-h-[64px] px-6 text-lg",
  xl: "min-h-[80px] px-8 text-xl",
};

const variantClasses = {
  primary:
    "bg-accent text-accent-fg font-semibold rounded-2xl shadow-app active:opacity-80",
  secondary:
    "bg-secondary border-2 border-app text-app font-semibold rounded-2xl active:opacity-80",
  ghost:
    "text-accent font-semibold rounded-2xl active:opacity-70",
};

export const LargeButton = forwardRef<HTMLButtonElement, LargeButtonProps>(
  function LargeButton(
    { variant = "primary", size = "lg", fullWidth = false, className = "", children, ...props },
    ref
  ) {
    return (
      <button
        ref={ref}
        className={[
          "inline-flex items-center justify-center gap-2 cursor-pointer select-none transition-opacity",
          sizeClasses[size],
          variantClasses[variant],
          fullWidth ? "w-full" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {children}
      </button>
    );
  }
);
