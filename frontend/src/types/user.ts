export type UserRole = 'admin' | 'user'

export interface User {
    id: number
    email: string
    username: string
    role: UserRole
    is_active: boolean
}

export interface UserCreate {
    email: string
    username: string
    password: string
    role?: UserRole
    is_active?: boolean
}

export interface UserUpdate {
    email?: string
    username?: string
    password?: string
    role?: UserRole
    is_active?: boolean
}
