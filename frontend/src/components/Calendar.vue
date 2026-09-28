<script setup lang="ts">
import type { CalendarEvent } from 'vuetify/lib/components/VCalendar/types.mjs';

const props = defineProps<{
    date: string;
    events: CalendarEvent[];
    categories: string[];
}>();
import { ref, watch } from 'vue'

const focus = ref(props.date)

watch(
  () => props.date,
  (newDate) => {
    focus.value = newDate
  }
)

function getEventColor(event: CalendarEvent): string {
    return event.color
}
</script>

<template>
    <v-sheet>
        <v-calendar class="overflow-x-auto" v-model="focus" :categories="categories" :event-color="getEventColor"
            :events="events" color="primary" type="category" category-show-all></v-calendar>
    </v-sheet>
</template>