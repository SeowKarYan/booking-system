import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/patient/schedule',
      name: 'patient_schedule',
      component: () => import('../views/patient/ScheduleView.vue'),
    },
    {
      path: '/receptionist/schedule',
      name: 'receptionist_schedule',
      component: () => import('../views/receptionist/ScheduleView.vue'),
    },
  ],
})

export default router
