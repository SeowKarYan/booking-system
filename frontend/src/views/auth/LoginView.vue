<script setup lang="ts">
import { ref } from "vue";
import { login } from "../../api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import type { AxiosError } from "axios";
import type { loginRequest, loginResponse } from "@/types/auth";

const authStore = useAuthStore();

const router = useRouter();

const role = ref("Patient");
const email = ref(null);
const password = ref(null);

const mutation = useMutation<
  loginResponse,
  AxiosError<{ message: string }>,
  loginRequest
>({
  mutationFn: login,
  onSuccess: (data) => {
    authStore.setUser(data.data);
    router.push(
      role.value === "Patient" ? "/patient/schedule" : "/receptionist/schedule"
    );
  },
});

const emailRules = [
  (value: string) => {
    if (value) return true;
    return "Please enter your email";
  },
];

const passwordRules = [
  (value: string) => {
    if (value) return true;
    return "Please enter your password";
  },
];

const switchRole = () => {
  if (role.value === "Patient") {
    role.value = "Receptionist";
  } else {
    role.value = "Patient";
  }
};

const onSubmit = async () => {
  if (email.value && password.value) {
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
  <v-container
    fluid
    class="fill-height bg-blue-lighten-5 d-flex align-center justify-center"
    min-height="100vh"
  >
    <v-card class="px-6 py-8 flex-grow-1" max-width="344">
      <v-alert
        v-if="mutation.isError.value"
        title="Error"
        :text="
          mutation.error?.value?.response?.data?.message ||
          mutation.error?.value?.message
        "
        type="error"
        color="red-darken-1"
        closable
        density="compact"
      ></v-alert>
      <v-card-title class="text-h5">{{ role }} Login</v-card-title>
      <v-form @submit.prevent="onSubmit">
        <v-text-field
          type="email"
          v-model="email"
          label="Email"
          :rules="emailRules"
          :readonly="mutation.isPending.value"
        ></v-text-field>
        <v-text-field
          type="password"
          v-model="password"
          label="Password"
          :rules="passwordRules"
          :readonly="mutation.isPending.value"
        ></v-text-field>
        <v-btn
          class="mt-3"
          type="submit"
          color="blue-darken-1"
          block
          :loading="mutation.isPending.value"
          >Login</v-btn
        >

        <p class="text-center" @click="switchRole">
          <u>Login as {{ role === "Patient" ? "Receptionist" : "Patient" }}?</u>
        </p>
      </v-form>
    </v-card>
  </v-container>
</template>
