"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Inicio", icon: "🏠" },
  { href: "/leer", label: "Leer", icon: "📖" },
  { href: "/buscar", label: "Buscar", icon: "🔍" },
  { href: "/marcadores", label: "Marcadores", icon: "🔖" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-nav border-t border-app shadow-app"
      role="navigation"
      aria-label="Navegación principal"
    >
      <ul className="flex items-stretch max-w-2xl mx-auto w-full h-[64px]">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className={[
                  "flex flex-col items-center justify-center w-full h-full gap-0.5",
                  "text-xs font-medium transition-colors active:opacity-70",
                  isActive ? "text-accent" : "text-muted",
                ].join(" ")}
                aria-current={isActive ? "page" : undefined}
              >
                <span className="text-2xl leading-none" aria-hidden="true">
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
