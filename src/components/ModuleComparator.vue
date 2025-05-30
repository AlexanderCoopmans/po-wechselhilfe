<script setup>
import { reactive, ref } from 'vue'
import ModuleOverview from './ModuleOverview.vue'

const props = defineProps({
  poTransitionData: {
    type: Object,
    required: true,
  },
})

const poTransitionData = reactive(props.poTransitionData)

function onClick() {}
</script>

<template>
  <div class="flex flex-col items-center w-full h-full gap-3">
    <h1 class="font-bold text-3xl"><slot name="title"></slot></h1>
    <div class="grid grid-cols-1 gap-9">
      <ModuleOverview
        :modules="poTransitionData.oldModules"
        :groups="poTransitionData.oldGroups"
        :moduleOnClick="onClick"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
      >
        <template #title> Alte Prüfungsordnung </template>
      </ModuleOverview>
      <ModuleOverview
        :modules="poTransitionData.newModules"
        :groups="poTransitionData.newGroups"
        :moduleOnClick="onClick"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
      >
        <template #title> Neue Prüfungsordnung </template>
      </ModuleOverview>
    </div>
  </div>
</template>
