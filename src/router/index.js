import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import BwiView from '../views/BwiView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/bwi',
      name: 'BWI',
      component: BwiView,
    },
    {
      path: '/bwl',
      name: 'BWL',
      component: () => import('../views/BwlView.vue'),
    },
  ],
})

export default router
