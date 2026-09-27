<script setup lang="ts">
import { ref } from "vue";
import { startOfDay, endOfDay } from "date-fns"
import Toolbar from "../../components/Toolbar.vue";
import { useAuthStore } from "../../stores/auth";
import { useQueryClient, useQuery, useMutation } from "@tanstack/vue-query";
import { getBooking } from "../../api/bookings";

const authStore = useAuthStore();

const start_time = ref(startOfDay(new Date()).toISOString());
const end_time = ref(endOfDay(new Date()).toISOString());

const { isPending, isError, data, error } = useQuery({
  queryKey: ["booking", authStore.id],
  queryFn: getBooking({
    start_time: start_time.value,
    end_time: end_time.value,
    status: "Booked",
  }),
});
</script>

<template>
  <div>
    <Toolbar title="My Bookings" />
  </div>
</template>
