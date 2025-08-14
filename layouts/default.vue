<!-- layouts/default.vue -->
<template>
  <div>
    <!-- Bu yerda har bir sahifaning to'liq kontenti (header bilan birga) keladi -->
    <main>
      <slot />
    </main>
    
    <AppFooter />
  </div>
</template>

<script setup>
// Bu yerda hech qanday skript kerak emas
import AppFooter from '~/components/AppFooter.vue';
</script>