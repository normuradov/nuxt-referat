// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  // Asosiy sozlamalar
  compatibilityDate: '2025-07-26',
  devtools: { enabled: true },

  // SEO moduli
  modules: [
    '@nuxtjs/seo'
  ],

  // Saytning asosiy manzili
  site: {
    url: 'https://referat.uz',
    name: 'Referat.uz',
    description: 'O‘zbekistondagi talabalar va tadqiqotchilar uchun ilmiy adabiyotlar olami. Minglab referatlar, dissertatsiyalar va ilmiy ishlar.',
    defaultLocale: 'uz',
  },

  // Barcha sahifalar uchun Server-Side Rendering (SSR) yoqish.
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
      fs: {
        allow: [
          '/home/ubuntu/www/referat'
        ]
      },
      allowedHosts: [
        'referat.uz'
      ],
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
});
