<template>
  <div class="flex flex-col items-center gap-4 relative">
    <TresCanvas window-size clear-color="#82DBC5">
      <TresPerspectiveCamera
        ref="cameraRef"
        :position="cameraPosition"
        :look-at="[0, 0, 0]"
      />
      <OrbitControls ref="controlsRef" :min-distance="25" :max-distance="50" />
      <TresAmbientLight :intensity="1" />
      <TresDirectionalLight :position="[10, 10, 10]" :intensity="1" />
      <TresGroup>
        <Block3D
          v-for="(cell, index) in flatGrid"
          :key="index"
          :color="cell.color"
          :x="cell.x"
          :y="cell.y"
          :height="cell.height"
          :width-offset="WIDTH / 2"
          :height-offset="HEIGHT / 2"
        />
      </TresGroup>
    </TresCanvas>

    <div
      class="absolute top-0 left-0 right-0 flex flex-col gap-1 justify-center items-center p-2 shadow-2xl bg-[#11172A]"
    >
      <div class="flex gap-2">
        <UButton
          v-for="color in colors"
          :key="color"
          class="rounded-full w-8 h-8"
          :style="{ backgroundColor: color }"
          @click="floodFill(color)"
        />
      </div>

      <div class="text-center text-gray-600">
        <p>{{ movesLeft }} moves left</p>
        <p v-if="isWin" class="text-green-600 font-bold">🎉 You win!</p>
      </div>

      <div class="flex gap-2">
        <UButton @click="initGame">New Game</UButton>
        <UButton color="info" @click="showHelp = true">Help</UButton>
        <UButton v-if="!!gridHistory.length" @click="undo"> ⬅️ Back </UButton>
      </div>
    </div>
    <HelpModal v-model:open-model="showHelp" :texts="texts" />
  </div>
</template>

<script setup lang="ts">
import { Vector3 } from "three";
import Block3D from "~/components/Block3D.vue";
import { useFloodGame } from "~/composables/useFloodGame";

import type { PerspectiveCamera } from "three";

const {
  flatGrid,
  gridHistory,
  colors,
  floodFill,
  initGame,
  undo,
  movesLeft,
  isWin,
  showHelp,
  texts,
  WIDTH,
  HEIGHT,
} = useFloodGame();

const cameraRef = ref<PerspectiveCamera | null>(null);

const controlsRef = ref<null>(null);

const getCameraPosition = () => {
  return window.innerWidth < 768
    ? new Vector3(0, 40, 0)
    : new Vector3(0, 20, 0);
};

const cameraPosition = ref(getCameraPosition());

const resetCamera = () => {
  if (cameraRef.value && controlsRef.value) {
    cameraRef.value.position.copy(cameraPosition.value);
  }
};

const handleResize = () => {
  cameraPosition.value = getCameraPosition();
};

onMounted(() => {
  initGame();

  window.addEventListener("resize", handleResize);

  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyN") initGame();
    resetCamera();
  });
});

onUnmounted(() => {
  // Cleanup event listeners
  window.removeEventListener("resize", handleResize);
});
</script>
