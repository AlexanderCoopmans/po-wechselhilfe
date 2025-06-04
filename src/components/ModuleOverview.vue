<script setup>
import { onMounted, reactive, ref } from 'vue'

const props = defineProps({
  modules: {
    type: Object,
    required: true,
  },

  moduleOnClick: {
    type: Function,
    required: false,
    default: () => {},
  },

  baseCreditPoints: {
    type: Number,
    required: false,
    default: 5,
  },
})

const modules = reactive(props.modules)
const moduleOnClick = props.moduleOnClick || (() => {})
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
</script>

<template>
  <div>
    <div class="flex justify-between">
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
              class="btn h-full hyphens-auto flex flex-col items-center text-xs md:text-sm"
              :class="module.state"
              @click="moduleOnClick(module)"
            >
              <span class="text-center">{{ module.chosenModule || module.name }}</span>
              <p>{{ module.creditPoints }} cp</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
