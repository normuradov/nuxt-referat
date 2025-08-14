<!-- components/Logo.vue -->
<template>
  <NuxtLink to="/" class="logo-link">
    <img 
      src="~/public/logo.webp" 
      alt="Referat.uz saytining logotipi" 
      class="logo-image"
    >
    <span class="logo-text">eferat.uz</span>
  </NuxtLink>
</template>

<style scoped>
.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  font-weight: 300;
  font-size: 48px;
  color: inherit; /* Matn rangi ota-elementdan olinadi */
}

.logo-image {
  height: 42px; /* Logotip balandligi */
  width: auto;
}
</style>