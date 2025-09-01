import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

import auth from '../pages/auth.vue'
import resetPassword from '../pages/forgetPassword.vue'
import Home from '../pages/home.vue'
import Welcome from '../pages/welcome.vue'
import { isAuthenticated } from '../guards/guards.ts'
import SendMagikLink from '../pages/EmailConfirmation.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: isAuthenticated
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../pages/notFound.vue')
  },
  {
    path: '/send-magiklink',
    name: 'send-magiklink',
    component: SendMagikLink
  },
  {
    path: '/auth',
    name: 'auth',
    component: auth
  },
  {
    path: '/welcome',
    name: 'Welcome',
    component: Welcome
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: resetPassword
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
