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
import { setHours, setMinutes } from 'date-fns';
import type { createLeaveRequest, createLeaveResponse } from '@/types/leaves';
import { createLeave } from '@/api/leaves';

const router = useRouter();

const selectedDoctor = ref<Doctor | null>(null)
const startDate = ref()
const endDate = ref()
const startTime = ref()
const endTime = ref()
const type = ref('')
const validationError = ref('')

const { isFetching, isError, data, error } = useQuery<getDoctorListResponse, AxiosError<{ message: string }>>({
    queryKey: ["doctor"],
    queryFn: () => getDoctorList(),
});

const mutation = useMutation<
    createLeaveResponse,
    AxiosError<{ message: string }>,
    createLeaveRequest
>({
    mutationFn: createLeave,
    onSuccess: () => {
        router.push("/schedule");
    },
});

const onSubmit = async () => {
    validationError.value = ''

    let [startHour, startMinute] = startTime.value.split(":")
    let [endHour, endMinute] = endTime.value.split(":")

    let start = setHours(setMinutes(startDate.value, startMinute), startHour)
    let end = setHours(setMinutes(endDate.value, endMinute), endHour)

    if (start >= end) {
        validationError.value = "End date and time should be more than start"
    }
}
</script>

<template>
    <div>
        <Toolbar title="Apply Leave" />

        <v-container>
            <ErrorAlert class="my-3" v-if="validationError || isError"
                :text="validationError || error?.response?.data?.message || error?.message || ''" />

            <v-form @submit.prevent="onSubmit">
                <v-autocomplete v-model="selectedDoctor" :items="data?.data" item-title="name" item-value="id"
                    return-object label="Doctor" :loading="isFetching" :rules="[
                        value => !!value || 'Please select doctor',
                    ]">
                </v-autocomplete>

                <v-row class="justify-space-around">
                    <v-col>
                        <v-date-input label="Start Date" v-model="startDate" :rules="[
                            value => !!value || 'Please select start date',
                        ]"></v-date-input>
                    </v-col>

                    <v-col>
                        <TimePicker v-model:time="startTime" label="Start Time" :rules="[
                            value => !!value || 'Please select start time',
                        ]" />
                    </v-col>
                </v-row>

                <v-row class="justify-space-around">
                    <v-col>
                        <v-date-input label="End Date" v-model="endDate" :rules="[
                            value => !!value || 'Please select start date',
                        ]"></v-date-input>
                    </v-col>

                    <v-col>
                        <TimePicker v-model:time="endTime" label="End Time" :rules="[
                            value => !!value || 'Please select start end',
                        ]" />
                    </v-col>
                </v-row>

                <v-text-field label="Reason" v-model="type" placeholder="Meeting / Annual Leave" :rules="[
                    value => !!value || 'Please fill in reason',
                ]"></v-text-field>

                <v-btn class="mt-3" type="submit" color="primary" block>Submit</v-btn>
            </v-form>
        </v-container>
    </div>
</template>
