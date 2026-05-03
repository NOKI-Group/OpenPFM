import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/api/auth'
import api from '@/api/index'
import type { User } from '@/types/user'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('token'))
    const user = ref<User | null>(null)

    const isAuthenticated = computed(() => !!token.value)
    const isAdmin = computed(() => user.value?.role === 'admin')

    function setToken(t: string) {
        token.value = t
        localStorage.setItem('token', t)
        api.defaults.headers.common['Authorization'] = `Bearer ${t}`
    }

    function clearAuth() {
        token.value = null
        user.value = null
        localStorage.removeItem('token')
        delete api.defaults.headers.common['Authorization']
    }

    async function init() {
        if (!token.value) return
        api.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
        try {
            const { data } = await authApi.me()
            user.value = data
        } catch {
            clearAuth()
        }
    }

    async function login(email: string, password: string) {
        const { data } = await authApi.login(email, password)
        setToken(data.access_token)
        const me = await authApi.me()
        user.value = me.data
    }

    function logout() {
        clearAuth()
    }

    return { token, user, isAuthenticated, isAdmin, init, login, logout }
})