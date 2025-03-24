import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@interfaces": path.resolve(__dirname, "./src/interfaces"),
      "@components": path.resolve(__dirname, "./src/components"),
      "@styles": path.resolve(__dirname, "./src/styles"),
      "@graphql": path.resolve(__dirname, "./src/graphql"),
      "@hooks": path.resolve(__dirname, "./src/hooks"),
      "@context": path.resolve(__dirname, "./src/context"),
      "@SVGs": path.resolve(__dirname, "./src/SVGs"),
      "@api": path.resolve(__dirname, "./src/api"),
      "@pages": path.resolve(__dirname, "./src/pages"),
    },
  },
  define: {
    "import.meta.env.PROD": false,
  },
});
