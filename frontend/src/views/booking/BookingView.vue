<script setup lang="ts">
import { getDoctorList, getDoctorSlot } from '@/api/doctor';
import Toolbar from '@/components/Toolbar.vue';
import type { Doctor, getDoctorListResponse, getDoctorSlotResponse } from '@/types/doctors';
import { useQuery } from "@tanstack/vue-query";
import type { AxiosError } from 'axios';
import { computed, ref } from 'vue';
import { startOfDay, endOfDay, format } from "date-fns"
import Calendar from '@/components/Calendar.vue';
import type { CalendarEvent } from 'vuetify/lib/components/VCalendar/types.mjs';

const selectedDoctor = ref<Doctor | null>(null)
const date = ref(new Date())
const selectedEvent = ref<CalendarEvent | null>(null)
const selectedElement = ref<HTMLElement | null>(null)
const selectedOpen = ref(false)

const { isFetching, isError, data, error } = useQuery<getDoctorListResponse, AxiosError<{ message: string }>>({
    queryKey: ["doctor"],
    queryFn: () => getDoctorList(),
});

const { isFetching: isFetchingSlot, isError: isSlotError, data: slotData, error: slotError } = useQuery<getDoctorSlotResponse, AxiosError<{ message: string }>>({
    queryKey: ["slot", selectedDoctor, date],
    queryFn: () => getDoctorSlot(Number(selectedDoctor.value?.id), { start_time: startOfDay(date.value).toISOString(), end_time: endOfDay(date.value).toISOString() }),
    enabled: computed(() => !!selectedDoctor.value?.id),
});

const events = computed<CalendarEvent[]>(() => {
    const slots = slotData.value?.data ?? [];

    const slotEvents = slots.map((slot) => ({
        name: "Available Slot",
        start: new Date(slot.start),
        end: new Date(slot.end),
        color: "green",
        timed: true,
        category: selectedDoctor.value?.name,
        details: {
            doctor_email: selectedDoctor.value?.email,
            consultation_period: selectedDoctor.value?.consultation_period
        }
    }));

    return slotEvents;
});

const categories = computed<string[]>(() => {
    return selectedDoctor.value?.name
        ? [selectedDoctor.value.name]
        : [];
});

const showEvent = (nativeEvent: Event, { event }: { event: CalendarEvent }) => {
    const open = () => {
        selectedEvent.value = event
        if (nativeEvent.target instanceof HTMLElement) {
            selectedElement.value = nativeEvent.target
        }
        requestAnimationFrame(() => requestAnimationFrame(() => selectedOpen.value = true))
    }
    if (selectedOpen.value) {
        selectedOpen.value = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
    } else {
        open()
    }
    nativeEvent.stopPropagation()
}
</script>

<template>
    <div>
        <Toolbar title="Make Appointment" />

        <v-container>
            <v-alert v-if="isError || isSlotError" class="my-3" title="Error"
                :text="error?.response?.data?.message || error?.message || slotError?.response?.data?.message || slotError?.message"
                type="error" color="red-darken-1" closable density="compact">
            </v-alert>

            <v-autocomplete v-model="selectedDoctor" :items="data?.data" item-title="name" item-value="id" return-object
                label="Doctor" :loading="isFetching">
            </v-autocomplete>

            <v-date-input label="Select Date" v-model="date"></v-date-input>
        </v-container>

        <div v-if="selectedDoctor && date">
            <div class="text-center" v-if="isFetchingSlot">
                <v-progress-circular color="primary" indeterminate></v-progress-circular>
            </div>

            <div v-else>
                <Calendar :events="events" :date="format(date, 'yyyy-MM-dd')" :categories="categories"
                    :show-event="showEvent" />
            </div>
        </div>

        <v-menu v-if="selectedElement && selectedEvent" v-model="selectedOpen" :activator="selectedElement"
            :close-on-content-click="false" location="end">
            <v-card color="grey-lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                    <v-toolbar-title text="Make Appointment"></v-toolbar-title>
                    <v-btn icon @click="selectedOpen = false">
                        <v-icon>mdi-close</v-icon>
                    </v-btn>
                </v-toolbar>
                <v-card-title>Confirmation</v-card-title>
                <v-card-subtitle>Are you sure you want to make appointment with following details?</v-card-subtitle>
                <v-card-text>
                    <p>Doctor: <b>{{ selectedEvent.category }}</b></p>
                    <p>Doctor Email: <b>{{ selectedEvent.details.doctor_email }}</b></p>
                    <p>Consultation Period: <b>{{ selectedEvent.details.consultation_period }} minutes</b></p>
                    <p>Start Time: <b>{{ format(selectedEvent.start, "dd MMM yyyy h:mm a") }}</b></p>
                    <p>End Time: <b>{{ format(selectedEvent.end, "dd MMM yyyy h:mm a") }}</b></p>
                    <p></p>
                </v-card-text>
                <v-card-actions>
                    <v-btn color="primary">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
