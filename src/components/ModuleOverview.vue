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
    <h2 class="font-bold text-xl"><slot name="title"></slot></h2>
    <div
      class="w-full grid gap-3 text-xs md:text-sm"
      :style="{ gridTemplateRows: `repeat(${semesters.length}, 1fr)` }"
    >
      <div
        v-for="semester in semesters"
        :key="semester"
        class="grid gap-3"
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
            v-if="module.group === undefined"
            lang="de"
            class="btn h-full hyphens-auto flex flex-col items-center"
            :class="module.state"
            @click="moduleOnClick(module)"
          >
            <span class="text-center">{{ module.name }}</span>
            <p>{{ module.creditPoints }} cp</p>
          </div>
          <div
            for=""
            v-else
            lang="de"
            class="btn h-full hyphens-auto flex flex-col items-center"
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
</template>
