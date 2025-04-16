<script setup>
import { onMounted, onUnmounted, provide, reactive } from "vue";

const controls = reactive({
  forward: false,
  backward: false,
  left: false,
  right: false,
  jump: false,
});

const keyMap = {
  ArrowUp: "forward",
  KeyW: "forward",
  ArrowDown: "backward",
  KeyS: "backward",
  ArrowLeft: "left",
  KeyA: "left",
  ArrowRight: "right",
  KeyD: "right",
  Space: "jump",
};

const onKeyDown = (e) => {
  alert('Key pressed: ' + e.code);
  const action = keyMap[e.code];
  if (action) controls[action] = true;
};

const onKeyUp = (e) => {
  const action = keyMap[e.code];
  if (action) controls[action] = false;
};

onMounted(() => {
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
});

onUnmounted(() => {
  window.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("keyup", onKeyUp);
});

// Provide the controls to the rest of the app
// This allows other components to access the controls state
provide("keyboardControls", controls);
</script>

<template>
  <slot />
</template>
