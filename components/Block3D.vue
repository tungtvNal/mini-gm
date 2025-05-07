<template>
  <TresMesh ref="meshRef" :position="[x - widthOffset, 0, y - heightOffset]">
    <TresBoxGeometry :args="[1, 1, 1]" />
    <TresMeshStandardMaterial :color="color" />
  </TresMesh>
</template>

<script setup lang="ts">
import { gsap } from "gsap";
import { Color } from "three";

const props = defineProps({
  x: { type: Number, default: 0 },
  y: { type: Number, default: 0 },
  height: { type: Number, default: 1 },
  color: { type: String, default: "#ffffff" },
  widthOffset: { type: Number, default: 0 },
  heightOffset: { type: Number, default: 0 },
});

const meshRef = ref();

// Watch for changes to the color prop
watch(
  () => props.color,
  (newColor) => {
    if (meshRef.value?.material) {
      const material = meshRef.value.material;
      const startColor = material.color.clone();
      const endColor = new Color(newColor);

      gsap.to(startColor, {
        r: endColor.r,
        g: endColor.g,
        b: endColor.b,
        duration: 0.5,
        onUpdate: () => {
          material.color.setRGB(startColor.r, startColor.g, startColor.b);
        },
      });
    }
  },
  { immediate: true }
);
</script>
