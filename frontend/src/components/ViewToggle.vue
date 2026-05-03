<script setup lang="ts">
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RiLayoutGridLine, RiListUnordered } from '@remixicon/vue'

const model = defineModel<'grid' | 'list'>({ required: true })
</script>

<template>
    <div class="flex items-center border border-border rounded-md overflow-hidden">
        <Tooltip>
            <TooltipTrigger as-child>
                <button
                    class="p-1.5 transition-colors"
                    :class="model === 'grid' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    @click="model = 'grid'"
                >
                    <RiLayoutGridLine class="w-4 h-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent>Kachelansicht</TooltipContent>
        </Tooltip>
        <Tooltip>
            <TooltipTrigger as-child>
                <button
                    class="p-1.5 transition-colors"
                    :class="model === 'list' ? 'bg-muted text-foreground' : 'text-muted-foreground hover:text-foreground'"
                    @click="model = 'list'"
                >
                    <RiListUnordered class="w-4 h-4" />
                </button>
            </TooltipTrigger>
            <TooltipContent>Listenansicht</TooltipContent>
        </Tooltip>
    </div>
</template>
