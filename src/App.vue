<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="p-3 h-full min-h-screen" data-theme="light">
    <header class="pb-3">
      <Navbar />
    </header>
    <RouterView />
  </div>
</template>
