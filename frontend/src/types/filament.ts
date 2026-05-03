export type FilamentMaterial = 'PLA' | 'PETG' | 'ABS' | 'ASA' | 'TPU' | 'PA' | 'PC' | 'PLA-CF' | 'PETG-CF' | 'Other'
export type SpoolLocation = 'warehouse' | 'ams' | 'printer'

export interface Filament {
    id: number
    name: string
    brand: string
    material: FilamentMaterial
    color: string
    color_hex: string | null
    nozzle_temp_min: number
    nozzle_temp_max: number
    bed_temp: number
    spool_weight_total: number
    purchase_url: string | null
    low_stock_threshold: number
    spool_count: number
}

export interface FilamentCreate {
    name: string
    brand: string
    material: FilamentMaterial
    color: string
    color_hex?: string
    nozzle_temp_min: number
    nozzle_temp_max: number
    bed_temp: number
    spool_weight_total?: number
    purchase_url?: string
    low_stock_threshold?: number
}

export interface FilamentSpool {
    id: number
    filament_id: number
    weight_remaining: number
    location: SpoolLocation
    printer_id: number | null
    notes: string | null
}

export interface FilamentSpoolCreate {
    filament_id: number
    weight_remaining: number
    location?: SpoolLocation
    printer_id?: number
    notes?: string
}
