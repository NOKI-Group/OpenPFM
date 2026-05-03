export type PrinterStatus = 'online' | 'offline' | 'printing' | 'idle' | 'error'
export type AMSType = 'ams' | 'ams_lite' | 'ams_hub'

export interface AMSSlot {
    id: number
    ams_id: number
    slot_index: number
    spool_id: number | null
}

export interface AMS {
    id: number
    printer_id: number
    ams_index: number
    type: AMSType
    purchase_url: string | null
    slots: AMSSlot[]
}

export interface Printer {
    id: number
    name: string
    model: string
    serial_number: string | null
    ip_address: string
    access_code: string
    nozzle_diameter: number
    status: PrinterStatus
    has_ams: boolean
    purchase_url: string | null
    ams_units: AMS[]
}

export interface PrinterCreate {
    name: string
    model: string
    serial_number?: string
    ip_address: string
    access_code: string
    nozzle_diameter?: number
    has_ams?: boolean
    purchase_url?: string
}

export interface PrinterUpdate {
    name?: string
    model?: string
    serial_number?: string
    ip_address?: string
    access_code?: string
    nozzle_diameter?: number
    has_ams?: boolean
    purchase_url?: string
    status?: PrinterStatus
}
