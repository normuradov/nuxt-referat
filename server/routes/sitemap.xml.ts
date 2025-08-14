// server/routes/sitemap.xml.ts
import { serverQueryContent } from '#content/server'
import { SitemapStream, streamToPromise } from 'sitemap'
import { defineEventHandler } from 'h3'

export default defineEventHandler(async (event) => {
  // Backend API manzilini olamiz
  const apiBase = useRuntimeConfig().apiBase;
  
  // Barcha kitoblar ro'yxatini olish uchun APIga so'rov
  const docs = await $fetch(`${apiBase}/api/v1/books/all-ids`);

  const sitemap = new SitemapStream({
    hostname: 'https://referat.uz'
  })

  // Statik sahifalar
  sitemap.write({ url: '/', changefreq: 'daily', priority: 1.0 });
  sitemap.write({ url: '/about', changefreq: 'monthly', priority: 0.8 });
  sitemap.write({ url: '/search', changefreq: 'weekly', priority: 0.9 });

  // Dinamik kitob sahifalari
  for (const doc of docs) {
    sitemap.write({
      url: `/books/${doc.ziyonet_id}`,
      changefreq: 'weekly',
      priority: 0.7
    })
  }
  sitemap.end()

  setHeader(event, 'content-type', 'application/xml')
  return streamToPromise(sitemap)
})
