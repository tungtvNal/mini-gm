<template>
  <div class="bg-black min-h-screen flex flex-col items-center">
    <div
      class="flex flex-col gap-2 justify-center items-center p-4 shadow-2xl bg-[#11172A] w-full"
    >
      <div class="flex flex-wrap justify-center gap-2">
        <UButton
          v-for="color in colors"
          :key="color"
          class="rounded-full w-8 h-8"
          :style="{ backgroundColor: color }"
          @click="floodFill(color)"
        />
      </div>

      <div class="text-center text-gray-400 text-sm md:text-base">
        <p>Số lượt còn lại: {{ movesLeft }}</p>
        <p v-if="winningStreak > 0" class="text-green-500 font-bold">
          {{ winningStreakText }} {{ winningStreak }}
        </p>
      </div>

      <div class="flex flex-wrap justify-center gap-2">
        <UButton @click="initGame">Chơi mới</UButton>
        <UButton color="info" @click="showHelp = true">Trợ giúp</UButton>
        <UButton v-if="!!gridHistory.length && !isWin" @click="undo">↩️ Hoàn tác</UButton>
      </div>
    </div>

    <div
      id="board"
      class="grid border border-gray-300 mt-10 w-full max-w-[90vw] sm:max-w-[400px] aspect-[12/16] gap-[1px] mx-auto"
      :style="gridStyle"
    >
      <div
        v-for="(cell, index) in flatGrid"
        :key="index"
        class="w-full h-full"
        :style="{ backgroundColor: cell.color }"
      />
    </div>

    <HelpModal v-model:open-model="showHelp" :texts="texts" />
  </div>
</template>

<script setup lang="ts">
import { useFloodGame } from "~/composables/useFloodGame";

const {
  flatGrid,
  gridHistory,
  colors,
  floodFill,
  initGame,
  undo,
  movesLeft,
  winningStreak,
  winningStreakText,
  isWin,
  showHelp,
  texts,
  gridStyle,
} = useFloodGame();

onMounted(() => {
  initGame();

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyN") initGame();
  });
});
</script>
