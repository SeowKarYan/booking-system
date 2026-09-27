import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as {
      id: number;
      name: string;
      role: "Patient" | "Receptionist";
    } | null,
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    id: (state) => state.user?.id,
    role: (state) => state.user?.role,
    name: (state) => state.user?.name,
  },

  actions: {
    setUser(user: {
      id: number;
      name: string;
      role: "Patient" | "Receptionist";
    }) {
      this.user = user;
    },

    clearUser() {
      this.user = null;
    },
  },
});