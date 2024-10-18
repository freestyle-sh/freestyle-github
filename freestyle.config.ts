import { defineConfig } from "freestyle-sh";

process.env.ENV = "dev";

export default defineConfig({
  dev: {
    command: "npx astro dev",
    proxy: "http://localhost:4321",
  },
});
