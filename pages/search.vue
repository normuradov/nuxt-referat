<template>
  <div class="search-page-wrapper">
    <!-- Header va Qidiruv bo'limlari -->
    <header class="header green-header">
      <div class="header-content-wrapper">
        <nav class="nav">
          <Logo />
          <ul class="nav-links">
            <li>
              <NuxtLink to="/about">Biz haqimizda</NuxtLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>

    <section class="search-bar-section">
      <div class="search-bar-content">
        <div class="breadcrumb">
          <NuxtLink to="/">Bosh sahifa</NuxtLink>
          <span>></span>
          <span>Qidiruv natijalari</span>
        </div>
        <div class="search-container-small">
          <span class="search-icon-small">🔍</span>
          <form @submit.prevent="performNewSearch">
            <input type="text" class="search-box-small" v-model="newSearchQuery"
              :placeholder="route.query.q || route.query.type">
          </form>
        </div>
      </div>
    </section>

    <!-- Natijalar Konteyneri -->
    <main class="search-results-container">
      <!-- 1. Dastlabki yuklanish holati -->
      <div v-if="pending" class="status-message">
        <p>Qidirilmoqda, iltimos kuting...</p>
      </div>

      <!-- 2. Xatolik holati -->
      <div v-else-if="error" class="status-message error">
        <p>Xatolik yuz berdi. Ma'lumotlarni yuklab bo'lmadi.</p>
        <p><small>{{ error.message }}</small></p>
      </div>

      <!-- 3. Natijalar ro'yxati -->
      <div v-else-if="books && books.length > 0" class="search-results-list">
        <article v-for="book in books" :key="book.id" class="search-result-item">
          <!-- ID mavjud bo'lsa, link ishlaydi -->
          <NuxtLink v-if="book.ziyonet_id" :to="`/books/${book.ziyonet_id}`" class="result-link">
            <h3>{{ book.title }}</h3>
            <p>{{ book.summary || 'Qisqacha mazmun mavjud emas.' }}</p>
          </NuxtLink>
          <!-- Agar ID bo'lmasa, oddiy div ko'rsatiladi -->
          <div v-else class="result-link">
             <h3>{{ book.title }}</h3>
             <p>{{ book.summary || 'Qisqacha mazmun mavjud emas.' }}</p>
          </div>
          
          <div v-if="book.search_type" class="result-meta">
            <div class="meta-items">
              <span class="meta-item">
                <span class="meta-icon">
                  {{ book.search_type === 'title' ? '🏷️' : (book.search_type === 'theme' ? '📚' : '🔑') }}
                </span>
                {{ book.search_type === 'title' ? 'Sarlavha' : (book.search_type === 'theme' ? 'Mavzu' : 'Kalit soʻz') }}
              </span>
              <span class="meta-item" v-if="book.similarity">
                <span class="meta-icon">🎯</span>
                {{ (book.similarity * 100).toFixed(1) }}%
              </span>
            </div>
          </div>
        </article>

        <!-- Keyingi natijalarni yuklash indikatori -->
        <div v-if="isLoadingMore" class="status-message">
          <p>Yana yuklanmoqda...</p>
        </div>
        <!-- Boshqa natija qolmaganda -->
        <div v-if="noMoreResults" class="status-message">
          <p>Barcha natijalar ko'rsatildi.</p>
        </div>
      </div>

      <!-- 4. Umuman natija topilmaganda -->
      <div v-else class="status-message">
        <p>"{{ route.query.q || route.query.type }}" so'rovi bo'yicha hech qanday natija topilmadi.</p>
      </div>
    </main>

  </div>
</template>


<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute, useRouter, useAsyncData, createError, useRuntimeConfig, navigateTo, useSeoMeta } from '#app';

// ----------------------------------------------------------------------------------
// ASOSIY SOZLAMALAR
// ----------------------------------------------------------------------------------

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig(); // runtimeConfig'ni chaqirib olamiz. Bu nuxt.config.ts'dan keladi.
const LIMIT = 10;

// ----------------------------------------------------------------------------------
// UI HOLATINI BOSHQARISH UCHUN REAKTIV O'ZGARUVCHILAR
// ----------------------------------------------------------------------------------

const isLoadingMore = ref(false);
const noMoreResults = ref(false);
const newSearchQuery = ref(route.query.q || route.query.type || '');


// ----------------------------------------------------------------------------------
// ASOSIY MA'LUMOTLARNI YUKLASH (useAsyncData)
// BU ENG MUHIM VA HAL QILUVCHI QISM
// ----------------------------------------------------------------------------------

const { data: books, pending, error } = await useAsyncData(
  // URL o'zgarganda ma'lumotlarni avtomatik yangilash uchun noyob kalit
  `search:${route.fullPath}`,

  async () => {
    // APIga yuboriladigan so'rov parametrlarini yig'amiz
    const queryParams = { limit: LIMIT, offset: 0 };
    if (route.query.q) queryParams.q = String(route.query.q);
    if (route.query.type) queryParams.type = String(route.query.type);
    
    // Agar qidiruv so'rovi bo'sh bo'lsa, APIga so'rov yubormasdan bo'sh massiv qaytaramiz
    if (!queryParams.q && !queryParams.type) {
        return [];
    }

    // --- MANA SHU LOGIKA MUAMMONI HAL QILADI ---
    // So'rov manzilini kod qayerda (server yoki klient) ishga tushayotganiga qarab belgilaymiz
    let baseUrl = '';
    if (process.server) {
      // AGAR KOD SERVERDA (SSR, F5 paytida) ISHLASA:
      // Biz to'g'ridan-to'g'ri backendning ichki manzilini (runtimeConfig'dan) olamiz.
      // Bu Nuxt serveri va FastAPI serveri o'rtasidagi to'g'ridan-to'g'ri aloqa.
      baseUrl = config.apiBase; 
    }
    // AGAR KOD KLIENTDA (sayt ichi navigatsiya) ISHLASA:
    // `baseUrl` bo'sh qoladi. Shunda `$fetch` so'rovni '/api/v1/search' kabi nisbiy 
    // manzilga yuboradi. Bu so'rov brauzerdan chiqib, Nginx'ga boradi va Nginx
    // uni backendga to'g'ri yo'naltiradi (proxy qiladi).

    // `$fetch` chaqiruvi
    return await $fetch('/api/v1/search', {
      baseURL: baseUrl, // Bu yerga yuqorida aniqlangan `baseUrl`ni beramiz
      params: queryParams,
    });
  },
  {
    default: () => [], // Ma'lumot kelgunicha sahifada bo'sh massiv turadi
  }
);


// ----------------------------------------------------------------------------------
// XATOLIKNI QAYTA ISHLASH
// ----------------------------------------------------------------------------------

if (error.value) {
  // Agar API so'rovida xato bo'lsa (masalan backend javob bermasa)
  console.error("useAsyncData so'rovida jiddiy xatolik:", error.value);
  // Foydalanuvchiga xato sahifasini ko'rsatamiz
  throw createError({ 
    statusCode: 500, 
    statusMessage: 'Serverdan ma\'lumotlarni yuklab bo\'lmadi. Backend ishlayotganiga ishonch hosil qiling.', 
    fatal: true 
  });
}


// ----------------------------------------------------------------------------------
// QO'SHIMCHA FUNKSIYALAR: INFINITE SCROLL, NAVIGATSIYA, SEO
// ----------------------------------------------------------------------------------

// Yana yuklanadigan natijalar bor-yo'qligini tekshirish
watch(books, (newBooks) => {
  if (newBooks) {
    noMoreResults.value = newBooks.length < LIMIT;
  }
}, { immediate: true });

// Infinite scroll uchun keyingi sahifani yuklash
async function loadMore() {
    if (isLoadingMore.value || noMoreResults.value || !books.value) return;

    isLoadingMore.value = true;
    try {
        const queryParams = { limit: LIMIT, offset: books.value.length };
        if (route.query.q) queryParams.q = String(route.query.q);
        if (route.query.type) queryParams.type = String(route.query.type);
        
        // Bu funksiya faqat klientda ishlaydi, shuning uchun so'rov har doim to'g'ri ketadi
        const newBooks = await $fetch('/api/v1/search', { params: queryParams });

        if (newBooks && Array.isArray(newBooks) && newBooks.length > 0) {
            books.value.push(...newBooks);
        }
        if (!newBooks || newBooks.length < LIMIT) {
            noMoreResults.value = true;
        }
    } catch (err) {
        console.error("Yana yuklashda xatolik:", err);
    } finally {
        isLoadingMore.value = false;
    }
}

// Yangi qidiruv so'rovini bajarish
function performNewSearch() {
  const trimmedQuery = newSearchQuery.value.trim();
  if (trimmedQuery) {
    navigateTo({ path: '/search', query: { q: trimmedQuery } });
  }
}

// Scroll hodisasini kuzatuvchi funksiya
function handleScroll() {
  if (process.server) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 500) {
    loadMore();
  }
}

// Komponent hayot sikli
onMounted(() => window.addEventListener('scroll', handleScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));

// SEO uchun meta ma'lumotlar
useSeoMeta({
  title: () => `"${route.query.q || route.query.type}" uchun qidiruv natijalari - Referat.uz`,
  description: () => `"${route.query.q || route.query.type}" so'rovi bo'yicha topilgan referatlar, dissertatsiyalar va ilmiy ishlar.`
});

</script>






<style scoped>
.search-page-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
}
.green-header {
  background-color: #20b2aa;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.green-header .nav {
  max-width: 1000px;
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
.search-bar-section {
  padding: 40px 20px;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}
.search-bar-content {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.search-results-container {
  max-width: 1000px;
  margin: 0 auto 40px auto;
  padding: 20px 40px;
  background-color: white;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  margin-top: -20px;
  position: relative;
  z-index: 10;
}
.breadcrumb { 
  display: flex; 
  align-items: center; 
  gap: 8px; 
  color: #666; 
  font-size: 14px; 
}
.breadcrumb a { 
  color: #666; 
  text-decoration: none; 
}
.search-container-small { 
  position: relative; 
}
.search-box-small { 
  padding: 12px 16px 12px 40px; 
  border: 1px solid #ddd; 
  border-radius: 25px; 
  font-size: 14px; 
  width: 300px; 
  background: white; 
}
.search-icon-small { 
  position: absolute; 
  left: 14px; 
  top: 50%; 
  transform: translateY(-50%); 
  color: #999; 
  font-size: 16px; 
}
.search-result-item { 
  padding: 25px 0; 
  border-bottom: 1px solid #f0f0f0; 
}
.search-result-item:first-child { 
  padding-top: 10px; 
}
.search-result-item:last-child { 
  border-bottom: none; 
  padding-bottom: 10px; 
}
.result-link { 
  text-decoration: none; 
  color: inherit; 
  display: block; 
}
.search-result-item h3 { 
  font-size: 18px; 
  font-weight: 500; 
  color: #333; 
  margin-bottom: 8px; 
  transition: color 0.3s ease; 
}
.search-result-item:hover h3 { 
  color: #20b2aa; 
}
.search-result-item p { 
  font-size: 15px; 
  color: #666; 
  line-height: 1.6; 
}
.status-message { 
  text-align: center; 
  padding: 40px 20px; 
  color: #666; 
  font-size: 15px; 
}
.status-message.error { 
  color: #dc3545; 
}
.result-meta {
  margin-top: 20px;
  background-color: #f8f9fa;
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  justify-content: flex-end;
}
.meta-items {
  display: flex;
  align-items: center;
  gap: 20px;
  font-size: 13px;
  color: #555;
}
.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.meta-icon {
  font-size: 16px;
}
</style>