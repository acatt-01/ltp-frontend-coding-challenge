import { defineConfig } from "vite";
import { vitePlugin as remix } from "@remix-run/dev";
import tsconfigPaths from "vite-tsconfig-paths";
import { netlifyPlugin } from "@remix-run/netlify";

export default defineConfig({
  plugins: [remix(), tsconfigPaths(), netlifyPlugin()],
});
