<script setup>
import { reactive, ref } from 'vue'
import ModuleOverview from './ModuleOverview.vue'
import Popup from './Popup.vue'

const props = defineProps({
  poTransitionData: {
    type: Object,
    required: true,
  },
})

const poTransitionData = reactive(props.poTransitionData)

poTransitionData.oldModules = poTransitionData.oldModules.map((module) => {
  return {
    ...module,
    state: 'btn-neutral',
  }
})

poTransitionData.newModules = poTransitionData.newModules.map((module) => {
  return {
    ...module,
    state: '',
  }
})

function activateNewModule(transition) {
  const group = transition.group
  let module
  if (group !== undefined) {
    module = poTransitionData.newModules.find((m) => m.chosenModule === transition.newModule)
    if (!module) {
      module = poTransitionData.newModules.find((m) => m.group === group && !m.chosenModule)
    }
    if (!module) {
      return
    }
    module.chosenModule = transition.newModule
  } else {
    module = poTransitionData.newModules.find((m) => m.name === transition.newModule)
  }

  if (module) {
    module.state = 'btn-primary'
  }
}

function deactivateNewModule(transition) {
  const group = transition.group
  let module
  if (group !== undefined) {
    module = poTransitionData.newModules.find((m) => m.chosenModule === transition.newModule)
    if (!module) {
      module = poTransitionData.newModules.find((m) => m.group === group && !m.chosenModule)
    }
    if (!module) {
      return
    }
    module.chosenModule = undefined
  } else {
    module = poTransitionData.newModules.find((m) => m.name === transition.newModule)
  }

  if (module) {
    module.state = ''
  }
}

function oldModuleOnClick(module) {
  if (module.group !== undefined) {
    selectedModule.value = module
    choseModuleDialog.value.open()
    return
  }

  const transition = module.transition
  if (module.state === 'btn-neutral') {
    if (transition.type === 'keine Entsprechung') {
      module.state = 'btn-error'
      return
    }
    module.state = transition.type === 'Übertragung' ? 'btn-primary' : 'btn-secondary'
    activateNewModule(transition)
    return
  }

  module.state = 'btn-neutral'
  if (transition.type === 'keine Entsprechung') {
    return
  }
  deactivateNewModule(transition)
}

const choseModuleDialog = ref(null)
const selectedModule = ref(null)
function onChoiceModuleSelected(choiceModule) {
  selectedModule.value.state = 'btn-neutral'
  if (selectedModule.value.transition) {
    deactivateNewModule(selectedModule.value.transition)
    selectedModule.value.chosenModule = undefined
  }
  if (choiceModule !== undefined) {
    const transition = choiceModule.transition

    const transitionType = {
      'keine Entsprechung': 'btn-error',
      Übertragung: 'btn-primary',
      Anerkennung: 'btn-secondary',
    }

    selectedModule.value.chosenModule = choiceModule.name
    selectedModule.value.state = transitionType[transition.type]
    selectedModule.value.transition = transition
    activateNewModule(transition)
  }

  selectedModule.value = null
  choseModuleDialog.value.close()
}

function reset() {
  poTransitionData.oldModules.forEach((module) => {
    module.state = 'btn-neutral'
    module.chosenModule = undefined
  })
  poTransitionData.newModules.forEach((module) => {
    module.state = ''
    module.chosenModule = undefined
  })
}
</script>

<template>
  <Popup ref="choseModuleDialog">
    <div v-if="selectedModule !== null" class="grid gap-3 grid-cols-1">
      <button class="btn btn-error" @click="onChoiceModuleSelected()">Auswahl Aufheben</button>
      <div
        v-for="choiceModule in poTransitionData.oldGroups[selectedModule.group]"
        :key="choiceModule"
      >
        <button
          class="btn btn-primary w-full"
          :disabled="
            poTransitionData.oldModules.some((element) => {
              return element.chosenModule === choiceModule.name
            })
          "
          @click="onChoiceModuleSelected(choiceModule)"
        >
          {{ choiceModule.name }}
        </button>
      </div>
    </div>
  </Popup>
  <div class="flex flex-col items-center w-full h-full gap-3">
    <h1 class="font-bold text-3xl"><slot name="title"></slot></h1>
    <div class="w-full flex justify-end">
      <button class="btn btn-warning" @click="reset">Reset</button>
    </div>

    <div class="grid grid-cols-1 gap-9">
      <ModuleOverview
        :modules="poTransitionData.oldModules"
        :moduleOnClick="oldModuleOnClick"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
      >
        <template #title> Alte Prüfungsordnung </template>
      </ModuleOverview>
      <ModuleOverview
        :modules="poTransitionData.newModules"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
      >
        <template #title> Neue Prüfungsordnung </template>
      </ModuleOverview>
    </div>
  </div>
</template>
