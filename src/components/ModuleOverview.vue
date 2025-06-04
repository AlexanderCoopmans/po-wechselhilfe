<script setup>
import { reactive, ref } from 'vue'

const props = defineProps({
  modules: {
    type: Object,
    required: true,
  },

  baseCreditPoints: {
    type: Number,
    required: false,
    default: 5,
  },
})

const emit = defineEmits(['moduleClick'])

function moduleOnClick(module) {
  emit('moduleClick', module)
}

const modules = reactive(props.modules)
const baseCreditPoints = ref(props.baseCreditPoints)

const numberOfSemesters = modules.reduce((max, module) => {
  return Math.max(max, module.semester)
}, 0)

const semesters = reactive([])
for (let i = 1; i <= numberOfSemesters; i++) {
  semesters.push(modules.filter((module) => module.semester === i))
}

const maxModulesPerSemester = semesters.reduce((max, semester) => {
  return Math.max(max, semester.length)
}, 0)

function alert(messsage) {
  window.alert(messsage)
}
</script>

<template>
  <div>
    <div class="flex justify-between mb-1">
      <h2 class="font-bold text-xl"><slot name="title-left"></slot></h2>
      <slot name="title-right"></slot>
    </div>
    <div
      class="w-full grid gap-3"
      :style="{ gridTemplateRows: `repeat(${semesters.length}, 1fr)` }"
    >
      <div
        v-for="(semester, semesterIndex) in semesters"
        :key="semester"
        class="flex items-center gap-3"
      >
        <span class="text-2xl">{{ semesterIndex + 1 }}</span>
        <div
          class="grid gap-3 h-full w-full"
          :style="{ gridTemplateColumns: `repeat(${maxModulesPerSemester}, 1fr)` }"
        >
          <div
            v-for="module in semester"
            :key="module"
            :style="{
              'grid-column': `span ${Math.max(1, parseInt(module.creditPoints / baseCreditPoints))} / span ${Math.max(1, parseInt(module.creditPoints / baseCreditPoints))}`,
            }"
          >
            <div
              for=""
              lang="de"
              class="relative btn p-1 h-full hyphens-auto flex flex-col items-center text-xs md:text-sm"
              :class="module.state"
              @click="moduleOnClick(module)"
            >
              <div class="absolute bottom-1 right-1 flex">
                <svg
                  v-if="module.info"
                  class="size-5 cursor-help"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  @click.stop="alert(module.info)"
                >
                  <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="square"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    ></circle>
                    <path
                      d="m12,17v-5.5c0-.276-.224-.5-.5-.5h-1.5"
                      fill="none"
                      stroke="currentColor"
                      stroke-linecap="square"
                      stroke-miterlimit="10"
                      stroke-width="2"
                    ></path>
                    <circle
                      cx="12"
                      cy="7.25"
                      r="1.25"
                      fill="currentColor"
                      stroke-width="2"
                    ></circle>
                  </g>
                </svg>
                <svg
                  v-if="module.group"
                  title="Wahlmodul"
                  class="size-5 cursor-help pointer-events-auto"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  @click.stop="alert('Wahlmodul')"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-width="2"
                    d="M9 8h10M9 12h10M9 16h10M4.99 8H5m-.02 4h.01m0 4H5"
                  />
                </svg>
              </div>
              <span class="text-center">{{ module.chosenModule || module.name }}</span>
              <p>{{ module.creditPoints }} cp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
