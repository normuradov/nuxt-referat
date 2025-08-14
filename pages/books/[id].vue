<!-- pages/books/[id].vue -->
<template>
  <div class="page-wrapper">
    <!-- Standart Yashil Header -->
    <header class="header green-header">
      <div class="header-content-wrapper">
        <nav class="nav">
          <Logo />
        <ul class="nav-links">
          <li><NuxtLink to="/about">Biz haqimizda</NuxtLink></li>
        </ul>
        </nav>
      </div>
    </header>

    <!-- Sub Header (Breadcrumb) -->
    <div class="sub-header">
      <div class="sub-header-content">
        <div class="breadcrumb">
          <NuxtLink to="/">Bosh sahifa</NuxtLink>
          <span>></span>
          <NuxtLink :to="`/search?q=${book ? book.title.split(' ')[0] : ''}`">Qidiruv</NuxtLink>
          <span>></span>
          <span v-if="book">{{ book.title }}</span>
        </div>
      </div>
    </div>

    <!-- Yuklanish holati -->
    <div v-if="pending" class="status-message">
      <h2>Yuklanmoqda...</h2>
      <p>Ma'lumotlar yuklanayotir, iltimos kuting.</p>
    </div>

    <!-- Xatolik holati -->
    <div v-else-if="error" class="status-message error">
      <h2>Kitob topilmadi</h2>
      <p>Siz qidirayotgan kitob mavjud emas yoki o'chirilgan.</p>
      <NuxtLink to="/search" class="button-link">Qidiruvga qaytish</NuxtLink>
    </div>

    <!-- Asosiy Kontent -->
    <main class="main-content" v-else-if="book">
      <div class="content-grid">
        <!-- Chap taraf: Sidebar -->
        <aside class="sidebar">
          <div class="info-widget">
            <h3>Umumiy ma'lumotlar:</h3>
            <ul class="info-list">
              <li>
                <div class="info-item">
                  <div class="info-label">Muallif:</div>
                  <div class="info-value">{{ book.author || 'Noma\'lum' }}</div>
                </div>
              </li>
              <li>
                <div class="info-item">
                  <div class="info-label">Ma'lumot turi:</div>
                  <div class="info-value">{{ book.type || 'Noma\'lum' }}</div>
                </div>
              </li>
            </ul>
            <!-- Yuklab olish tugmasi -->
            <a 
              v-if="book.ziyonet_id"
              :href="`https://api.ziyonet.uz/api/uzc/library/download?book_id=${book.ziyonet_id}`"
              class="info-download-btn"
              target="_blank"
              rel="noopener noreferrer"
              download
            >
              YUKLAB OLISH
            </a>
            <div v-else class="info-download-btn disabled">
              YUKLAB OLISH IMKONSIZ
            </div>
          </div>
        </aside>

        <!-- O'ng taraf: Kitob tahlili -->
        <section class="article-content">
          <h1 class="article-title">{{ book.title }}</h1>
          
          <div v-if="book.analysis" class="article-body">
            <p>{{ book.analysis.mazmun }}</p>
            <h2>Asosiy mavzular</h2>
            <ul>
              <li v-for="(mavzu, index) in book.analysis.mavzular" :key="index">
                <strong>{{ mavzu.nomi }}:</strong> {{ mavzu.mazmuni }}
              </li>
            </ul>
             <div class="tags">
                <span>Kalit so'zlar:</span>
                <a href="#" v-for="tag in book.analysis.kalitlar.split(',')" :key="tag" class="tag">
                  {{ tag.trim() }}
                </a>
            </div>
          </div>
          <div v-else-if="book.summary" class="article-body">
            <p>{{ book.summary }}</p>
          </div>
          <div v-else class="article-body">
            <p>Ushbu kitob uchun qo'shimcha ma'lumot mavjud emas.</p>
          </div>
        </section>
      </div>
    </main>
  </div>
</template>


<script setup>
import { computed } from 'vue';
import { useRoute, useAsyncData, createError, useRuntimeConfig, useSeoMeta } from '#app';

// ----------------------------------------------------------------------------------
// ASOSIY SOZLAMALAR
// ----------------------------------------------------------------------------------

const route = useRoute();
const config = useRuntimeConfig(); // nuxt.config.ts dan sozlamalarni olamiz
const bookId = route.params.id;


// ----------------------------------------------------------------------------------
// ASOSIY MA'LUMOTLARNI YUKLASH
// Bu yerda ham server/klient mantig'ini qo'llaymiz.
// ----------------------------------------------------------------------------------

const { data: book, pending, error } = await useAsyncData(
  `book-${bookId}`, // Har bir kitob uchun noyob kalit

  async () => {
    // --- BU LOGIKA MUAMMONI HAL QILADI ---
    let baseUrl = '';
    if (process.server) {
      // SERVERDA (F5): To'g'ridan-to'g'ri backendning ichki manzilini olamiz
      baseUrl = config.apiBase; 
    }
    // KLIENTDA: baseUrl bo'sh qoladi va so'rov Nginx orqali backendga boradi

    // API'ga so'rovni `$fetch` orqali yuboramiz
    return await $fetch(`/api/v1/books/${bookId}`, {
      baseURL: baseUrl, // Serverda bu 'http://127.0.0.1:9000' bo'ladi, klientda esa ''
    });
  },
  {
    default: () => null, // Yuklanayotganda `book` qiymati `null` bo'ladi
  }
);


// ----------------------------------------------------------------------------------
// XATOLIKLARNI QAYTA ISHLASH
// ----------------------------------------------------------------------------------

if (error.value) {
  // Agar API so'rovida xatolik yuz bersa (masalan 404 Kitob topilmadi yoki 500 server xatosi)
  // `createError` orqali foydalanuvchiga tegishli xato sahifasini ko'rsatamiz.
  throw createError({
    statusCode: error.value.statusCode || 500, // API'dan kelgan status kodni olamiz
    statusMessage: error.value.statusMessage || 'Kitobni yuklashda noma\'lum xatolik',
    fatal: true, // Bu xato butun sahifani bloklashi kerak
  });
}


// ----------------------------------------------------------------------------------
// SEO VA SAHIFA MA'LUMOTLARI (Hisoblanuvchi xususiyatlar - Computed Properties)
// Bular reaktiv bo'lgani uchun `pending` va `error` holatlarida ham to'g'ri ishlaydi
// ----------------------------------------------------------------------------------

const pageTitle = computed(() => {
  if (pending.value && !book.value) {
    return 'Yuklanmoqda... - Referat.uz';
  }
  if (!book.value) {
    return 'Kitob topilmadi - Referat.uz'; // Bu holat `error` orqali tutib olingan
  }
  return `${book.value.title} - Referat.uz`;
});

const pageDescription = computed(() => {
  if (!book.value) {
    return 'Siz qidirayotgan sahifa yoki ma\'lumot topilmadi.';
  }
  const summary = book.value.summary || `${book.value.title} nomli asar.`;
  return summary.substring(0, 160); // SEO uchun 160 belgidan oshmasligi tavsiya etiladi
});


// ----------------------------------------------------------------------------------
// YAKUNIY SEO META TEGLARI
// ----------------------------------------------------------------------------------

useSeoMeta({
  title: pageTitle,
  description: pageDescription,
  ogTitle: pageTitle,
  ogDescription: pageDescription,
  ogType: 'article',
  ogUrl: () => `https://referat.uz/books/${bookId}`,
  ogImage: () => book.value?.cover_image || 'https://referat.uz/default-og-image.png'
});

// Strukturaviy ma'lumotlar (Schema.org)
useSchemaOrg([
  defineArticle({
    '@type': 'ScholarlyArticle',
    'headline': () => book.value?.title,
    'description': () => pageDescription.value,
    'author': () => book.value?.author ? [{ name: book.value.author }] : [],
    'inLanguage': 'uz',
    'publisher': {
      '@type': 'Organization',
      'name': 'Referat.uz',
      'logo': {
        '@type': 'ImageObject',
        'url': 'https://referat.uz/logo.webp'
      }
    }
  })
])

</script>


<style scoped>
/* Asosiy stillar */
.page-wrapper, .main-content, body {
    background-color: #f8f9fa;
}

.green-header { 
  background-color: #20b2aa; 
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.green-header .nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.green-header .nav-links a { 
  color: white; 
  text-decoration: none;
  font-weight: 500;
}

.header-content-wrapper { 
  max-width: 1200px; 
  margin: 0 auto; 
}

.sub-header { 
  background: white; 
  padding: 15px; 
  border-bottom: 1px solid #e9ecef; 
}

.sub-header-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 0 15px; 
}

.breadcrumb { 
  color: #666; 
  font-size: 13px; 
  display: flex;
  align-items: center;
  gap: 8px;
}

.breadcrumb a { 
  color: #666; 
  text-decoration: none; 
}

.main-content { 
  max-width: 1200px; 
  margin: 0 auto; 
  padding: 30px 15px; 
}

.content-grid { 
  display: grid; 
  grid-template-columns: 300px 1fr; 
  gap: 30px; 
}

.sidebar { 
  position: sticky; 
  top: 20px; 
}

.info-widget { 
  background: white; 
  border-radius: 16px; 
  padding: 25px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
}

.info-widget h3 { 
  font-size: 18px; 
  margin-bottom: 20px; 
  color: #333;
}

.info-list { 
  list-style: none; 
  padding: 0;
  margin: 0;
}

.info-item { 
  padding: 10px 0; 
  border-bottom: 1px solid #f0f0f0; 
}

.info-item:last-child {
  border-bottom: none;
}

.info-label { 
  font-weight: 600; 
  margin-bottom: 6px; 
  font-size: 14px; 
  color: #333;
}

.info-value { 
  color: #666; 
  font-size: 14px; 
}

.info-download-btn { 
  background: #20b2aa; 
  color: white; 
  border: none; 
  padding: 15px 20px; 
  border-radius: 10px; 
  font-weight: 600; 
  cursor: pointer; 
  width: 100%; 
  margin-top: 20px; 
  text-transform: uppercase; 
  display: block; 
  text-align: center; 
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.info-download-btn:hover {
  background: #1a9a93;
}

.info-download-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

.article-content { 
  background: white; 
  border-radius: 16px; 
  padding: 30px; 
  box-shadow: 0 4px 12px rgba(0,0,0,0.08); 
}

.article-title { 
  font-size: 28px; 
  font-weight: 600; 
  margin-bottom: 25px; 
  color: #333;
  line-height: 1.3;
}

.article-body h2 { 
  font-size: 22px; 
  margin: 25px 0 15px 0; 
  color: #333;
}

.article-body p { 
  margin-bottom: 18px; 
  line-height: 1.6;
  color: #555;
}

.article-body ul { 
  padding-left: 20px; 
  margin-bottom: 18px;
}

.article-body li {
  margin-bottom: 8px;
  line-height: 1.6;
}

.tags { 
  display: flex; 
  gap: 8px; 
  margin-top: 25px; 
  flex-wrap: wrap; 
  align-items: center;
}

.tags > span {
  font-weight: 600;
  color: #333;
}

.tag { 
  background: #f0f0f0; 
  color: #555; 
  padding: 5px 10px; 
  border-radius: 20px; 
  font-size: 12px; 
  text-decoration: none;
  transition: background-color 0.3s ease;
}

.tag:hover {
  background: #e0e0e0;
}

.status-message { 
  text-align: center; 
  padding: 80px 20px; 
  max-width: 1200px;
  margin: 0 auto;
}

.status-message h2 { 
  font-size: 24px; 
  margin-bottom: 10px; 
  color: #333;
}

.status-message p {
  color: #666;
  margin-bottom: 20px;
}

.status-message.error { 
  color: #555; 
}

.button-link { 
  display: inline-block; 
  margin-top: 20px; 
  padding: 12px 24px; 
  background-color: #20b2aa; 
  color: white; 
  text-decoration: none; 
  border-radius: 8px;
  font-weight: 500;
  transition: background-color 0.3s ease;
}

.button-link:hover {
  background-color: #1a9a93;
}

/* Responsive dizayn */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .main-content {
    padding: 20px 15px;
  }
  
  .sub-header-content {
    padding: 0 15px;
  }

  .article-content {
    order: 1;
  }

  .sidebar {
    position: static;
    order: 2;
  }

  .article-title {
    font-size: 24px;
  }

  .article-body h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 20px 10px;
  }
  
  .info-widget, .article-content {
    padding: 20px;
  }

  .article-title {
    font-size: 22px;
  }

  .breadcrumb {
    font-size: 12px;
  }
}
</style>