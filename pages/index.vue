<template>
  <UContainer class="py-10">
    <UCard class="max-w-xl mx-auto text-center">
      <template #header>
        <h1 class="text-3xl font-bold text-primary">
          🪨 ✂️ 📄 Rock Paper Scissors
        </h1>
      </template>

      <div class="mb-4 space-y-2">
        <div>
          <UBadge color="primary" variant="subtle"
            >You: {{ game.playerScore }}</UBadge
          >
          <UBadge color="error" variant="subtle" class="ml-2"
            >Computer: {{ game.computerScore }}</UBadge
          >
          <UBadge color="neutral" variant="subtle" class="ml-2"
            >Draws: {{ game.draw }}</UBadge
          >
        </div>

        <div class="flex justify-center gap-4 mt-4">
          <UButton
            v-for="option in options"
            :key="option"
            color="primary"
            variant="solid"
            size="lg"
            @click="play(option)"
          >
            {{ option }}
          </UButton>
        </div>
      </div>

      <div class="mt-6 space-y-1 text-md text-gray-600">
        <p v-if="userChoice">
          🧑 You chose: <strong>{{ userChoice }}</strong>
        </p>
        <p v-if="computerChoice">
          🤖 Computer chose: <strong>{{ computerChoice }}</strong>
        </p>
      </div>

      <div
        v-if="resultText"
        class="mt-4 text-2xl font-bold text-secondary animate-bounce"
      >
        {{ resultText }}
      </div>

      <template #footer>
        <UButton color="red" variant="outline" @click="resetGame"
          >Reset Game</UButton
        >
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useGameStore } from "~/stores/game";

const options = ["Rock", "Paper", "Scissors"];
const userChoice = ref("");
const computerChoice = ref("");
const resultText = ref("");

const game = useGameStore();

const playSound = (name: string) => {
  const audio = new Audio(`/sounds/${name}.mp3`);
  audio.play();
};

function play(choice: string) {
  playSound("click");
  userChoice.value = choice;
  computerChoice.value = options[Math.floor(Math.random() * 3)];

  const uc = userChoice.value;
  const cc = computerChoice.value;

  if (uc === cc) {
    resultText.value = "It's a draw!";
    game.updateResult("draw");
    playSound("draw");
  } else if (
    (uc === "Rock" && cc === "Scissors") ||
    (uc === "Paper" && cc === "Rock") ||
    (uc === "Scissors" && cc === "Paper")
  ) {
    resultText.value = "You win!";
    game.updateResult("win");
    playSound("win");
  } else {
    resultText.value = "You lose!";
    game.updateResult("lose");
    playSound("lose");
  }
}

function resetGame() {
  game.reset();
  userChoice.value = "";
  computerChoice.value = "";
  resultText.value = "";
}
</script>
