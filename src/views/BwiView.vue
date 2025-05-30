<script setup>
import ModuleComparator from '../components/ModuleComparator.vue'
import bwiPoTransitionData from '../data/BwiPoTransition.json'
</script>
<template>
  <ModuleComparator :poTransitionData="bwiPoTransitionData">
    <template #title> Bachelor Wirtschaftsinformtik </template>
  </ModuleComparator>
</template>
