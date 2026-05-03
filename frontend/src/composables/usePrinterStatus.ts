import { ref, onMounted, onUnmounted } from 'vue'

export interface PrinterStatus {
    _online?: boolean

    gcode_state?: string
    mc_percent?: number
    mc_remaining_time?: number
    subtask_name?: string

    nozzle_temper?: number
    nozzle_target_temper?: number
    bed_temper?: number
    bed_target_temper?: number
    chamber_temper?: number

    cooling_fan_speed?: number
    big_fan1_speed?: number
    big_fan2_speed?: number

    wifi_signal?: string
    spd_lvl?: number
    layer_num?: number
    total_layer_num?: number
}

export function usePrinterStatus(printerId: number) {
    const status = ref<PrinterStatus | null>(null)
    const isConnected = ref(false)
    const wsConnected = ref(false)

    let ws: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null

    function connect() {
        const host = window.location.hostname
        const url = `ws://${host}:8000/ws/printers/${printerId}`
        ws = new WebSocket(url)

        ws.onopen = () => {
            wsConnected.value = true
            console.log(`WS Drucker ${printerId} verbunden`)
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            if (data.ping) return

            status.value = data
            isConnected.value = data._online !== false
        }

        ws.onclose = () => {
            wsConnected.value = false
            isConnected.value = false
            reconnectTimer = setTimeout(connect, 5000)
        }

        ws.onerror = () => {
            ws?.close()
        }
    }

    onMounted(connect)

    onUnmounted(() => {
        if (reconnectTimer) clearTimeout(reconnectTimer)
        ws?.close()
    })

    return { status, isConnected, wsConnected }
}