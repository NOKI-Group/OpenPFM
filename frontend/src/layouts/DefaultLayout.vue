<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header class="flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
                <div class="flex w-full items-center gap-1 px-3 lg:gap-2 lg:px-6">
                    <SidebarTrigger class="-ml-1" />
                    <Separator orientation="vertical" class="mx-2 h-4" />
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <BreadcrumbPage class="text-sm font-medium">{{ currentTitle }}</BreadcrumbPage>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                    <div class="ml-auto flex items-center gap-2">
                        <Button variant="ghost" size="icon" class="h-8 w-8" @click="toggleDark">
                            <RiMoonLine v-if="!isDark" class="w-4 h-4" />
                            <RiSunLine v-else class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </header>
            <div class="flex flex-1 flex-col gap-4 overflow-y-auto p-3 sm:p-4 lg:p-6">
                <RouterView />
            </div>
        </SidebarInset>
    </SidebarProvider>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbPage } from '@/components/ui/breadcrumb'
import { Button } from '@/components/ui/button'
import { RiMoonLine, RiSunLine } from '@remixicon/vue'
import AppSidebar from '@/components/AppSidebar.vue'

const route = useRoute()
const isDark = ref(false)

const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/printers', label: 'Drucker' },
    { to: '/filaments', label: 'Filamente' },
    { to: '/users', label: 'Benutzer' },
]

const currentTitle = computed(() => {
    return navItems.find(i => {
        if (i.to === '/') return route.path === '/'
        return route.path.startsWith(i.to)
    })?.label ?? 'OpenPFM'
})

const toggleDark = () => {
    isDark.value = !isDark.value
    document.documentElement.classList.toggle('dark', isDark.value)
}

onMounted(() => {
    isDark.value = document.documentElement.classList.contains('dark')
})
</script>
