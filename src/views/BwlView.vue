<script setup>
import { reactive, watch } from 'vue'

import ModuleComparator from '../components/ModuleComparator.vue'
import bwlPoTransitionDataJson from '../data/BwlPoTransition.json'

const bwlPoTransitionData = reactive(bwlPoTransitionDataJson)

watch(
  () => bwlPoTransitionData.oldModules,
  (newState, oldState) => {
    const relevantModules = newState.filter(
      (module) =>
        module.transition !== undefined &&
        module.transition.type !== 'keine Entsprechung' &&
        module.transition.group === 'Schwerpunkt' &&
        module.state !== 'btn-neutral',
    )

    if (relevantModules.length === 0) {
      return
    }

    const schwerpunkteAccObj = relevantModules.reduce((currentState, module) => {
      for (let schwerpunkt of module.transition.schwerpunkte) {
        currentState[schwerpunkt] =
          currentState[schwerpunkt] === undefined ? 1 : currentState[schwerpunkt] + 1
      }
      return currentState
    }, {})
    const schwerpunkteAccArr = Object.entries(schwerpunkteAccObj)
    if (schwerpunkteAccArr.length <= 2) {
      return
    }
    const schwerpunkteAccArrSorted = schwerpunkteAccArr.sort((a, b) => b[1] - a[1])
    const schwerpunkt1 = schwerpunkteAccArrSorted[0][0]
    const schwerpunkt2 = schwerpunkteAccArrSorted[1][0]
    for (let module of relevantModules) {
      const newModuleSchwerpunkte = module.transition.schwerpunkte
      const corNewModule = bwlPoTransitionData.newModules.find(
        (newModule) => newModule.chosenModule === module.transition.newModule,
      )
      let state
      if (
        newModuleSchwerpunkte.includes(schwerpunkt1) ||
        newModuleSchwerpunkte.includes(schwerpunkt2)
      ) {
        state = module.transition.type === 'Übertragung' ? 'btn-primary' : 'btn-secondary'
      } else {
        state = 'btn-error'
      }
      module.state = state
      if (corNewModule) {
        corNewModule.state = state
      }
    }
  },
  { deep: true, immediate: false },
)
</script>
<template>
  <ModuleComparator :poTransitionData="bwlPoTransitionData">
    <template #title> Bachelor Betriebswirtschaftslehre </template>
  </ModuleComparator>
</template>
