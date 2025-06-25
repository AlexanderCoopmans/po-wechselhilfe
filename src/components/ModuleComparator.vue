<script setup>
/**
 * moduleComparator.vue - Module Comparison and Transition Component
 *
 * This Vue component provides an interactive interface for comparing and mapping modules
 * between two examination regulations (old and new). It allows users to select, transfer,
 * and reset module transitions, displaying progress and credit points for both regulations.
 * The component supports group-based module selection and handles various transition types,
 * such as "Übertragung", "Anerkennung", and "keine Entsprechung".
 *
 * @component
 *
 *
 *
 * @example
 * <module-comparator :poTransitionData="transitionData">
 *   <template #title>Modulvergleich</template>
 * </module-comparator>
 */

import { reactive, ref, computed } from 'vue'
import ModuleOverview from './ModuleOverview.vue'
import Popup from './Popup.vue'
import Legend from './Legend.vue'
import Info from './Info.vue'

const props = defineProps({
  /**
   * The data object containing all information about the module transition process.
   * Must include:
   *   - oldModules: Array of old module objects (with at least `name`, `creditPoints`, `transition`, and optionally `group`).
   *   - newModules: Array of new module objects (with at least `name`, `creditPoints`, and optionally `group`).
   *   - oldGroups: Object mapping group names to arrays of choice modules (for grouped selection).
   *   - baseCreditPoints: Number, base credit points for overview display.
   *   - infoPos1, infoPos2, infoPos3: Optional info objects for contextual messages.
   * @type {Object}
   * @required
   */
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

/**
 * Activates a new module based on the provided transition object.
 *
 * This function updates the state of a module in `poTransitionData.newModules` according to the transition details.
 * - If the transition has a `group`, it tries to find a module with a matching `chosenModule` or an unassigned module in the same group.
 * - If no group is specified, it finds the module by its `name`.
 * - Once found, it sets the module's `chosenModule` and updates its `state` based on the transition type.
 *
 * @param {Object} transition - The transition object containing details for module activation.
 * @param {string} [transition.group] - The group identifier for the module (optional).
 * @param {string} transition.newModule - The name of the new module to activate.
 * @param {string} transition.type - The type of transition ('Übertragung' or other).
 */
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

/**
 * Deactivates the selected new module in the transition process.
 *
 * This function searches for the corresponding module in `poTransitionData.newModules`
 * based on the provided `transition` object. If a group is specified in the transition,
 * it first tries to find a module with a matching `chosenModule`. If not found, it looks
 * for a module in the same group that has not yet been chosen. If a module is found,
 * it resets its `chosenModule` property to `undefined` and clears its `state`.
 * If no group is specified, it finds the module by its `name` and clears its `state`.
 *
 * @param {Object} transition - The transition object containing information about the module to deactivate.
 * @param {string|undefined} transition.group - The group identifier for the module (optional).
 * @param {string} transition.newModule - The name of the new module to deactivate.
 */
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

/**
 * Handles the click event for an old module in the module comparator.
 *
 * - If the module is part of a group, selects the module and opens the selection dialog.
 * - If the module is in a neutral state:
 *   - If there is no corresponding transition, marks the module as an error.
 *   - Otherwise, sets the module state based on the transition type and activates the corresponding new module.
 * - If the module is not in a neutral state:
 *   - Resets the module state to neutral.
 *   - If there is a corresponding transition, deactivates the corresponding new module.
 *
 * @param {Object} module - The old module object being interacted with.
 * @param {string} module.state - The current state of the module button.
 * @param {Object} module.transition - The transition information for the module.
 * @param {string} module.transition.type - The type of transition ('keine Entsprechung', 'Übertragung', etc.).
 * @param {string} [module.group] - Optional group identifier for grouped modules.
 */
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

/**
 * Handles the selection of a choice module.
 *
 * - Resets the state of the currently selected module to 'btn-neutral'.
 * - If a transition exists on the selected module, deactivates the current transition and clears the chosen module.
 * - If a new choice module is provided:
 *   - Determines the transition type and sets the corresponding button state.
 *   - Updates the selected module with the new chosen module, state, and transition.
 *   - Activates the new transition.
 * - Finally, clears the selected module and closes the module selection dialog.
 *
 * @param {Object} choiceModule - The module selected by the user. May be undefined.
 */
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

/**
 * Resets the state of all modules in the `poTransitionData` object.
 *
 * - For each module in `oldModules`, sets `state` to 'btn-neutral' and clears `chosenModule`.
 * - For each module in `newModules`, clears `state` and `chosenModule`.
 *
 * This function is typically used to revert any selections or state changes made to the modules,
 * restoring them to their initial, unselected state.
 */
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

/**
 * Computes the total credit points from the old modules where the module's state is not 'btn-neutral'.
 * Iterates over all old modules in `poTransitionData.oldModules` and sums up the `creditPoints`
 * for each module whose `state` property is different from 'btn-neutral'.
 *
 * @returns {number} The sum of credit points for all qualifying old modules.
 */
const oldModulesAllCpts = computed(() =>
  poTransitionData.oldModules.reduce((sum, module) => {
    return sum + (module.state !== 'btn-neutral' ? module.creditPoints : 0)
  }, 0),
)

/**
 * Computes the number of completed old modules.
 * Iterates over the `oldModules` array from `poTransitionData` and counts
 * each module whose `state` is not `'btn-neutral'`, indicating completion.
 *
 * @returns {number} The count of completed old modules.
 */
const oldModulesCompleted = computed(() =>
  poTransitionData.oldModules.reduce((sum, module) => {
    return sum + (module.state !== 'btn-neutral' ? 1 : 0)
  }, 0),
)

/**
 * Computes the number of uncompleted old modules by subtracting the count of completed old modules
 * from the total number of old modules in the poTransitionData.
 *
 * @returns {number} The number of old modules that are not yet completed.
 */
const oldModulesUncompleted = computed(
  () => poTransitionData.oldModules.length - oldModulesCompleted.value,
)

/**
 * Computes the total credit points of all new modules whose state is not empty.
 * Iterates over the `poTransitionData.newModules` array and sums the `creditPoints`
 * for each module where the `state` property is not an empty string.
 *
 * @returns {number} The sum of credit points for all new modules with a non-empty state.
 */
const newModulesAllCpts = computed(() =>
  poTransitionData.newModules.reduce((sum, module) => {
    return sum + (module.state !== '' ? module.creditPoints : 0)
  }, 0),
)

/**
 * Computes the number of new modules that have a non-empty state.
 * Iterates over the 'newModules' array in 'poTransitionData' and counts
 * each module where the 'state' property is not an empty string.
 *
 * @returns {number} The count of new modules with a non-empty state.
 */
const newModulesCompleted = computed(() =>
  poTransitionData.newModules.reduce((sum, module) => {
    return sum + (module.state !== '' ? 1 : 0)
  }, 0),
)

/**
 * Computes the number of new modules that are not yet completed.
 * It subtracts the number of completed new modules from the total number of new modules
 * in the poTransitionData object.
 *
 * @returns {number} The count of uncompleted new modules.
 */
const newModulesUncompleted = computed(
  () => poTransitionData.newModules.length - newModulesCompleted.value,
)
</script>

<template>
  <Popup ref="choseModuleDialog">
    <template #title>Wahlmodul</template>
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
    <h1 class="font-bold text-3xl">
      <!-- @slot The title -->
      <slot name="title"></slot>
    </h1>
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
