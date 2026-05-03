import api from './index'
import type { Printer, PrinterCreate, PrinterUpdate, AMS } from '@/types/printer'

export const printersApi = {
    getAll: () => api.get<Printer[]>('/printers/'),
    getOne: (id: number) => api.get<Printer>(`/printers/${id}`),
    create: (data: PrinterCreate) => api.post<Printer>('/printers/', data),
    update: (id: number, data: PrinterUpdate) => api.patch<Printer>(`/printers/${id}`, data),
    delete: (id: number) => api.delete(`/printers/${id}`),
    addAms: (printerId: number, data: Partial<AMS>) => api.post<AMS>(`/printers/${printerId}/ams`, data),
    deleteAms: (printerId: number, amsId: number) => api.delete(`/printers/${printerId}/ams/${amsId}`),
}
