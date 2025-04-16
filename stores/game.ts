import { defineStore } from "pinia";

export const useGameStore = defineStore("game", {
  state: () => ({
    playerScore: 0,
    computerScore: 0,
    draw: 0,
  }),
  actions: {
    reset() {
      this.playerScore = 0;
      this.computerScore = 0;
      this.draw = 0;
    },
    updateResult(result: string) {
      if (result === "win") this.playerScore++;
      else if (result === "lose") this.computerScore++;
      else if (result === "draw") this.draw++;
    },
  },
});
