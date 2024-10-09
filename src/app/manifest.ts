import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Carrinha",
    short_name: "Carrinha",
    description: "Onde está meu filho",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f4f5",
    theme_color: "#f4f4f5",
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
