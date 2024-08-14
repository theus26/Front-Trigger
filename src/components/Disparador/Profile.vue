<script setup lang="ts">
import { mdiAccountCircle } from '@mdi/js'
defineProps<{
  img_url: string
}>()
</script>

<template>
  <div>
    <img class="tw-rounded-3xl" height="48px" width="48px" :src="img_url" v-if="img_url">
    <v-icon class="tw-h-14 tw-w-14" :icon="mdiAccountCircle" v-else />
  </div>
</template>