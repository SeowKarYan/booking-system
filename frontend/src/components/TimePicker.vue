<script setup lang="ts">
import { ref } from 'vue';
const time = defineModel<string>('time')
defineProps<{
    label: string;
    rules?: ((value: string) => true | string)[]
}>();
const showMenu = ref()
</script>

<template>
    <v-text-field :model-value="time" :label="label" prepend-icon="mdi-clock-time-four-outline" readonly :rules="rules">
        <v-menu v-model="showMenu" :close-on-content-click="false" activator="parent" min-width="0">
            <v-time-picker v-model="time" format="24hr"></v-time-picker>
        </v-menu>
    </v-text-field>
</template>
