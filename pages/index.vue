<template>
  <div class="flex flex-col items-center gap-4">
    <!-- Board -->
    <div id="board" class="grid border border-gray-300" :style="gridStyle">
      <div
        v-for="(cell, index) in flatGrid"
        :key="index"
        class="w-full h-full"
        :style="{ backgroundColor: cell }"
      />
    </div>

    <!-- Color Controls -->
    <div id="controls" class="flex gap-2">
      <UButton
        v-for="color in colors"
        :key="color"
        :ui="{ rounded: 'full', padding: 'none', size: 'md' }"
        class="w-8 h-8"
        :style="{ backgroundColor: color }"
        :disabled="movesLeft === 0"
        @click="floodFill(color)"
      />
    </div>

    <!-- Moves Left -->
    <UBadge color="blue" variant="solid" size="lg">
      {{ movesLeftText }}
    </UBadge>

    <!-- Winning Streak -->
    <UBadge v-if="winningStreak > 0" color="green" variant="soft" size="lg">
      {{ winningStreakText }} {{ winningStreak }}
    </UBadge>

    <!-- Action Buttons -->
    <div class="flex gap-2">
      <UButton color="primary" @click="initGame">
        {{ texts.NEW_BUTTON }}
      </UButton>
      <UButton color="gray" @click="showHelp = true">Help</UButton>
    </div>

    <!-- Help Modal -->
    <HelpModal v-model:open-model="showHelp" :texts="texts" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const GRID_SIZE = { width: 12, height: 13 };
const COLORS = [
  "#0000ff",
  "#ff0000",
  "#008000",
  "#ffff00",
  "#ffa500",
  "#800080",
];
const MAX_MOVES = 22;

const grid = ref([]);
const movesLeft = ref(MAX_MOVES);
const winningStreak = ref(0);
const showHelp = ref(false);

const texts = {
  NEW_BUTTON: "New Game",
  HELP_TITLE: "Help",
  HELP_DESCRIPTION: "Fill the entire board with a single color.",
  HELP_OBJECTIVE:
    "Match all the blocks with the same color within limited moves.",
  HELP_INSTRUCTIONS: "Click a color to flood from the top-left.",
  HELP_CONTROLS: "Use the buttons or press N for a new game.",
  BACK_BUTTON: "Back",
  MOVES_LEFT: (moves) => `Moves left: ${moves}`,
  WIN_MESSAGE: (moves) => `You win! Moves left: ${moves}`,
  LOSS_MESSAGE: "You lose! Try again.",
  WINNING_STREAK: "Winning streak:",
};

const flatGrid = computed(() => grid.value.flat());
const colors = COLORS;
const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(${GRID_SIZE.width}, 1fr)`,
}));
const movesLeftText = computed(() => texts.MOVES_LEFT(movesLeft.value));
const winningStreakText = texts.WINNING_STREAK;

const generateGrid = () => {
  return Array.from({ length: GRID_SIZE.height }, () =>
    Array.from(
      { length: GRID_SIZE.width },
      () => COLORS[Math.floor(Math.random() * COLORS.length)]
    )
  );
};

const initGame = () => {
  grid.value = generateGrid();
  movesLeft.value = MAX_MOVES;
};

const floodFill = (newColor) => {
  const oldColor = grid.value[0][0];
  if (newColor === oldColor || movesLeft.value <= 0) return;

  const fill = (x, y) => {
    if (
      x < 0 ||
      y < 0 ||
      x >= GRID_SIZE.width ||
      y >= GRID_SIZE.height ||
      grid.value[y][x] !== oldColor
    )
      return;
    grid.value[y][x] = newColor;
    fill(x + 1, y);
    fill(x - 1, y);
    fill(x, y + 1);
    fill(x, y - 1);
  };

  fill(0, 0);
  movesLeft.value--;

  if (checkWin()) {
    winningStreak.value++;
  } else if (movesLeft.value === 0) {
    winningStreak.value = 0;
  }
};

const checkWin = () => {
  return grid.value.every((row) =>
    row.every((cell) => cell === grid.value[0][0])
  );
};

onMounted(() => {
  initGame();
  window.addEventListener("keydown", (e) => {
    if (e.code === "KeyN") initGame();
  });
});
</script>

<style scoped>
#board {
  min-width: 400px;
  width: 20vw;
  aspect-ratio: 12 / 16;
  gap: 1px;
}
</style>
