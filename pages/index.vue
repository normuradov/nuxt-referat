<!-- pages/index.vue -->
<template>
  <div>
    <!-- Maxsus Header (o'zgarishsiz) -->
    <header class="header special-header">
      <nav class="nav">
        <Logo />
      <ul class="nav-links">
        <li><NuxtLink to="/about">Biz haqimizda</NuxtLink></li>
      </ul>
      </nav>
      <div class="hero">
        <h1>Siz qanday kitob qidiryapsiz?</h1>
        <div class="search-container">
          <span class="search-icon">🔍</span>
          <form @submit.prevent="performSearch">
            <input v-model="searchQuery" type="text" class="search-box" placeholder="Mavzu, muallif yoki kitob nomi..."/>
          </form>
        </div>
      </div>
    </header>

    <!-- ASOSIY KONTENT -->
    <main class="main-content">
      <div class="content-grid">
        <!-- Chap taraf: Kategoriyalar (o'zgarishsiz) -->
        <section class="help-topics">
          <h2>Asosiy bo'limlar</h2>
          <div class="topics-grid">
            <NuxtLink v-for="category in categories" :key="category.name" :to="{ path: '/search', query: { type: category.queryParam } }" class="topic-card-link">
              <div class="topic-card">
                <div :class="['topic-icon', category.iconClass]">{{ category.icon }}</div>
                <div class="topic-content">
                  <h3>{{ category.name }}</h3>
                  <p>{{ category.description }}</p>
                </div>
              </div>
            </NuxtLink>
          </div>
        </section>

        <!-- ===== O'NG TOMON: SIDEBAR (YANGI BLOK BILAN TIKLANDI) ===== -->
        <aside class="sidebar">
          <div class="sidebar-section">
            <h3>Eng ko'p qidirilganlar</h3>
            <ul class="popular-articles">
              <!-- Quyida statik, namunaviy ma'lumotlar -->
              <li>
                <a href="#">
                  <div class="article-info">
                    <span class="article-title">Kompyuter grafikasi va dizayn</span>
                    <span class="article-author">A. A. Azimov</span>
                  </div>
                  <div class="article-views">
                    <span class="view-icon">👁️</span> 18,452
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div class="article-info">
                    <span class="article-title">Iqtisodiyot nazariyasi</span>
                    <span class="article-author">Sh. Sh. Shodmonov</span>
                  </div>
                  <div class="article-views">
                    <span class="view-icon">👁️</span> 15,109
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div class="article-info">
                    <span class="article-title">Organik kimyo asoslari</span>
                    <span class="article-author">N. S. Sodiqova</span>
                  </div>
                   <div class="article-views">
                    <span class="view-icon">👁️</span> 11,876
                  </div>
                </a>
              </li>
              <li>
                <a href="#">
                  <div class="article-info">
                    <span class="article-title">Huquqshunoslikka kirish</span>
                    <span class="article-author">B. B. Bahromov</span>
                  </div>
                  <div class="article-views">
                    <span class="view-icon">👁️</span> 9,540
                  </div>
                </a>
              </li>
            </ul>
          </div>
        </aside>

      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import Logo from '~/components/Logo.vue'
import { useHead } from '#imports'

useHead({
  title: 'Referat.uz - O\'zbekistonliklar uchun aqlli bilimlar manbasi',
  meta: [
    { name: 'description', content: 'Minglab referatlar, dissertatsiyalar, maqolalar va ilmiy ishlarning Gemini sun\'iy intellekti yordamida qilingan tahlilini jamlagan sayt. Kerakli ma\'lumotni semantik qidiruv orqali tez va oson toping.' }
  ]
})

// Script qismi o'zgarishsiz qoladi
const searchQuery = ref('')
const router = useRouter()

function performSearch() {
  if (searchQuery.value.trim().length > 2) {
    router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}

const categories = ref([
  { name: 'Avtoreferat', description: 'Ilmiy ishlar va tadqiqotlar himoyasi uchun.', icon: '🎓', iconClass: 'account', queryParam: 'Автореферат' },
  { name: 'Bitiruv malakaviy ishi', description: 'Bakalavr darajasi uchun yakuniy loyihalar.', icon: '📜', iconClass: 'started', queryParam: 'Битирув малакавий иши' },
  { name: 'Maqola', description: 'Ilmiy jurnallar va to\'plamlar uchun materiallar.', icon: '📄', iconClass: 'billing', queryParam: 'Мақола' },
  { name: 'Magistrlik dissertatsiyasi', description: 'Magistratura bosqichi uchun ilmiy tadqiqotlar.', icon: '🔬', iconClass: 'mobile', queryParam: 'Магистрлик диссертацияси' },
  { name: 'Ma\'ruza matni', description: 'Oliy ta\'lim fanlari bo\'yicha ma\'ruza materiallari.', icon: '🗣️', iconClass: 'legal', queryParam: 'Маъруза матни' },
  { name: 'Boshqalar', description: 'Uslubiy qo\'llanmalar, darsliklar va boshqa adabiyotlar.', icon: '📚', iconClass: 'developers', queryParam: 'Бошқалари' }
])
</script>

<style scoped>
/* ===== SIDEBAR UCHUN MAXSUS STIL ===== */
.sidebar .popular-articles li a {
  /* Flexbox yordamida elementlarni ikki chetga suramiz */
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px; /* Oradagi masofa */
}

.article-info .article-title {
  display: block; /* Sarlavha to'liq qatorni egallashi uchun */
  font-size: 14px;
  color: #333;
  font-weight: 500;
  margin-bottom: 4px;
}
.article-info .article-author {
  font-size: 12px;
  color: #888;
}

.article-views {
  font-size: 13px;
  color: #555;
  background-color: #f0f2f5;
  padding: 4px 10px;
  border-radius: 12px;
  white-space: nowrap; /* Raqamlar sig'may qolsa pastga tushmasligi uchun */
  flex-shrink: 0; /* Blok kichrayganda siqilmasligi uchun */
}
.view-icon {
  font-size: 10px;
  margin-right: 4px;
}

/* Qolgan barcha stillar avvalgidek qoladi */
.topic-card-link {
  text-decoration: none;
}
.special-header :deep(.logo-text) {
  color: white;
}
</style>