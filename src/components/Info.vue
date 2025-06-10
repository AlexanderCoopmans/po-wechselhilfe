<script setup>
/**
 * Info.vue - Alert/Notification Component
 *
 * This Vue component displays an alert box with a message and an icon,
 * supporting four types: 'info', 'success', 'warning', and 'error'.
 * The alert style and icon change according to the `type` prop.
 *
 * @component
 *
 * @example
 * <Info type="success" message="Operation completed successfully!" />
 */

defineProps({
  /**
   * The type of alert to display. Determines the color and icon.
   * Accepted values: 'info', 'success', 'warning', 'error'.
   * @type {String}
   * @default 'info'
   */
  type: {
    type: String,
    default: 'info',
    required: false,
  },

  /**
   * The message to display inside the alert box.
   * @type {String}
   * @default 'This is an info message.'
   */
  message: {
    type: String,
    default: 'This is an info message.',
  },
})

const typeClasses = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
}
</script>

<template>
  <div class="alert" :class="typeClasses[type]">
    <svg
      v-if="type === 'info'"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      class="h-6 w-6 shrink-0 stroke-current"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
      ></path>
    </svg>
    <svg
      v-if="type === 'success'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <svg
      v-if="type === 'warning'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
    <svg
      v-if="type === 'error'"
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span class="text-base font-semibold">{{ message }}</span>
  </div>
</template>
