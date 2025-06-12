import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // important pour accepter toutes les IP
    port: 5173, // ou un autre port si celui-ci est occupé
    allowedHosts: ["renteiassistance.freeboxos.fr"], // autorise ce domaine
  },
});
