<script setup>
import { onMounted, ref } from "vue";
import { useGameStore } from "~/stores/useGameStore";
import { getLocalStorage, setLocalStorage } from "@/utils/storage";

import LogoBall from "@/assets/images/logo_ball_stroke.svg";
import Wordmark from "@/assets/images/wordmark.svg";
import MichaelLogo from "@/assets/images/mm_white.svg";

const {
  mode,
  setMode,
  blocksCount,
  setBlocksCount,
  level,
  setLevel,
  difficulty,
  setDifficulty,
  setIsInGame,
} = useGameStore();

const isSettings = ref(false);

onMounted(() => {
  window.addEventListener("keydown", (e) => {
    if (e.code === "Enter") {
      startGame();
    }
  });
});

const difficulties = [
  { label: "Easy", value: 1 },
  { label: "Medium", value: 3 },
  { label: "Hard", value: 5 },
  { label: "Evil", value: 10 },
];

const blockOptions = [5, 10, 15, 20, 30, 40, 50, 100];
const beaches = ["copacabana", "santamonica"];

const startGame = () => {
  setIsInGame(true);
};

const setModeValue = (val) => {
  setMode(val);
};

const setDifficultyValue = (val) => {
  setDifficulty(val);
  setLocalStorage("difficulty", val);
};

const setBlocksCountValue = (val) => {
  setBlocksCount(val);
  setLocalStorage("blocksCount", val);
};

const setLevelValue = (val) => {
  setLevel(val);
  setLocalStorage("level", val);
};

const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);
</script>

<template>
  <div class="main-menu">
    <img class="logo-ball" :src="LogoBall" />
    <img class="wordmark" :src="Wordmark" />

    <div class="main-menu-button" @click="startGame">Play</div>

    <div v-if="!isSettings" class="main-menu-button" @click="isSettings = true">
      Settings
    </div>

    <template v-else>
      <div class="main-menu-section-title">Mode</div>
      <div class="main-menu-selection-area">
        <div
          v-for="m in ['random', 'tour', 'adventure']"
          :key="m"
          class="main-menu-selection"
          :class="{ 'main-menu-selected': mode === m }"
          @click="setModeValue(m)"
        >
          {{ capitalize(m) }}
        </div>
      </div>

      <template v-if="mode === 'random'">
        <div class="main-menu-section-title">Difficulty</div>
        <div class="main-menu-selection-area">
          <div
            v-for="d in difficulties"
            :key="d.value"
            class="main-menu-selection"
            :class="{ 'main-menu-selected': parseInt(difficulty) === d.value }"
            @click="setDifficultyValue(d.value)"
          >
            {{ d.label }}
          </div>
        </div>

        <div class="main-menu-section-title">Number of Blocks</div>
        <div class="main-menu-selection-area">
          <div
            v-for="count in blockOptions"
            :key="count"
            class="main-menu-selection main-menu-selection-short"
            :class="{ 'main-menu-selected': blocksCount === count }"
            @click="setBlocksCountValue(count)"
          >
            {{ count }}
          </div>
        </div>
      </template>

      <template v-else-if="mode === 'tour'">
        <div class="main-menu-section-title">Difficulty</div>
        <div class="main-menu-selection-area">
          <div
            v-for="d in difficulties"
            :key="d.value"
            class="main-menu-selection"
            :class="{ 'main-menu-selected': parseInt(difficulty) === d.value }"
            @click="setDifficultyValue(d.value)"
          >
            {{ d.label }}
          </div>
        </div>

        <div class="main-menu-section-title">Beach</div>
        <div class="main-menu-selection-area">
          <div
            v-for="l in beaches"
            :key="l"
            class="main-menu-selection"
            :class="{ 'main-menu-selected': level === l }"
            @click="setLevelValue(l)"
          >
            {{ capitalize(l) }}
          </div>
        </div>

        <div class="coming-soon">More beaches coming soon!</div>
      </template>

      <template v-else-if="mode === 'adventure'">
        <div class="coming-soon">Coming soon!</div>
      </template>
    </template>
  </div>
</template>

<style scoped>
/* CSS  */
</style>
