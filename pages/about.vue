<!-- pages/about.vue -->
<template>
  <div class="about-page-wrapper">
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

    <!-- Sahifa sarlavhasi bo'limi -->
    <section class="page-title-section">
      <div class="page-title-content">
        <h1>Biz haqimizda</h1>
        <p class="subtitle">Referat.uz: Bilimlarni qayta kashf eting</p>
      </div>
    </section>

    <!-- Asosiy matn konteyneri -->
    <main class="content-container">
      <article class="about-content">
        
        <h2>Bizning Maqsadimiz</h2>
        <p>
          Raqamli asrda axborot cheksiz, ammo kerakli va ishonchli ma'lumotni topish tobora qiyinlashib bormoqda. Referat.uz platformasining asosiy maqsadi — O‘zbekistondagi talabalar, tadqiqotchilar va bilimga chanqoq har bir inson uchun ilmiy adabiyotlar olamini qayta kashf etishga yordam berishdir. Biz murakkab ma'lumotlarni sodda, qulay va tezkor usulda taqdim etish orqali ta'lim jarayonini osonlashtirishni o'z oldimizga maqsad qilib qo'yganmiz.
        </p>
        
        <div class="highlight-box">
            <h4>Missiyamiz</h4>
            <p>Eng ilg‘or texnologiyalarni qo‘llagan holda, O‘zbekiston ilmiy salohiyatini ommalashtirish va har bir foydalanuvchi uchun bilimlar eshigini keng ochish.</p>
        </div>

        <h2>Texnologiyalarimiz: Oddiylik Ortidagi Kuch</h2>
        <p>
          Referat.uz shunchaki elektron kutubxona emas. Bu — sun'iy intellektga asoslangan aqlli yordamchi. Bizning platformamiz quyidagi zamonaviy texnologiyalardan unumli foydalanadi:
        </p>
        <ul>
          <li>
            <strong>Gemini AI bilan chuqur tahlil:</strong> Har bir kitob, maqola yoki dissertatsiya Google'ning kuchli Gemini sun'iy intellekt modeli tomonidan chuqur tahlil qilinadi. Gemini asarning shunchaki sarlavhasini emas, balki uning butun mazmun-mohiyatini "o'qiydi", asosiy g'oyalarni aniqlaydi, mavzularga ajratadi va qisqacha xulosalar (summary) yaratadi. Bu sizga kitobni yuklab olishdan oldin uning siz uchun foydali ekanligini tezda aniqlash imkonini beradi.
          </li>
          <li>
            <strong>Semantic Search (Ma'noviy Qidiruv):</strong> Oddiy qidiruv tizimlari siz yozgan kalit so'zlarni qidiradi. Biz esa bundan bir qadam oldindamiz. Eng kuchli embedding modellari yordamida biz "semantik" qidiruvni amalga oshiramiz. Bu degani, tizim sizning so'rovingizning ma'nosini tushunadi. Masalan, siz "Amir Temur davridagi me'morchilik" deb yozsangiz, tizim nafaqat shu so'zlar qatnashgan, balki "sohibqiron bunyodkorligi", "Temuriylar renessansi qurilishlari" kabi ma'nodosh iboralar mavjud bo'lgan manbalarni ham topib beradi.
          </li>
        </ul>
        
        <h2>Nima uchun Referat.uz?</h2>
        <p>
          Biz sizga shunchaki ma'lumot emas, balki qimmatli vaqt va aniqlik taqdim etamiz. Biz bilan siz:
        </p>
        <ul>
          <li><strong>Vaqtingizni tejang:</strong> Keraksiz adabiyotlarni o'qib o'tirmaysiz, sun'iy intellekt tahlili orqali eng keraklisini topasiz.</li>
          <li><strong>Yashirin bilimlarni kashf eting:</strong> Ma'noviy qidiruv orqali to'g'ridan-to'g'ri bog'liq bo'lmagan, ammo mazmunan yaqin bo'lgan qimmatli manbalarni toping.</li>
          <li><strong>Ilhom oling:</strong> Yangi g'oyalar, tadqiqot mavzulari va referatlar uchun ishonchli poydevor yarating.</li>
        </ul>

      </article>
    </main>
  </div>
</template>

<script setup>
import { useHead } from '#imports'

useHead({
  title: 'Biz haqimizda - Referat.uz',
  meta: [
    { name: 'description', content: 'Referat.uz loyihasining maqsadi, missiyasi va biz foydalanadigan zamonaviy texnologiyalar, jumladan Gemini AI va semantik qidiruv haqida bilib oling.' }
  ]
})
</script>

<style scoped>
.about-page-wrapper {
  background-color: #f8f9fa;
  min-height: 100vh;
}
.green-header {
  background-color: #20b2aa;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}
.green-header .nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 15px 20px;
}
.green-header .logo, .green-header .nav-links a {
  color: white;
}
.header-content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.page-title-section {
  background-color: white;
  padding: 40px 20px;
  text-align: center;
  border-bottom: 1px solid #e9ecef;
}
.page-title-section h1 {
  font-size: 36px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}
.page-title-section .subtitle {
  font-size: 18px;
  color: #666;
}

.content-container {
  max-width: 900px; /* Matn o'qilishi oson bo'lishi uchun enini kichraytiramiz */
  margin: 40px auto;
  padding: 20px;
}

.about-content {
  background-color: white;
  padding: 40px;
  border-radius: 8px;
  border: 1px solid #e9ecef;
  font-size: 16px;
  line-height: 1.8;
  color: #333;
}

.about-content h2 {
  font-size: 24px;
  font-weight: 600;
  margin-top: 30px;
  margin-bottom: 15px;
  border-bottom: 2px solid #20b2aa;
  padding-bottom: 5px;
}
.about-content h2:first-of-type {
  margin-top: 0;
}

.about-content p {
  margin-bottom: 20px;
}

.about-content ul {
  list-style-type: none;
  padding-left: 0;
}

.about-content ul li {
  position: relative;
  padding-left: 25px;
  margin-bottom: 15px;
}

.about-content ul li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #20b2aa;
  font-weight: bold;
}

.highlight-box {
  background: #e8f8f5;
  border-left: 4px solid #20b2aa;
  border-radius: 4px;
  padding: 20px;
  margin: 25px 0;
}
.highlight-box h4 {
  color: #20b2aa;
  font-weight: 600;
  margin-bottom: 5px;
}
.highlight-box p {
  color: #333;
  margin-bottom: 0;
  font-size: 15px;
}
</style>