<template>
  <div class="container">
    <div id="board" class="grid" :style="gridStyle">
      <div
        v-for="(cell, index) in flatGrid"
        :key="index"
        class="cell"
        :style="{ backgroundColor: cell }"
      />
    </div>

    <div id="controls" class="controls">
      <button
        v-for="color in colors"
        :key="color"
        class="color-button"
        :style="{ backgroundColor: color }"
        :data-color="color"
        :disabled="movesLeft === 0"
        @click="floodFill(color)"
      />
    </div>

    <div id="status">{{ movesLeftText }}</div>
    <div v-if="winningStreak > 0" id="winning-streak">
      {{ winningStreakText }} {{ winningStreak }}
    </div>

    <button id="new-button" @click="initGame">New Game</button>
    <button id="help-button" @click="showHelp = true">Help</button>

    <div v-if="showHelp" id="help-container" class="modal">
      <h2>{{ texts.HELP_TITLE }}</h2>
      <p>{{ texts.HELP_DESCRIPTION }}</p>
      <p>{{ texts.HELP_OBJECTIVE }}</p>
      <p>{{ texts.HELP_INSTRUCTIONS }}</p>
      <p>{{ texts.HELP_CONTROLS }}</p>
      <button id="back-button" @click="showHelp = false">
        {{ texts.BACK_BUTTON }}
      </button>
    </div>
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
    // statusText.value = texts.WIN_MESSAGE(movesLeft.value);
    winningStreak.value++;
  } else if (movesLeft.value === 0) {
    // statusText.value = texts.LOSS_MESSAGE;
    winningStreak.value = 0;
  }
};

const checkWin = () => {
  // console.log(
  //   grid.value.every((row) => row.every((cell) => cell === grid.value[0][0]))
  // );
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
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
#board {
  min-width: 400px;
  width: 20vw;
  aspect-ratio: 12 / 16;
}
.grid {
  display: grid;
  gap: 1px;
  border: 1px solid #ccc;
}
.cell {
  width: 100%;
  height: 100%;
}
.controls {
  display: flex;
  gap: 0.5rem;
}
.color-button {
  width: 30px;
  height: 30px;
  border: none;
  cursor: pointer;
}
.modal {
  border: 1px solid #ccc;
  padding: 1rem;
  background: white;
  position: fixed;
  top: 10%;
  max-width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}
</style>
