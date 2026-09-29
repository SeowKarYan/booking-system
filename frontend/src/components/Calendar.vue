<script setup lang="ts">
import type { CalendarEvent } from 'vuetify/lib/components/VCalendar/types.mjs';
const focus = defineModel<string>('focus')
const props = defineProps<{
    events: CalendarEvent[];
    categories: string[];
    showEvent: (
        nativeEvent: Event,
        data: { event: CalendarEvent }
    ) => void
}>();

const getEventColor = (event: CalendarEvent): string => {
    return event.color
}
</script>

<template>
    <v-sheet>
        <v-calendar class="overflow-x-auto" v-model="focus" :categories="categories" :event-color="getEventColor"
            :events="events" color="primary" type="category" category-show-all @click:event="showEvent">
        </v-calendar>
    </v-sheet>
</template>