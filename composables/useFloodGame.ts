import { ref, computed } from "vue";

const WIDTH = 12;
const HEIGHT = 12;
const COLORS = ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"];
const MAX_MOVES = 22;

type Cell = {
  x: number;
  y: number;
  color: string;
  height: number;
};

export const useFloodGame = () => {
  const gridHistory = ref<Cell[][][]>([]);
  const grid = ref<Cell[][]>([]);
  const movesLeft = ref(MAX_MOVES);
  const isWin = ref(false);
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
    MOVES_LEFT: (moves: number) => `Moves left: ${moves}`,
    WIN_MESSAGE: (moves: number) => `You win! Moves left: ${moves}`,
    LOSS_MESSAGE: "You lose! Try again.",
    WINNING_STREAK: "Winning streak:",
  };

  const generateGrid = (): Cell[][] => {
    return Array.from({ length: HEIGHT }, (_, y) =>
      Array.from({ length: WIDTH }, (_, x) => ({
        x,
        y,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        height: 1,
      }))
    );
  };

  const flatGrid = computed(() => grid.value.flat());

  const initGame = () => {
    grid.value = generateGrid();
    movesLeft.value = MAX_MOVES;
    isWin.value = false;
  };

  const saveHistory = () => {
    // Save the current grid state to history
    const snapshot = grid.value.map(row => row.map(cell => ({ ...cell })))
    gridHistory.value.push(snapshot);
  };

  const undo = () => {
    // Undo the last move
    if (gridHistory.value.length === 0) return;
    const previous = gridHistory.value.pop();
    grid.value = previous?.map((row) => [...row]) || grid.value;
    movesLeft.value++;
    isWin.value = false;
  };

  const floodFill = (newColor: string) => {
    const oldColor = grid.value[0][0].color;
    if (newColor === oldColor || movesLeft.value <= 0) return;

    // Save the current grid state before changing it
    saveHistory();

    const visited = new Set<string>();

    const fill = (x: number, y: number) => {
      if (
        x < 0 ||
        y < 0 ||
        x >= WIDTH ||
        y >= HEIGHT ||
        grid.value[y][x].color !== oldColor ||
        visited.has(`${x},${y}`)
      )
        return;

      visited.add(`${x},${y}`);
      grid.value[y][x].color = newColor;
      grid.value[y][x].height = 1.2 + Math.random() * 0.5;

      fill(x + 1, y);
      fill(x - 1, y);
      fill(x, y + 1);
      fill(x, y - 1);
    };

    fill(0, 0);
    movesLeft.value--;

    if (grid.value.flat().every((c) => c.color === newColor)) {
      isWin.value = true;
    }
  };

  return {
    flatGrid,
    gridHistory,
    colors: COLORS,
    movesLeft,
    isWin,
    showHelp,
    texts,
    WIDTH,
    HEIGHT,
    floodFill,
    initGame,
    undo,
  };
};
