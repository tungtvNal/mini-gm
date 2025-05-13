<template>
  <UModal v-model:open="computedOpenModel" :title="texts.HELP_TITLE">
    <template #body >
      <p>{{ texts.HELP_DESCRIPTION }}</p>
      <p>{{ texts.HELP_OBJECTIVE }}</p>
      <p>{{ texts.HELP_INSTRUCTIONS }}</p>
      <!-- <p>{{ texts.HELP_CONTROLS }}</p> -->
    </template>
  </UModal>
</template>

<script setup>
const props = defineProps({
  openModel: {
    type: Boolean,
    required: true,
  },
  texts: {
    type: Object,
    required: true,
  },
});

const computedOpenModel = computed({
  get: () => props.openModel,
  set: (value) => emit("update:openModel", value),
});

const emit = defineEmits(["update:modelValue", "update:openModel"]);

const closeModal = () => {
  emit("update:openModel", false);
};
</script>
