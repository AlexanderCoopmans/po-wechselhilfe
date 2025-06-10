<script setup>
import { reactive, ref, computed } from 'vue'
import ModuleOverview from './ModuleOverview.vue'
import Popup from './Popup.vue'
import Legend from './Legend.vue'
import Info from './Info.vue'

const props = defineProps({
  poTransitionData: {
    type: Object,
    required: true,
  },
})

const poTransitionData = reactive(props.poTransitionData)

poTransitionData.oldModules = poTransitionData.oldModules.map((module) => {
  return {
    state: 'btn-neutral',
    ...module,
  }
})

poTransitionData.newModules = poTransitionData.newModules.map((module) => {
  return {
    state: '',
    ...module,
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
    module.state = transition.type === 'Übertragung' ? 'btn-primary' : 'btn-secondary'
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

const oldModulesAllCpts = computed(() =>
  poTransitionData.oldModules.reduce((sum, module) => {
    return sum + (module.state !== 'btn-neutral' ? module.creditPoints : 0)
  }, 0),
)

const oldModulesCompleted = computed(() =>
  poTransitionData.oldModules.reduce((sum, module) => {
    return sum + (module.state !== 'btn-neutral' ? 1 : 0)
  }, 0),
)

const oldModulesUncompleted = computed(
  () => poTransitionData.oldModules.length - oldModulesCompleted.value,
)

const newModulesAllCpts = computed(() =>
  poTransitionData.newModules.reduce((sum, module) => {
    return sum + (module.state !== '' ? module.creditPoints : 0)
  }, 0),
)

const newModulesCompleted = computed(() =>
  poTransitionData.newModules.reduce((sum, module) => {
    return sum + (module.state !== '' ? 1 : 0)
  }, 0),
)

const newModulesUncompleted = computed(
  () => poTransitionData.newModules.length - newModulesCompleted.value,
)
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
    <div class="flex flex-col w-full items-center gap-9">
      <div class="w-full flex justify-between items-center">
        <Legend />
        <button class="btn btn-warning" @click="reset">Reset</button>
      </div>
      <div v-if="poTransitionData.infoPos1">
        <Info :message="poTransitionData.infoPos1.text" :type="poTransitionData.infoPos1.type" />
      </div>
      <ModuleOverview
        :modules="poTransitionData.oldModules"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
        @moduleClick="oldModuleOnClick"
      >
        <template #title-left> Alte Prüfungsordnung </template>
        <template #title-right>
          <div class="flex gap-3">
            <span
              >Bestanden: <b>{{ oldModulesCompleted }}</b></span
            >
            <span
              >Offen: <b>{{ oldModulesUncompleted }}</b></span
            >
            <span
              >cp: <b>{{ oldModulesAllCpts }}</b></span
            >
          </div>
        </template>
      </ModuleOverview>
      <div v-if="poTransitionData.infoPos2">
        <Info :message="poTransitionData.infoPos2.text" :type="poTransitionData.infoPos2.type" />
      </div>
      <ModuleOverview
        :modules="poTransitionData.newModules"
        :baseCreditPoints="poTransitionData.baseCreditPoints"
      >
        <template #title-left> Neue Prüfungsordnung </template>
        <template #title-right>
          <div class="flex gap-3">
            <span
              >Angerechnet: <b>{{ newModulesCompleted }}</b></span
            >
            <span
              >Offen: <b>{{ newModulesUncompleted }}</b></span
            >
            <span
              >cp: <b>{{ newModulesAllCpts }}</b></span
            >
          </div>
        </template>
      </ModuleOverview>
      <div v-if="poTransitionData.infoPos3">
        <Info :message="poTransitionData.infoPos3.text" :type="poTransitionData.infoPos3.type" />
      </div>
    </div>
  </div>
</template>
