// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: false },

  modules: [
    "@nuxt/ui",
    "@nuxt/content",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxt/test-utils",
    "@pinia/nuxt",
    "@tresjs/nuxt",
  ],

  ui: {},

  css: ["~/assets/css/main.css"],

  ssr: false,
});
