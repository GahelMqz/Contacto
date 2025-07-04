<template>
  <h4 class="text-red-600 pt-2 pb-4 font-bold">
    <ErrorMessage v-bind:name="name" />
  </h4>
</template>

<script setup lang="ts">
import { ErrorMessage } from 'vee-validate'

defineProps({
  name: {
    type: String,
    required: true,
  },
})
</script>
