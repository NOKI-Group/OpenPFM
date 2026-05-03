<template>
    <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">Drucker</p>
                            <p class="text-3xl font-bold mt-1">{{ stats.printers }}</p>
                        </div>
                        <RiPrinterLine class="w-8 h-8 text-muted-foreground/30" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">Online</p>
                            <p class="text-3xl font-bold mt-1 text-green-500">{{ stats.online }}</p>
                        </div>
                        <div class="w-8 h-8 rounded-full border-2 border-green-500/30 flex items-center justify-center">
                            <div class="w-3 h-3 rounded-full bg-green-500"></div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">Filament-Typen</p>
                            <p class="text-3xl font-bold mt-1">{{ stats.filaments }}</p>
                        </div>
                        <RiBox3Line class="w-8 h-8 text-muted-foreground/30" />
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardContent class="pt-6">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-xs text-muted-foreground uppercase tracking-wider">Spulen</p>
                            <p class="text-3xl font-bold mt-1">{{ stats.spools }}</p>
                        </div>
                        <RiBox3Line class="w-8 h-8 text-muted-foreground/30" />
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- Printer status list -->
        <Card>
            <CardHeader>
                <CardTitle class="text-sm font-medium">Drucker Status</CardTitle>
            </CardHeader>
            <CardContent>
                <div v-if="loading" class="text-sm text-muted-foreground">Laden...</div>
                <div v-else-if="printers.length === 0" class="text-sm text-muted-foreground">
                    Noch keine Drucker konfiguriert.
                </div>
                <div v-else class="space-y-2">
                    <div
                        v-for="printer in printers"
                        :key="printer.id"
                        class="flex items-center justify-between py-2 border-b border-border last:border-0"
                    >
                        <div class="flex items-center gap-3">
                            <div class="w-2 h-2 rounded-full" :class="statusColor(printer.status)"></div>
                            <div>
                                <p class="text-sm font-medium">{{ printer.name }}</p>
                                <p class="text-xs text-muted-foreground">{{ printer.model }} · {{ printer.ip_address }}</p>
                            </div>
                        </div>
                        <Badge :variant="statusVariant(printer.status)">{{ printer.status }}</Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { RiPrinterLine, RiBox3Line } from '@remixicon/vue'
import { printersApi } from '@/api/printers'
import { filamentsApi } from '@/api/filaments'
import type { Printer as PrinterType } from '@/types/printer'

const printers = ref<PrinterType[]>([])
const filaments = ref<any[]>([])
const loading = ref(true)

const stats = computed(() => ({
    printers: printers.value.length,
    online: printers.value.filter(p => p.status === 'online' || p.status === 'printing').length,
    filaments: filaments.value.length,
    spools: filaments.value.reduce((sum, f) => sum + (f.spool_count || 0), 0),
}))

const statusColor = (status: string) => ({
    'bg-green-500': status === 'online',
    'bg-blue-500': status === 'printing',
    'bg-yellow-500': status === 'idle',
    'bg-red-500': status === 'error',
    'bg-muted-foreground': status === 'offline',
})

const statusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (status === 'error') return 'destructive'
    if (status === 'offline') return 'secondary'
    return 'outline'
}

onMounted(async () => {
    try {
        const [p, f] = await Promise.all([printersApi.getAll(), filamentsApi.getAll()])
        printers.value = p.data
        filaments.value = f.data
    } finally {
        loading.value = false
    }
})
</script>
