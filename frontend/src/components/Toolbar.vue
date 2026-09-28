<script setup lang="ts">
defineProps<{
  title: string;
}>();
import { logout } from "../api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";

const authStore = useAuthStore();

const router = useRouter();

const mutation = useMutation({
  mutationFn: logout,
  onSuccess: (data) => {
    authStore.clearUser();
    router.push("/");
  },
});
</script>

<template>
  <div>
    <v-toolbar color="primary" :title="title">
      <v-btn icon="mdi-export" @click="mutation.mutate"></v-btn>
    </v-toolbar>
    <p class="text-center">Welcome, {{ authStore.name }}</p>
  </div>
</template>