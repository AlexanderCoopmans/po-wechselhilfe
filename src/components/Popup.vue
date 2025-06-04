<script setup>
import { onMounted, ref } from 'vue'

const emit = defineEmits(['close'])

const dialogElement = ref(null)

function open() {
  dialogElement.value?.showModal()
}

function close() {
  dialogElement.value?.close()
}

defineExpose({
  open,
  close,
})

onMounted(() => {
  dialogElement.value?.addEventListener('close', () => {
    emit('close')
  })
})
</script>

<template>
  <dialog id="my_modal" class="modal" ref="dialogElement">
    <div class="modal-box relative">
      <div class="flex w-full justify-end mb-3">
        <button class="btn btn-sm btn-circle" @click="close" aria-label="Close modal">✕</button>
      </div>

      <slot></slot>
    </div>
    <form method="dialog" class="modal-backdrop" @click="close">
      <button type="button">close</button>
    </form>
  </dialog>
</template>
