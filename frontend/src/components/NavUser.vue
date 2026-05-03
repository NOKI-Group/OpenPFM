<script setup lang="ts">
import { RiMoreLine, RiUserLine, RiLogoutBoxLine } from '@remixicon/vue'
import { useRouter } from 'vue-router'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth'

const { isMobile } = useSidebar()
const auth = useAuthStore()
const router = useRouter()

function logout() {
    auth.logout()
    router.push('/login')
}
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton size="lg" class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
                        <Avatar class="h-8 w-8 rounded-lg grayscale">
                            <AvatarFallback class="rounded-lg">
                                {{ auth.user?.username?.slice(0, 2).toUpperCase() ?? 'AD' }}
                            </AvatarFallback>
                        </Avatar>
                        <div class="grid flex-1 text-left text-sm leading-tight">
                            <span class="truncate font-medium">{{ auth.user?.username ?? 'Admin' }}</span>
                            <span class="text-muted-foreground truncate text-xs">{{ auth.user?.email ?? '' }}</span>
                        </div>
                        <RiMoreLine class="ml-auto size-4" />
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    class="w-(--reka-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                    :side="isMobile ? 'bottom' : 'right'"
                    :side-offset="4"
                    align="end"
                >
                    <DropdownMenuLabel class="p-0 font-normal">
                        <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                            <Avatar class="h-8 w-8 rounded-lg">
                                <AvatarFallback class="rounded-lg">
                                  {{ auth.user?.username?.slice(0, 2).toUpperCase() ?? 'AD' }}
                                </AvatarFallback>
                            </Avatar>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-medium">{{ auth.user?.username }}</span>
                                <span class="text-muted-foreground truncate text-xs">{{ auth.user?.email }}</span>
                            </div>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <RiUserLine class="mr-2 size-4" />
                        Profil
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem @click="logout" class="text-destructive focus:text-destructive">
                        <RiLogoutBoxLine class="mr-2 size-4" />
                        Abmelden
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>