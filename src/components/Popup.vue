<script setup>
/**
 * Popup.vue - Modal Dialog Component
 *
 * This Vue component provides a modal dialog using the native <dialog> element.
 * It exposes `open` and `close` methods for programmatic control and emits a `close` event
 * when the dialog is closed by the user or programmatically.
 *
 * @component
 *
 *
 * @example
 *   <Popup ref="popup" @close="onClose">
 *     <p>Dialog content goes here.</p>
 *   </Popup>
 */

import { onMounted, ref } from 'vue'

/**
 * Emits the 'close' event when the dialog is closed.
 * @event close
 */
const emit = defineEmits(['close'])

/**
 * Reference to the native dialog element.
 * @type {import('vue').Ref<HTMLDialogElement | null>}
 */
const dialogElement = ref(null)

/**
 * Opens the modal dialog.
 * Can be called from the parent via ref.
 */
function open() {
  dialogElement.value?.showModal()
}

/**
 * Closes the modal dialog.
 * Can be called from the parent via ref or by user interaction.
 */
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
      <div class="flex w-full justify-between mb-3">
        <h2 class="text-2xl font-semibold">
          <slot name="title"></slot>
        </h2>
        <button class="btn btn-sm btn-circle" @click="close" aria-label="Close modal">✕</button>
      </div>

      <!-- @slot The Content -->
      <slot></slot>
    </div>
    <form method="dialog" class="modal-backdrop" @click="close">
      <button type="button">close</button>
    </form>
  </dialog>
</template>
