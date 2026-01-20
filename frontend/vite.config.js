import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from 'fs';
require("dotenv").config();

export default defineConfig(({ mode }) => {
  // carrega variáveis do .env
  const env = process.env;

  // gera o manifest dinamicamente
  const manifest = {
    name: env.VITE_APP_TITLE || "Chat",
    short_name: env.VITE_APP_TITLE || "Chat",
    description:
      env.VITE_APP_DESCRIPTION || "Gerencie seus atendimentos via WhatsApp",
    start_url: "/",
    lang: "pt",
    orientation: "portrait",
    display: "standalone",
    theme_color: env.VITE_APP_THEME_COLOR || "#0d6efd",
    background_color: "#ffffff",
    icons: [
      {
        src: "favicon.ico",
        sizes: "64x64 32x32 24x24 16x16",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };

  // grava o arquivo antes do build
  fs.writeFileSync("./public/manifest.json", JSON.stringify(manifest, null, 2));

  return {
    plugins: [    tailwindcss(),
      react({
        jsxRuntime: "automatic", // permite JSX em .js sem precisar importar React,
        include: "**/*.{js,jsx,ts,tsx}",
      }),
    ],
    server: {
      port: 3000, // mesma porta do CRA
    },
    define: {
      "process.env": process.env,
    },
    build: {
      sourcemap: false, 
    },
    resolve: {
      alias: {
        path: "path-browserify",
      },
    },
  };
});
