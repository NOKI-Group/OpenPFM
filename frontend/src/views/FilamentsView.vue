<template>
    <div class="space-y-4">
        <!-- Toolbar -->
        <div class="flex items-center gap-2">
            <SearchFilter
                v-model:search="search"
                v-model:filter-values="filterValues"
                :filters="filterDefs"
                class="flex-1 min-w-0"
            />
            <p class="text-xs text-muted-foreground whitespace-nowrap shrink-0 hidden sm:flex">
                {{ filteredFilaments.length }} von {{ filaments.length }}
            </p>
            <ViewToggle v-model="viewMode" class="hidden sm:flex" />
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button size="icon" @click="openCreate">
                        <RiAddLine class="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Filament hinzufügen</TooltipContent>
            </Tooltip>
        </div>

        <div v-if="loading" class="text-sm text-muted-foreground">Laden...</div>

        <div v-else-if="filteredFilaments.length === 0 && filaments.length > 0" class="flex flex-col items-center justify-center py-16 text-center">
            <RiSearchLine class="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p class="text-sm font-medium">Keine Ergebnisse</p>
            <p class="text-xs text-muted-foreground mt-1">Versuche andere Suchbegriffe oder Filter</p>
        </div>

        <div v-else-if="filaments.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <RiBox3Line class="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p class="text-sm font-medium">Noch keine Filamente</p>
            <p class="text-xs text-muted-foreground mt-1">Füge deinen ersten Filament-Typ hinzu</p>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <Card v-for="filament in filteredFilaments" :key="filament.id">
                <CardHeader class="pb-2">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div
                                class="w-8 h-8 rounded-full border border-border shrink-0"
                                :style="{ backgroundColor: filament.color_hex || '#888' }"
                            ></div>
                            <div>
                                <CardTitle class="text-base">{{ filament.name }}</CardTitle>
                            <p class="text-xs text-muted-foreground">{{ filament.brand }}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" class="h-8 w-8 -mt-1">
                                <RiMoreLine class="w-4 h-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem @click="openSpools(filament)">Spulen verwalten</DropdownMenuItem>
                                <DropdownMenuItem @click="openEdit(filament)">Bearbeiten</DropdownMenuItem>
                                <DropdownMenuItem v-if="filament.purchase_url" @click="openUrl(filament.purchase_url)">
                                    Nachbestellen
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem class="text-destructive" @click="confirmDelete(filament)">Löschen</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent class="space-y-2">
                    <div class="flex items-center gap-2">
                        <Badge variant="outline">{{ filament.material }}</Badge>
                        <span v-if="filament.spool_count <= filament.low_stock_threshold" class="text-xs text-destructive font-medium">Niedrig</span>
                    </div>
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div>
                            <p class="text-muted-foreground">Düse</p>
                            <p class="font-medium">{{ filament.nozzle_temp_min }}–{{ filament.nozzle_temp_max }}°C</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Bett</p>
                            <p class="font-medium">{{ filament.bed_temp }}°C</p>
                        </div>
                        <div>
                            <p class="text-muted-foreground">Spulen</p>
                            <p class="font-medium" :class="filament.spool_count <= filament.low_stock_threshold ? 'text-destructive' : ''">
                                {{ filament.spool_count }}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- List view -->
        <div v-else class="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-8"></TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Hersteller</TableHead>
                        <TableHead>Temp. (Düse)</TableHead>
                        <TableHead>Bett</TableHead>
                        <TableHead>Spulen</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="filament in filteredFilaments" :key="filament.id">
                        <TableCell>
                            <div class="w-5 h-5 rounded-full border border-border" :style="{ backgroundColor: filament.color_hex || '#888' }"></div>
                        </TableCell>
                        <TableCell class="font-medium">{{ filament.name }}</TableCell>
                        <TableCell><Badge variant="outline">{{ filament.material }}</Badge></TableCell>
                        <TableCell class="text-muted-foreground">{{ filament.brand }}</TableCell>
                        <TableCell class="text-sm">{{ filament.nozzle_temp_min }}–{{ filament.nozzle_temp_max }}°C</TableCell>
                        <TableCell class="text-sm">{{ filament.bed_temp }}°C</TableCell>
                        <TableCell>
                            <div class="flex items-center gap-2">
                                <span class="text-sm font-medium" :class="filament.spool_count <= filament.low_stock_threshold ? 'text-destructive' : ''">{{ filament.spool_count }}</span>
                                <span v-if="filament.spool_count <= filament.low_stock_threshold" class="text-xs text-destructive">low</span>
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" class="h-8 w-8">
                                    <RiMoreLine class="w-4 h-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem @click="openSpools(filament)">Spulen verwalten</DropdownMenuItem>
                                    <DropdownMenuItem @click="openEdit(filament)">Bearbeiten</DropdownMenuItem>
                                    <DropdownMenuItem v-if="filament.purchase_url" @click="openUrl(filament.purchase_url)">Nachbestellen</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem class="text-destructive" @click="confirmDelete(filament)">Löschen</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <!-- Create/Edit Filament Dialog -->
        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>{{ editingFilament ? 'Filament bearbeiten' : 'Filament hinzufügen' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="saveFilament" class="space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                          <Label>Name</Label>
                          <Input v-model="form.name" placeholder="PLA Basic Schwarz" required />
                        </div>
                        <div class="space-y-1">
                            <Label>Hersteller</Label>
                            <Input v-model="form.brand" placeholder="Bambu Lab" required />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <Label>Material</Label>
                            <Select v-model="form.material">
                                <SelectTrigger><SelectValue placeholder="Material" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem v-for="m in materials" :key="m" :value="m">{{ m }}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div class="space-y-1">
                            <Label>Farbe</Label>
                            <Input v-model="form.color" placeholder="Schwarz" required />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <Label>Farbcode (Hex)</Label>
                            <div class="flex gap-2">
                                <Input v-model="form.color_hex" placeholder="#000000" />
                                <input type="color" v-model="form.color_hex" class="w-10 h-10 rounded border border-input cursor-pointer" />
                          </div>
                        </div>
                        <div class="space-y-1">
                          <Label>Spulengewicht (g)</Label>
                            <Input v-model.number="form.spool_weight_total" type="number" placeholder="1000" />
                        </div>
                    </div>
                    <div class="grid grid-cols-3 gap-4">
                        <div class="space-y-1">
                            <Label>Düse Min (°C)</Label>
                            <Input v-model.number="form.nozzle_temp_min" type="number" placeholder="190" required />
                        </div>
                        <div class="space-y-1">
                            <Label>Düse Max (°C)</Label>
                            <Input v-model.number="form.nozzle_temp_max" type="number" placeholder="230" required />
                        </div>
                        <div class="space-y-1">
                            <Label>Bett (°C)</Label>
                            <Input v-model.number="form.bed_temp" type="number" placeholder="35" required />
                        </div>
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div class="space-y-1">
                            <Label>Nachbestell-Link</Label>
                            <Input v-model="form.purchase_url" placeholder="https://..." />
                        </div>
                        <div class="space-y-1">
                            <Label>Mindestbestand (Spulen)</Label>
                            <Input v-model.number="form.low_stock_threshold" type="number" placeholder="1" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="dialogOpen = false">Abbrechen</Button>
                        <Button type="submit" :disabled="saving">{{ saving ? 'Speichern...' : 'Speichern' }}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>

        <!-- Spools Dialog -->
        <Dialog v-model:open="spoolsDialogOpen">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Spulen: {{ selectedFilament?.name }}</DialogTitle>
                </DialogHeader>
                <div class="space-y-3">
                    <div class="flex justify-end">
                        <Button size="sm" @click="addSpool">
                            <RiAddLine class="w-4 h-4 mr-2" />Spule hinzufügen
                        </Button>
                    </div>
                    <div v-if="spools.length === 0" class="text-sm text-muted-foreground text-center py-4">
                        Keine Spulen vorhanden
                    </div>
                    <div v-else class="space-y-2">
                        <div v-for="spool in spools" :key="spool.id" class="flex items-center justify-between p-3 border border-border rounded-md">
                            <div>
                                <p class="text-sm font-medium">{{ spool.weight_remaining }}g verbleibend</p>
                                <p class="text-xs text-muted-foreground capitalize">{{ spool.location }}</p>
                            </div>
                            <Button variant="ghost" size="icon" class="h-8 w-8 text-destructive" @click="deleteSpool(spool.id)">
                                <RiDeleteBin6Line class="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RiAddLine, RiBox3Line, RiMoreLine, RiDeleteBin6Line, RiSearchLine } from '@remixicon/vue'
import { filamentsApi } from '@/api/filaments'
import type { Filament, FilamentSpool } from '@/types/filament'
import ViewToggle from '@/components/ViewToggle.vue'
import SearchFilter from '@/components/SearchFilter.vue'

const filaments = ref<Filament[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const spoolsDialogOpen = ref(false)
const saving = ref(false)
const editingFilament = ref<Filament | null>(null)
const selectedFilament = ref<Filament | null>(null)
const spools = ref<FilamentSpool[]>([])
const viewMode = ref<'grid' | 'list'>('list')
const search = ref('')
const filterValues = ref<Record<string, string>>({})

const filterDefs = [
    { label: 'Material', value: 'material', options: ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PA', 'PC', 'PLA-CF', 'PETG-CF', 'Other'].map(m => ({ label: m, value: m })) },
    { label: 'Bestand', value: 'stock', options: [{ label: 'Niedrig', value: 'low' }, { label: 'OK', value: 'ok' }] },
]

const filteredFilaments = computed(() => {
    return filaments.value.filter(f => {
        const q = search.value.toLowerCase()
        if (q && !f.name.toLowerCase().includes(q) && !f.brand.toLowerCase().includes(q) && !f.color.toLowerCase().includes(q)) return false
        if (filterValues.value.material && f.material !== filterValues.value.material) return false
        if (filterValues.value.stock === 'low' && f.spool_count > f.low_stock_threshold) return false
        if (filterValues.value.stock === 'ok' && f.spool_count <= f.low_stock_threshold) return false
        return true
    })
})

const materials = ['PLA', 'PETG', 'ABS', 'ASA', 'TPU', 'PA', 'PC', 'PLA-CF', 'PETG-CF', 'Other']

const form = reactive({
    name: '', brand: '', material: 'PLA', color: '', color_hex: '',
    nozzle_temp_min: 190, nozzle_temp_max: 230, bed_temp: 35,
    spool_weight_total: 1000, purchase_url: '', low_stock_threshold: 1,
})

const resetForm = () => {
    form.name = ''; form.brand = ''; form.material = 'PLA'; form.color = ''
    form.color_hex = ''; form.nozzle_temp_min = 190; form.nozzle_temp_max = 230
    form.bed_temp = 35; form.spool_weight_total = 1000; form.purchase_url = ''; form.low_stock_threshold = 1
}

const openCreate = () => {
  editingFilament.value = null; resetForm(); dialogOpen.value = true
}

const openEdit = (f: Filament) => {
    editingFilament.value = f
    Object.assign(form, { ...f, color_hex: f.color_hex ?? '', purchase_url: f.purchase_url ?? '' })
    dialogOpen.value = true
}

const openSpools = async (f: Filament) => {
    selectedFilament.value = f
    const { data } = await filamentsApi.getSpools(f.id)
    spools.value = data
    spoolsDialogOpen.value = true
}

const addSpool = async () => {
    if (!selectedFilament.value) return
    const weight = parseFloat(prompt('Verbleibendes Gewicht (g):', String(selectedFilament.value.spool_weight_total)) ?? '0')
    if (!weight) return
    await filamentsApi.addSpool(selectedFilament.value.id, { filament_id: selectedFilament.value.id, weight_remaining: weight })
    const { data } = await filamentsApi.getSpools(selectedFilament.value.id)
    spools.value = data
    await loadFilaments()
}

const deleteSpool = async (id: number) => {
    if (!confirm('Spule wirklich löschen?')) return
    await filamentsApi.deleteSpool(id)
    if (selectedFilament.value) {
        const { data } = await filamentsApi.getSpools(selectedFilament.value.id)
        spools.value = data
        await loadFilaments()
    }
}

const saveFilament = async () => {
    saving.value = true
    try {
        const data = { ...form, color_hex: form.color_hex || undefined, purchase_url: form.purchase_url || undefined }
        if (editingFilament.value) {
            await filamentsApi.update(editingFilament.value.id, data)
        } else {
            await filamentsApi.create(data as any)
        }
        await loadFilaments()
        dialogOpen.value = false
    } finally {
        saving.value = false
    }
}

const confirmDelete = async (f: Filament) => {
    if (confirm(`Filament "${f.name}" wirklich löschen?`)) {
        await filamentsApi.delete(f.id)
        await loadFilaments()
    }
}

const openUrl = (url: string | null) => { if (url) window.open(url, '_blank') }

const loadFilaments = async () => {
    const { data } = await filamentsApi.getAll()
    filaments.value = data
}

onMounted(async () => {
    try { await loadFilaments() } finally { loading.value = false }
})
</script>
