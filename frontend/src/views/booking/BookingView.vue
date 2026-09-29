<script setup lang="ts">
import { getDoctorList, getDoctorSlot } from '@/api/doctor';
import Toolbar from '@/components/Toolbar.vue';
import type { Doctor, getDoctorListResponse, getDoctorSlotResponse } from '@/types/doctors';
import { useQuery, useMutation } from "@tanstack/vue-query";
import type { AxiosError } from 'axios';
import { computed, ref } from 'vue';
import { startOfDay, endOfDay, format } from "date-fns"
import Calendar from '@/components/Calendar.vue';
import type { CalendarEvent } from 'vuetify/lib/components/VCalendar/types.mjs';
import type { createBookingRequest, createBookingResponse } from '@/types/bookings';
import { createBooking } from '@/api/bookings';
import { useRouter } from 'vue-router';
import ErrorAlert from '@/components/ErrorAlert.vue';

const router = useRouter();

const selectedDoctor = ref<Doctor | null>(null)
const date = ref(new Date())
const selectedEvent = ref<CalendarEvent | null>(null)
const selectedElement = ref<HTMLElement | null>(null)
const selectedOpen = ref(false)

const focus = computed(() => (
    format(date.value, 'yyyy-MM-dd')
))

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

const mutation = useMutation<
    createBookingResponse,
    AxiosError<{ message: string }>,
    createBookingRequest
>({
    mutationFn: createBooking,
    onSuccess: () => {
        router.push("/schedule");
    },
});

const confirmBooking = async () => {
    if (selectedDoctor.value?.id && selectedEvent) {
        let body = {
            doctorId: selectedDoctor.value?.id,
            start_time: selectedEvent.value?.start
        }
        mutation.mutate(body);
    }
}
</script>

<template>
    <div>
        <Toolbar title="Make Appointment" />

        <v-container>
            <ErrorAlert class="my-3" v-if="isError || isSlotError"
                :text="error?.response?.data?.message || error?.message || slotError?.response?.data?.message || slotError?.message || ''" />

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
                <Calendar v-model:focus="focus" :events="events" :categories="categories" :show-event="showEvent" />
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
                <v-container v-if="mutation.isError.value">
                    <ErrorAlert
                        :text="mutation.error?.value?.response?.data?.message || mutation.error?.value?.message || ''" />
                </v-container>
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
                    <v-btn color="primary" @click="confirmBooking" :loading="mutation.isPending.value">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-menu>
    </div>
</template>
