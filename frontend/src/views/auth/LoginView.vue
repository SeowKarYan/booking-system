<script setup lang="ts">
import { ref } from "vue";
import { login } from "../../api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import type { AxiosError } from "axios";
import type { loginRequest, loginResponse } from "@/types/auth";
import ErrorAlert from "@/components/ErrorAlert.vue";

const authStore = useAuthStore();

const router = useRouter();

const role = ref("Patient");
const email = ref(null);
const password = ref(null);
let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const mutation = useMutation<
  loginResponse,
  AxiosError<{ message: string }>,
  loginRequest
>({
  mutationFn: login,
  onSuccess: (data) => {
    authStore.setUser(data.data);
    router.push("/schedule");
  },
});

const switchRole = () => {
  if (role.value === "Patient") {
    role.value = "Receptionist";
  } else {
    role.value = "Patient";
  }
};

const onSubmit = async () => {
  if (email.value && password.value && emailRegex.test(email.value)) {
    let body = {
      email: email.value,
      password: password.value,
      role: role.value,
    };

    mutation.mutate(body);
  }
};
</script>

<template>
  <v-container fluid class="fill-height bg-blue-lighten-5 d-flex align-center justify-center" min-height="100vh">
    <v-card class="px-6 py-8 flex-grow-1" max-width="344">
      <ErrorAlert v-if="mutation.isError.value"
        :text="mutation.error?.value?.response?.data?.message || mutation.error?.value?.message || ''" />
      <v-card-title class="text-h5">{{ role }} Login</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field type="email" v-model="email" label="Email" :readonly="mutation.isPending.value" :rules="[
          value => !!value || 'Please fill in email address',
          value => emailRegex.test(value) || 'Invalid email format'
        ]"></v-text-field>
        <v-text-field type="password" v-model="password" label="Password" :readonly="mutation.isPending.value" :rules="[
          value => !!value || 'Please fill in password',
        ]"></v-text-field>
        <v-btn class="mt-3" type="submit" color="primary" block :loading="mutation.isPending.value">Login</v-btn>

        <p class="text-center" @click="switchRole">
          <u>Login as {{ role === "Patient" ? "Receptionist" : "Patient" }}?</u>
        </p>
      </v-form>
    </v-card>
  </v-container>
</template>
