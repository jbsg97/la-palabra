import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "La Palabra — Biblia",
    short_name: "La Palabra",
    description: "La Santa Biblia con compañero de IA — fácil de leer, fácil de usar",
    start_url: "/",
    display: "standalone",
    background_color: "#fdf8f0",
    theme_color: "#6b4c11",
    orientation: "portrait",
    lang: "es",
    categories: ["education", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    screenshots: [
      {
        src: "/screenshots/home.png",
        sizes: "390x844",
        type: "image/png",
      },
    ],
  };
}
