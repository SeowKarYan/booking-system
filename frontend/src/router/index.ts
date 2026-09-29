import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/auth/LoginView.vue'
import { useAuthStore } from '@/stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/schedule',
      name: 'schedule',
      component: () => import('../views/booking/ScheduleView.vue'),
    },
    {
      path: '/booking',
      name: 'booking',
      component: () => import('../views/booking/BookingView.vue'),
    },
    {
      path: '/leave',
      name: 'leave',
      component: () => import('../views/leave/ApplyLeaveView.vue'),
    },
    {
      path: "/:pathMatch(.*)*",
      redirect: "/",
    },
  ],
})

router.beforeEach(async (to, from) => {
  const authStore = useAuthStore();
  if (!authStore.isLoggedIn && !authStore.checkedSession && to.name !== 'login') {
    await authStore.checkUserSession();
  }

  if (!authStore.isLoggedIn && to.name !== 'login') {
    return '/'
  }
})

export default router
