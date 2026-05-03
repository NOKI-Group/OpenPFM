import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/auth'
import DefaultLayout from '@/layouts/DefaultLayout.vue'

let setupChecked = false
let setupRequired = false

export function resetSetupCheck() {
    setupChecked = false
    setupRequired = false
}

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            component: () => import('@/views/LoginView.vue'),
            meta: { public: true },
        },
        {
            path: '/setup',
            component: () => import('@/views/SetupView.vue'),
            meta: { public: true },
        },
        {
            path: '/',
            component: DefaultLayout,
            children: [
                { path: '', component: () => import('@/views/DashboardView.vue') },
                { path: 'printers', component: () => import('@/views/PrintersView.vue') },
                { path: 'filaments', component: () => import('@/views/FilamentsView.vue') },
                { path: 'users', component: () => import('@/views/UsersView.vue') },
                { path: 'settings', component: () => import('@/views/DashboardView.vue') },
                { path: 'help', component: () => import('@/views/DashboardView.vue') },
            ],
        },
    ],
})

router.beforeEach(async (to) => {
    const auth = useAuthStore()

    if (!setupChecked) {
        try {
            const { data } = await authApi.checkSetup()
            setupRequired = data.setup_required
            setupChecked = true
        } catch {}
    }

    if (setupRequired && to.path !== '/setup') return '/setup'
    if (!setupRequired && to.path === '/setup') return '/login'

    if (to.meta.public) return true

    if (auth.token && !auth.user) {
        await auth.init()
    }

    if (!auth.isAuthenticated) return '/login'

    return true
})

export default router