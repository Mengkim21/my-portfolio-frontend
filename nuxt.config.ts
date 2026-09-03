// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    apiBaseInternal: process.env.NUXT_API_BASE_INTERNAL,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },
  modules: [
    '@nuxt/ui'
  ],
  css: ['~/assets/css/main.css']
})
