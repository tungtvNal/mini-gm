import { ref, computed } from "vue";

const WIDTH = 12;
const HEIGHT = 13;
const COLORS = ["#f87171", "#60a5fa", "#34d399", "#facc15", "#a78bfa"];
const MAX_MOVES = 22;

const GRID_SIZE = { width: 12, height: 13 };

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
  const winningStreak = ref(0);
  const isWin = ref(false);
  const showHelp = ref(false);

  const texts = {
    NEW_BUTTON: "Chơi mới",
    HELP_TITLE: "Trợ giúp",
    HELP_DESCRIPTION: "Lấp đầy bảng bằng một màu duy nhất.",
    HELP_OBJECTIVE: "Khớp tất cả khối cùng màu trong số lượt giới hạn.",
    HELP_INSTRUCTIONS:
      "Nhấp vào nút màu (🟥 🟦 🟩 🟨 🟪) ở trên để lan tỏa từ góc trên bên trái.",
    // HELP_CONTROLS: "Bấm nút chơi mới hoặc nhấn N để chơi mới.",
    BACK_BUTTON: "Quay lại",
    MOVES_LEFT: (moves: number) => `Số lượt còn lại: ${moves}`,
    WIN_MESSAGE: (moves: number) => `Chiến thắng! Số lượt còn lại: ${moves}`,
    LOSS_MESSAGE: "Thua rồi! Thử lại nhé.",
    WINNING_STREAK: "Chuỗi chiến thắng 🎉:",
  };

  const winningStreakText = texts.WINNING_STREAK;

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

  const gridStyle = computed(() => ({
    gridTemplateColumns: `repeat(${GRID_SIZE.width}, 1fr)`,
  }));

  const initGame = () => {
    grid.value = generateGrid();
    movesLeft.value = MAX_MOVES;
    isWin.value = false;
    gridHistory.value = [];
  };

  const saveHistory = () => {
    // Save the current grid state to history
    const snapshot = grid.value.map((row) => row.map((cell) => ({ ...cell })));
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

    const rows = HEIGHT;
    const cols = WIDTH;
    const gridData = grid.value;

    // Create a boolean array that keeps track of visited cells
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

    // Queue for BFS
    const queue: { x: number; y: number }[] = [];
    queue.push({ x: 0, y: 0 });

    // Define the directions of movement
    const directions = [
      { dx: 1, dy: 0 }, // right
      { dx: -1, dy: 0 }, // left
      { dx: 0, dy: 1 }, // below
      { dx: 0, dy: -1 }, // above
    ];

    while (queue.length > 0) {
      const { x, y } = queue.shift()!;

      // check stop condition
      if (
        x < 0 ||
        y < 0 ||
        x >= cols ||
        y >= rows ||
        gridData[y][x].color !== oldColor ||
        visited[y][x]
      )
        continue;

      // Mark visited cell and change color
      visited[y][x] = true;
      gridData[y][x].color = newColor;
      gridData[y][x].height = 1.2 + Math.random() * 0.5;

      // Add neighboring cells to the queue
      for (const { dx, dy } of directions) {
        const newX = x + dx;
        const newY = y + dy;
        queue.push({ x: newX, y: newY });
      }
    }

    movesLeft.value--;

    // Check win
    const allFilled = gridData.every((row) =>
      row.every((cell) => cell.color === newColor)
    );
    if (allFilled) {
      isWin.value = true;
      winningStreak.value++;
    } else if (movesLeft.value === 0) {
      winningStreak.value = 0;
    }
  };

  return {
    flatGrid,
    gridHistory,
    colors: COLORS,
    movesLeft,
    winningStreak,
    winningStreakText,
    isWin,
    showHelp,
    texts,
    WIDTH,
    HEIGHT,
    gridStyle,
    floodFill,
    initGame,
    undo,
  };
};
