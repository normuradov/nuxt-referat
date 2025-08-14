<!-- components/SearchResultCard.vue -->
<template>
  <NuxtLink :to="`/books/${book.ziyonet_id}`" class="article-item-link">
    <div class="article-item">
        <h3>{{ book.title }}</h3>
        <p>{{ book.summary || 'Qisqacha mazmun mavjud emas.' }}</p>
        <div class="article-meta">
          <span>Muallif: {{ book.author || 'Noma\'lum' }}</span>
          <span class="similarity">O'xshashlik: {{ (book.similarity * 100).toFixed(1) }}%</span>
        </div>
    </div>
  </NuxtLink>
</template>

<script setup>
// Bu komponent 'book' nomli obyektni prop sifatida qabul qiladi
defineProps({
  book: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
/* Komponent uchun maxsus stillar */
.article-item-link {
  text-decoration: none;
  color: inherit;
}
.article-item {
    margin-bottom: 25px !important;
}
.article-meta {
  font-size: 13px;
  color: #888;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
}
.similarity {
  font-weight: bold;
  color: #20b2aa;
}
</style>