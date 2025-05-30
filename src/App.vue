<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Navbar from './components/Navbar.vue'
</script>

<template>
  <div class="p-3 h-screen">
    <header class="pb-3">
      <Navbar />
    </header>
    <RouterView />
  </div>
</template>
