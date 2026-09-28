<script setup lang="ts">
import { computed, ref } from "vue";
import { startOfDay, endOfDay, format } from "date-fns"
import Toolbar from "../../components/Toolbar.vue";
import Calendar from "../../components/Calendar.vue";
import { useAuthStore } from "../../stores/auth.ts";
import { useQuery } from "@tanstack/vue-query";
import { getBooking } from "../../api/bookings.ts";
import type { getBookingResponse } from "@/types/bookings.ts";
import type { AxiosError } from "axios";
import type { CalendarEvent } from "vuetify/lib/components/VCalendar/types.mjs";
import type { getLeaveResponse } from "@/types/leaves.ts";
import { getLeave } from "@/api/leaves.ts";

const authStore = useAuthStore();

const date = ref(new Date())

const { isFetching, isError, data, error } = useQuery<getBookingResponse, AxiosError<{ message: string }>>({
  queryKey: ["booking", authStore.id, date],
  queryFn: () => getBooking({
    start_time: startOfDay(date.value).toISOString(),
    end_time: endOfDay(date.value).toISOString(),
    status: "Booked",
  }),
});

const { isFetching: isLeaveFetching, isError: isLeaveError, data: leaveData, error: leaveError } = useQuery<getLeaveResponse, AxiosError<{ message: string }>>({
  queryKey: ["leave", authStore.id, date],
  queryFn: () => getLeave({
    start_time: startOfDay(date.value).toISOString(),
    end_time: endOfDay(date.value).toISOString(),
  }),
  enabled: computed(() => authStore.role === "Receptionist")
});

const events = computed<CalendarEvent[]>(() => {
  const bookings = data.value?.data ?? [];
  const leaves = leaveData.value?.data ?? [];

  const bookingEvents = bookings.map((booking) => ({
    name: booking.patient.name,
    start: new Date(booking.start_time),
    end: new Date(booking.end_time),
    color: "blue",
    timed: true,
    category: booking.doctor.name
  }));

  const leaveEvents = leaves.map((leave) => ({
    name: leave.type,
    start: new Date(leave.start_time),
    end: new Date(leave.end_time),
    color: "red",
    timed: true,
    category: leave.doctor.name
  }));

  return [...bookingEvents, ...leaveEvents];
});

const categories = computed<string[]>(() => {
  return [...new Set(events.value.map((event) => event.category))];
});
</script>

<template>
  <div>
    <Toolbar :title="authStore.role === 'Patient' ? 'My Bookings' : 'Doctor Schedule'" />

    <v-alert v-if="isError || isLeaveError" class="mb-3" title="Error"
      :text="error?.response?.data?.message || error?.message || leaveError?.response?.data?.message || leaveError?.message"
      type="error" color="red-darken-1" closable density="compact">
    </v-alert>

    <v-sheet tile>
      <v-date-input label="Select Date" v-model="date"></v-date-input>
    </v-sheet>

    <div class="text-center" v-if="isFetching || isLeaveFetching">
      <v-progress-circular color="primary" indeterminate></v-progress-circular>
    </div>

    <div v-else>
      <Calendar :events="events" :date="format(date, 'yyyy-MM-dd')" :categories="categories" />
    </div>
  </div>
</template>
