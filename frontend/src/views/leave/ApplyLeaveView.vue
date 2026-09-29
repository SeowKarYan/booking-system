<script setup lang="ts">
import { ref } from 'vue';
import Toolbar from '@/components/Toolbar.vue';
import { useRouter } from 'vue-router';
import ErrorAlert from '@/components/ErrorAlert.vue';
import type { AxiosError } from 'axios';
import { useQuery, useMutation } from "@tanstack/vue-query";
import type { Doctor, getDoctorListResponse } from '@/types/doctors';
import { getDoctorList } from '@/api/doctor';
import TimePicker from '@/components/TimePicker.vue';

const router = useRouter();

const selectedDoctor = ref<Doctor | null>(null)
const startDate = ref()
const endDate = ref()
const startTime = ref()
const endTime = ref()

const { isFetching, isError, data, error } = useQuery<getDoctorListResponse, AxiosError<{ message: string }>>({
    queryKey: ["doctor"],
    queryFn: () => getDoctorList(),
});

</script>

<template>
    <div>
        <Toolbar title="Apply Leave" />

        <v-container>
            <ErrorAlert class="my-3" v-if="isError" :text="error?.response?.data?.message || error?.message || ''" />

            <v-autocomplete v-model="selectedDoctor" :items="data?.data" item-title="name" item-value="id" return-object
                label="Doctor" :loading="isFetching">
            </v-autocomplete>

            <v-row class="justify-space-around">
                <v-col>
                    <v-date-input label="Start Date" v-model="startDate"></v-date-input>
                </v-col>

                <v-col>
                    <TimePicker v-model:time="startTime" label="Start Time" />
                </v-col>
            </v-row>

            <v-row class="justify-space-around">
                <v-col>
                    <v-date-input label="End Date" v-model="endDate"></v-date-input>
                </v-col>

                <v-col>
                    <TimePicker v-model:time="endTime" label="End Time" />
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>
