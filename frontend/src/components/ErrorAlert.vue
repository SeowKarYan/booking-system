<script setup lang="ts">
defineProps<{
  text: string;
}>();
</script>

<template>
     <v-alert
        title="Error"
        :text="text"
        type="error"
        color="red-darken-1"
        closable
        density="compact"
      ></v-alert>
</template>