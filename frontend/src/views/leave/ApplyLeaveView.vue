<script setup lang="ts">
import { computed, ref } from 'vue';
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
const openDialog = ref(false)

const combineDateAndTime = (date: Date, time: string) => {
    if (!date || !time) {
        return null
    }

    const [hour, minute] = time.split(":").map(Number)

    return setHours(setMinutes(date, minute ?? 0), hour ?? 0)
}

const start = computed(() =>
    combineDateAndTime(startDate.value, startTime.value)
)

const end = computed(() =>
    combineDateAndTime(endDate.value, endTime.value)
)

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
    if (selectedDoctor.value && type.value && start.value && end.value) {
        if (start.value >= end.value) {
            validationError.value = "End date and time should be more than start"
        } else {
            openDialog.value = true
        }
    }
}

const confirmSubmit = async () => {
    if (selectedDoctor.value && type.value && start.value && end.value) {
        let body = {
            doctorId: selectedDoctor.value?.id,
            type: type.value,
            start_time: new Date(start.value).toISOString(),
            end_time: new Date(end.value).toISOString(),
        }

        mutation.mutate(body);
        openDialog.value = false
    }
}

</script>

<template>
    <div>
        <Toolbar title="Apply Leave" />

        <v-container>
            <ErrorAlert class="my-3" v-if="validationError || isError || mutation.isError.value"
                :text="validationError || error?.response?.data?.message || error?.message || mutation.error?.value?.response?.data?.message || mutation.error?.value?.message || ''" />

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

                <v-btn class="mt-3" type="submit" color="primary" block
                    :loading="mutation.isPending.value">Submit</v-btn>
            </v-form>
        </v-container>

        <v-dialog v-model="openDialog" width="auto">
            <v-card max-width="400" text="Are you sure you want to submit doctor leave?" title="Confirmation">
                <v-card-actions>
                    <v-btn text="Confirm" color="primary" @click="confirmSubmit"
                        :loading="mutation.isPending.value"></v-btn>
                    <v-btn text="Cancel" color="red" @click="openDialog = false"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </div>
</template>
