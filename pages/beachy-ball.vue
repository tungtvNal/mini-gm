<script setup>
import Control from "~/components/Control.vue";
import Main from "~/components/Main.vue";
import { useGameStore } from "~/stores/useGameStore";

const { isInGame } = storeToRefs(useGameStore());
</script>

<template>
  <Control v-if="isInGame">
    <slot />
  </Control>

  <Main v-else />
</template>

<style scoped>
/* CSS */
</style>
