import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/impressum',
      name: 'Impressum',
      component: () => import('../views/ImpressumView.vue'),
    },
    {
      path: '/datenschutzerklaerung',
      name: 'Datenschutzerklärung',
      component: () => import('../views/DatenschutzerklaerungView.vue'),
    },
    {
      path: '/bwi',
      name: 'BWI',
      component: () => import('../views/BwiView.vue'),
    },
    {
      path: '/bwl',
      name: 'BWL',
      component: () => import('../views/BwlView.vue'),
    },
  ],
})

export default router
