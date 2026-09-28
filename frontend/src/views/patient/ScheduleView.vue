<script setup lang="ts">
import { computed, ref } from "vue";
import { startOfDay, endOfDay, format } from "date-fns"
import Toolbar from "../../components/Toolbar.vue";
import Calendar from "../../components/Calendar.vue";
import { useAuthStore } from "../../stores/auth";
import { useQuery } from "@tanstack/vue-query";
import { getBooking } from "../../api/bookings";
import type { getBookingResponse } from "@/types/bookings.ts";
import type { AxiosError } from "axios";
import type { CalendarEvent } from "vuetify/lib/components/VCalendar/types.mjs";

const authStore = useAuthStore();

const date = ref(new Date())

const { isPending, isError, data, error } = useQuery<getBookingResponse, AxiosError<{ message: string }>>({
  queryKey: ["booking", authStore.id, date],
  queryFn: () => getBooking({
    start_time: startOfDay(date.value).toISOString(),
    end_time: endOfDay(date.value).toISOString(),
    status: "Booked",
  }),
});

const events = computed<CalendarEvent[]>(() => {
  if (!data.value?.data) return [];

  return data.value.data.map((booking) => ({
    name: booking.patient.name,
    start: new Date(booking.start_time),
    end: new Date(booking.end_time),
    color: "blue",
    timed: true,
    category: booking.doctor.name
  }));
});

const categories = computed<string[]>(() => {
  if (!data.value?.data) return [];

  return [...new Set(
    data.value.data.map((booking) => booking.doctor.name)
  )];
});

</script>

<template>
  <div>
    <Toolbar title="My Bookings" />

    <v-alert v-if="isError" title="Error" :text="error?.response?.data?.message || error?.message" type="error"
      color="red-darken-1" closable density="compact">
    </v-alert>

    <v-sheet tile>
      <v-date-input label="Select Date" v-model="date"></v-date-input>
    </v-sheet>

    <div class="text-center" v-if="isPending">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>

    <div v-else>
      <Calendar :events="events" :date="format(date, 'yyyy-MM-dd')" :categories="categories" />
    </div>
  </div>
</template>
