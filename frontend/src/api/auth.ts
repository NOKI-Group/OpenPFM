import api from './index'
import type { User } from '@/types/user'

export const authApi = {
    login: (email: string, password: string) =>
        api.post<{ access_token: string; token_type: string }>(
            '/auth/login',
            new URLSearchParams({ username: email, password }),
            { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
        ),
        me: () => api.get<User>('/auth/me'),
        checkSetup: () => api.get<{ setup_required: boolean }>('/auth/setup'),
        setup: (data: { email: string; username: string; password: string }) =>
            api.post<User>('/auth/setup', data),
}