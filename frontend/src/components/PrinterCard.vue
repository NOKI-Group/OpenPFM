<template>
    <div class="ring-foreground/10 bg-card text-card-foreground rounded-lg text-xs/relaxed ring-1 overflow-hidden w-full sm:max-w-xs sm:flex-col flex flex-row">

        <div class="shrink-0 aspect-square self-stretch sm:w-full sm:aspect-square">
            <div class="relative bg-muted/30 flex items-center justify-center w-full h-full">

                <RiPrinterLine class="absolute w-10 h-10 text-muted-foreground/20 sm:w-16 sm:h-16" />

                <img
                    v-if="isOnline && cameraEnabled"
                    :src="snapshotSrc"
                    :alt="`Kamera ${printer.name}`"
                    class="absolute inset-0 h-full w-full object-cover"
                    crossorigin="anonymous"
                    @load="onCameraLoad"
                    @error="onCameraError"
                />

                <img
                    v-else-if="printerImage"
                    :src="printerImage"
                    :alt="printer.model"
                    class="h-full w-full object-contain p-3"
                    @error="($event.target as HTMLImageElement).style.display = 'none'"
                />

                <div
                    v-if="isOnline && cameraEnabled && cameraError"
                    class="absolute inset-0 flex items-center justify-center bg-muted/60"
                >
                    <RiCameraOffLine class="w-6 h-6 text-muted-foreground/50" />
                </div>

                <div class="absolute top-2 right-2 flex items-center gap-1 bg-background/80 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <div class="w-1.5 h-1.5 rounded-full shrink-0" :class="statusColor"></div>
                    <span class="text-xs font-medium hidden sm:inline">{{ statusLabel }}</span>
                </div>

                <button
                    v-if="isOnline"
                    class="absolute bottom-2 right-2 bg-background/70 backdrop-blur-sm rounded-full p-1 hover:bg-background/90 transition-colors"
                    :title="cameraEnabled ? 'Kamera deaktivieren' : 'Kamera aktivieren'"
                    @click.stop="toggleCamera"
                >
                    <RiCameraLine v-if="!cameraEnabled" class="w-3 h-3 text-muted-foreground" />
                    <RiCameraOffLine v-else class="w-3 h-3 text-muted-foreground" />
                </button>
            </div>
        </div>

        <div class="flex flex-col gap-2 p-3 flex-1 min-w-0">
            <template v-if="status?.mc_percent != null">
                <Progress :model-value="status.mc_percent" class="accent-secondary-foreground" />
            </template>

            <div class="flex items-start justify-between gap-2 p-0.5">
                <div class="min-w-0 flex gap-3 items-start">
                    <div class="min-w-0 space-y-0.5">
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-sm font-semibold leading-tight truncate">{{ printer.name }}</span>
                            <Badge variant="secondary" class="text-xs shrink-0">{{ printer.ip_address }}</Badge>
                        </div>
                        <div class="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <span class="font-mono">{{ printer.model }}</span>
                        </div>
                        <div class="flex items-center gap-1 sm:hidden">
                            <span class="text-xs text-muted-foreground">{{ statusLabel }}</span>
                        </div>
                    </div>
                </div>

            <!-- Aktionen -->
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <Button variant="ghost" size="icon" class="h-7 w-7 shrink-0 -mt-0.5 -mr-1">
                        <RiMoreLine class="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem @click="$emit('edit', printer)">Bearbeiten</DropdownMenuItem>
                    <DropdownMenuItem v-if="printer.purchase_url" @click="openUrl(printer.purchase_url)">
                        Nachbestellen
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem class="text-destructive" @click="$emit('delete', printer)">
                        Löschen
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuSeparator, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { RiPrinterLine, RiMoreLine, RiCameraLine, RiCameraOffLine } from '@remixicon/vue'
import type { Printer } from '@/types/printer'
import { usePrinterStatus } from '@/composables/usePrinterStatus'

const props = defineProps<{ printer: Printer }>()
defineEmits<{ edit: [printer: Printer]; delete: [printer: Printer] }>()

const { status, isConnected } = usePrinterStatus(props.printer.id)

//TODO: Actually put real pictures into here
const printerImages: Record<string, string> = {
  'Bambu Lab A1':      '/printers/a1.png',
  'Bambu Lab A1 mini': '/printers/a1-mini.png',
  'Bambu Lab P1P':     '/printers/p1p.png',
  'Bambu Lab P1S':     '/printers/p1s.png',
  'Bambu Lab X1C':     '/printers/x1c.png',
  'Bambu Lab X1E':     '/printers/x1e.png',
}
const printerImage = computed(() => printerImages[props.printer.model] ?? null)

const gcodeState = computed(() => status.value?.gcode_state?.toUpperCase())
const isOnline   = computed(() => isConnected.value && status.value?._online !== false)

const statusLabel = computed(() => {
    if (!isOnline.value) return 'Offline'
    switch (gcodeState.value) {
        case 'RUNNING': return 'Druckt'
        case 'PAUSE':   return 'Pausiert'
        case 'FINISH':  return 'Fertig'
        case 'FAILED':  return 'Fehler'
        case 'IDLE':    return 'Bereit'
        default:        return props.printer.status ?? 'Unbekannt'
    }
})

const statusColor = computed(() => ({
    'bg-green-500':        isOnline.value && (gcodeState.value === 'IDLE' || gcodeState.value === 'FINISH'),
    'bg-blue-500':         isOnline.value && gcodeState.value === 'RUNNING',
    'bg-yellow-500':       isOnline.value && gcodeState.value === 'PAUSE',
    'bg-red-500':          isOnline.value && gcodeState.value === 'FAILED',
    'bg-muted-foreground': !isOnline.value,
}))

const SNAPSHOT_INTERVAL_MS = 6000

const cameraEnabled  = ref(false)
const cameraError    = ref(false)
const snapshotSrc    = ref('')
let pendingSnapshot  = false
let snapshotTimer: ReturnType<typeof setInterval> | null = null

function buildSnapshotUrl(): string {
    const host = window.location.hostname
    return `http://${host}:8000/printers/${props.printer.id}/snapshot?t=${Date.now()}`
}

function requestSnapshot() {
    if (pendingSnapshot) return
    pendingSnapshot = true
    snapshotSrc.value = buildSnapshotUrl()
}

function startPolling() {
    if (snapshotTimer) return
    cameraError.value = false
    requestSnapshot()
    snapshotTimer = setInterval(requestSnapshot, SNAPSHOT_INTERVAL_MS)
}

function stopPolling() {
    if (snapshotTimer) {
      clearInterval(snapshotTimer)
      snapshotTimer = null
    }
    snapshotSrc.value = ''
    pendingSnapshot = false
}

function toggleCamera() {
    cameraEnabled.value = !cameraEnabled.value
}

function onCameraLoad() {
    pendingSnapshot = false
    cameraError.value = false
}

function onCameraError() {
    pendingSnapshot = false
    cameraError.value = true
    setTimeout(() => {
        if (cameraEnabled.value && isOnline.value) {
          cameraError.value = false
        }
    }, 5000)
}

watch(
    [cameraEnabled, isOnline],
        ([enabled, online]) => {
            if (enabled && online) {
                startPolling()
            } else {
                stopPolling()
            }
    },
    { immediate: true }
)

onUnmounted(stopPolling)

const openUrl = (url: string | null) => { if (url) window.open(url, '_blank') }
</script>