<script setup lang="ts">
defineProps<{
  title: string;
}>();
import { logout } from "../api/auth";
import { useMutation } from "@tanstack/vue-query";
import { useAuthStore } from "../stores/auth";
import { useRouter, useRoute } from "vue-router";

const authStore = useAuthStore();

const route = useRoute();
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
  <v-toolbar color="primary">
    <v-btn v-if="route.name !== 'schedule'" icon="mdi-arrow-left" @click="router.back"></v-btn>
    <v-toolbar-title v-html="title"></v-toolbar-title>
    <v-btn icon="mdi-export" @click="mutation.mutate"></v-btn>
  </v-toolbar>
</template>