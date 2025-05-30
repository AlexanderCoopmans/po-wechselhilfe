<script setup>
import { RouterLink } from 'vue-router'
//import TheWelcome from '../components/TheWelcome.vue'
</script>

<template>
  <main class="flex w-full h-full items-center justify-center">
    <div class="grid gap-3 grid-cols-2">
      <RouterLink to="/bwi" class="btn btn-primary text-xl flex-1">BWI</RouterLink>
      <RouterLink to="/bwl" class="btn btn-primary text-xl flex-1">BWL</RouterLink>
    </div>
  </main>
</template>
