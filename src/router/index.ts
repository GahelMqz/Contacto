import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import DashboardLayout from '@/components/layout/DashboardLayout.vue'
import { jwtDecode, type JwtPayload } from 'jwt-decode'

interface MyJwtPayload extends JwtPayload {
  id_rol_id?: number
}

const routes = [
  {
    path: '/',
    name: 'home',
    // component: () => HomeView,
    component: () => import('@/views/HomeView.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/auth/RegisterView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/auth/LoginView.vue'),
  },
  {
    path: '/dashboard',
    component: () => DashboardLayout,
    children: [
      {
        path: '/',
        component: () => import('@/views/admin/DashboardView.vue'),
        meta: { requiresAuth: true, adminOnly: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)',
    name: 'Not found',
    component: () => import('@/views/NotFoundView.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  if (to.meta.requiresAuth) {
    if (!token) {
      return next('/') // Redirigir al login
    }

    try {
      const decoded = jwtDecode<MyJwtPayload>(token)

      const now = Date.now() / 1000
      if (typeof decoded.exp === 'undefined' || decoded.exp < now) {
        localStorage.removeItem('token')
        return next('/')
      }

      // 🔒 Verifica si requiere ser admin
      if (to.meta.adminOnly && decoded.id_rol_id !== 2) {
        return next('/') // No autorizado, redirigir
      }

      // ✅ Todo bien
      return next()
    } catch (error) {
      localStorage.removeItem('token')
      return next('/')
    }
  } else {
    return next() // No requiere autenticación
  }
})

export default router
