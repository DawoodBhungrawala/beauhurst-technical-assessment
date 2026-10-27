export default defineNuxtConfig({
  compatibilityDate: "2026-10-27",
  nitro: { storage: { data: { driver: "fs", base: "./.data" } } },
  vite: { server: { allowedHosts: ["beauhurst.ddev.site"] } },
  css: ["~/assets/css/main.css"],
  runtimeConfig: {
    ollamaUrl: "http://localhost:11434",
    ollamaModel: "llama3.2:3b",
    public: { siteUrl: "http://localhost:3000" },
  },
  app: {
    head: {
      htmlAttrs: { lang: "en-GB" },
      title: "Industry insights | Beauhurst",
      meta: [{ name: "theme-color", content: "#152e29" }],
    },
  },
});
