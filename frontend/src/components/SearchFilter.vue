<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RiSearchLine, RiCloseLine } from '@remixicon/vue'

defineProps<{
    filters?: { label: string; value: string; options: { label: string; value: string }[] }[]
}>()

const search = defineModel<string>('search', { default: '' })
const filterValues = defineModel<Record<string, string>>('filterValues', { default: () => ({}) })

function clearSearch() {
    search.value = ''
}

function clearFilter(key: string) {
    const updated = { ...filterValues.value }
    delete updated[key]
    filterValues.value = updated
}
</script>

<template>
    <div class="flex items-center gap-2 flex-wrap">

        <div class="relative flex-1 min-w-0 max-w-48">
            <RiSearchLine class="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
            <Input
                v-model="search"
                placeholder="Suchen..."
                class="pl-7 pr-7 w-full lg:w-48"
            />
            <button
                v-if="search"
                class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                @click="clearSearch"
            >
                <RiCloseLine class="w-3.5 h-3.5" />
            </button>
        </div>

        <!-- Filter dropdowns: kompakter bis lg -->
        <template v-for="filter in filters" :key="filter.value">
            <div class="relative">
                <Select
                  :model-value="filterValues[filter.value] ?? '__all__'"
                  @update:model-value="val => { const u = { ...filterValues }; if (val && val !== '__all__') u[filter.value] = val; else delete u[filter.value]; filterValues = u }"
                >
                    <SelectTrigger class="w-24 lg:w-36">
                        <SelectValue :placeholder="filter.label" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="__all__">Alle</SelectItem>
                        <SelectItem v-for="opt in filter.options" :key="opt.value" :value="opt.value">
                            {{ opt.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
                <button
                    v-if="filterValues[filter.value]"
                    class="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-primary text-primary-foreground flex items-center justify-center z-10"
                    @click="clearFilter(filter.value)"
                >
                    <RiCloseLine class="w-2.5 h-2.5" />
                </button>
            </div>
        </template>
    </div>
</template>
