import api from './index'
import type { Filament, FilamentCreate, FilamentSpool, FilamentSpoolCreate } from '@/types/filament'

export const filamentsApi = {
    getAll: () => api.get<Filament[]>('/filaments/'),
    getOne: (id: number) => api.get<Filament>(`/filaments/${id}`),
    create: (data: FilamentCreate) => api.post<Filament>('/filaments/', data),
    update: (id: number, data: Partial<FilamentCreate>) => api.patch<Filament>(`/filaments/${id}`, data),
    delete: (id: number) => api.delete(`/filaments/${id}`),
    getSpools: (filamentId: number) => api.get<FilamentSpool[]>(`/filaments/${filamentId}/spools`),
    addSpool: (filamentId: number, data: FilamentSpoolCreate) => api.post<FilamentSpool>(`/filaments/${filamentId}/spools`, data),
    updateSpool: (spoolId: number, data: Partial<FilamentSpoolCreate>) => api.patch<FilamentSpool>(`/filaments/spools/${spoolId}`, data),
    deleteSpool: (spoolId: number) => api.delete(`/filaments/spools/${spoolId}`),
}
