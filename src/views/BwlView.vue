<script setup>
import ModuleComparator from '../components/ModuleComparator.vue'
import bwlPoTransitionData from '../data/BwlPoTransition.json'
</script>
<template>
  <ModuleComparator :poTransitionData="bwlPoTransitionData">
    <template #title> Bachelor Betriebswirtschaftslehre </template>
  </ModuleComparator>
</template>
