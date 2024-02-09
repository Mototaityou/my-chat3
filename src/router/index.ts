import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import ChatPage from '../components/ChatPage.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: ChatPage
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
