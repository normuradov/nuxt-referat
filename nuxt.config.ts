// nuxt.config.ts

import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // Asosiy sozlamalar
  compatibilityDate: '2025-07-26',
  devtools: { enabled: true },

  // Barcha sahifalar uchun Server-Side Rendering (SSR) yoqish.
  // Bu qoida saytning barcha qismlari serverda tayyorlanishini ta'minlaydi.
  ssr: true,

  runtimeConfig: {
    apiBase: 'http://127.0.0.1:9000'
  },

  routeRules: {
    '/': { prerender: true },
    '/search': { ssr: true }
  },
  
  
  
  // Vite server sozlamalari
  vite: {
    server: {
      hmr: { // Hot Module Replacement sozlamalari (faqat dev rejimida)
        protocol: 'wss',
        host: 'referat.uz',
      }
    }
  },

  // Global CSS fayllarni ulash
  css: [
    '~/assets/css/main.css'
  ],

  // Router sozlamalari
  router: {
    options: {
      strict: true,
      end: true,
      sensitive: false,
      linkActiveClass: 'nuxt-link-active',
      linkExactActiveClass: 'nuxt-link-exact-active'
    }
  },

  // Eslatma: `runtimeConfig` bloki olib tashlandi, chunki u 2-yechim uchun edi.
  // `routeRules` sozlamasi bilan proksi to'g'ri ishlaganligi sababli, unga ehtiyoj yo'q.

});