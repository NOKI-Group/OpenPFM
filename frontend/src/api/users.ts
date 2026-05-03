import api from './index'
import type { User, UserCreate, UserUpdate } from '@/types/user'

export const usersApi = {
    getAll: () => api.get<User[]>('/users/'),
    getOne: (id: number) => api.get<User>(`/users/${id}`),
    create: (data: UserCreate) => api.post<User>('/users/', data),
    update: (id: number, data: UserUpdate) => api.patch<User>(`/users/${id}`, data),
    delete: (id: number) => api.delete(`/users/${id}`),
}
