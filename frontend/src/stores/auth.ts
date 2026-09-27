import { checkSession } from "@/api/auth";
import { defineStore } from "pinia";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null as {
      id: number;
      name: string;
      role: "Patient" | "Receptionist";
    } | null,
    checkedSession: false
  }),

  getters: {
    isLoggedIn: (state) => state.user !== null,
    id: (state) => state.user?.id,
    role: (state) => state.user?.role,
    name: (state) => state.user?.name,
    checkedSession: (state) => state.checkedSession
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

    async checkUserSession() {
      try {
        const response = await checkSession();
        this.user = response.data;
      } catch {
        this.user = null;
      } finally {
        this.checkedSession = true
      }
    }
  },
});