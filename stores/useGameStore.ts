import { defineStore } from "pinia";
import { ref } from "vue";

export const useGameStore = defineStore("beachy", () => {
  // In-game state
  const isInGame = ref(false);
  const setIsInGame = (value: boolean) => {
    isInGame.value = value;
  };

  // Performance UI
  const performance = ref(false);
  const showPerformance = () => {
    performance.value = true;
  };

  // Game mode
  const mode = ref(localStorage.getItem("mode") || "random");
  const setMode = (newMode: string) => {
    mode.value = newMode;
    localStorage.setItem("mode", newMode);
  };

  // Difficulty
  const difficulty = ref(parseInt(localStorage.getItem("difficulty") || "1"));
  const setDifficulty = (dif: number) => {
    difficulty.value = dif;
    localStorage.setItem("difficulty", dif.toString());
  };

  // Blocks
  const blocksCount = ref(
    parseInt(localStorage.getItem("blocksCount") || "10")
  );
  const setBlocksCount = (count: number) => {
    blocksCount.value = count;
    localStorage.setItem("blocksCount", count.toString());
  };

  const blocksSeed = ref(0);

  // Level
  const level = ref(localStorage.getItem("level") || "copacabana");
  const setLevel = (newLevel: string) => {
    level.value = newLevel;
    localStorage.setItem("level", newLevel);
  };

  // High Scores
  const highScoreRandom = ref(
    parseInt(localStorage.getItem("highScoreRandom") || "0")
  );
  const highScoreCopacabana = ref(
    parseInt(localStorage.getItem("highScoreCopacabana") || "0")
  );
  const highScoreSantaMonica = ref(
    parseInt(localStorage.getItem("highScoreSantaMonica") || "0")
  );

  // Game state
  const startTime = ref(0);
  const endTime = ref(0);
  const phase = ref<"ready" | "playing" | "ended">("ready");

  const start = () => {
    if (phase.value === "ready") {
      phase.value = "playing";
      startTime.value = Date.now();
    }
  };

  const restart = () => {
    if (["playing", "ended"].includes(phase.value)) {
      phase.value = "ready";
      blocksSeed.value = Math.random();
    }
  };

  const end = () => {
    if (phase.value === "playing") {
      endTime.value = Date.now();
      const score = endTime.value - startTime.value;

      if (mode.value === "random") {
        if (highScoreRandom.value === 0 || score < highScoreRandom.value) {
          highScoreRandom.value = score;
          localStorage.setItem("highScoreRandom", score.toString());
        }
      } else if (mode.value === "tour") {
        if (level.value === "copacabana") {
          if (
            highScoreCopacabana.value === 0 ||
            score < highScoreCopacabana.value
          ) {
            highScoreCopacabana.value = score;
            localStorage.setItem("highScoreCopacabana", score.toString());
          }
        } else if (level.value === "santamonica") {
          if (
            highScoreSantaMonica.value === 0 ||
            score < highScoreSantaMonica.value
          ) {
            highScoreSantaMonica.value = score;
            localStorage.setItem("highScoreSantaMonica", score.toString());
          }
        }
      }

      phase.value = "ended";
    }
  };

  return {
    // State
    isInGame,
    performance,
    mode,
    difficulty,
    blocksCount,
    blocksSeed,
    level,
    highScoreRandom,
    highScoreCopacabana,
    highScoreSantaMonica,
    startTime,
    endTime,
    phase,

    // Actions
    setIsInGame,
    showPerformance,
    setMode,
    setDifficulty,
    setBlocksCount,
    setLevel,
    start,
    restart,
    end,
  };
});
