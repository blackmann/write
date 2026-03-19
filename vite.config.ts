import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { reactRouterHonoServer } from "react-router-hono-server/dev";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    reactRouterHonoServer({ dev: { exclude: [/\/__uno.css/] } }),
    tailwindcss(),
    UnoCSS(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
