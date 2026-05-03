<template>
    <Sidebar collapsible="offcanvas" variant="inset">
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" as-child>
                        <RouterLink to="/">
                            <div class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                                <RiStackLine class="size-4" />
                            </div>
                            <div class="grid flex-1 text-left text-sm leading-tight">
                                <span class="truncate font-semibold">OpenPFM</span>
                                <span class="truncate text-xs text-muted-foreground">Print Farm Manager</span>
                            </div>
                        </RouterLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem v-for="item in navItems" :key="item.to">
                                <SidebarMenuButton :is-active="isActive(item.to)" as-child :tooltip="item.label">
                                    <RouterLink :to="item.to" class="flex items-center gap-2">
                                        <component :is="item.icon" class="size-4" />
                                        <span>{{ item.label }}</span>
                                    </RouterLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                  </SidebarGroupContent>
              </SidebarGroup>

              <SidebarGroup>
                  <SidebarGroupLabel>System</SidebarGroupLabel>
                  <SidebarGroupContent>
                      <SidebarMenu>
                          <SidebarMenuItem v-for="item in systemItems" :key="item.to">
                              <SidebarMenuButton :is-active="isActive(item.to)" as-child :tooltip="item.label">
                                  <RouterLink :to="item.to" class="flex items-center gap-2">
                                      <component :is="item.icon" class="size-4" />
                                      <span>{{ item.label }}</span>
                                  </RouterLink>
                              </SidebarMenuButton>
                          </SidebarMenuItem>
                      </SidebarMenu>
                  </SidebarGroupContent>
              </SidebarGroup>
          </SidebarContent>

          <SidebarFooter>
              <NavUser />
          </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent,
    SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton,
    SidebarMenuItem, SidebarRail,
} from '@/components/ui/sidebar'
import {
    RiStackLine, RiPrinterLine, RiBox3Line, RiGroupLine, RiDashboardLine, RiSettings4Line,
} from '@remixicon/vue'
import NavUser from '@/components/NavUser.vue'

const route = useRoute()

const navItems = [
    { to: '/', label: 'Dashboard', icon: RiDashboardLine },
    { to: '/printers', label: 'Drucker', icon: RiPrinterLine },
    { to: '/filaments', label: 'Filamente', icon: RiBox3Line },
]

const systemItems = [
    { to: '/users', label: 'Benutzer', icon: RiGroupLine },
    { to: '/settings', label: 'Einstellungen', icon: RiSettings4Line },
]

const isActive = (path: string) => {
    if (path === '/') return route.path === '/'
    return route.path.startsWith(path)
}
</script>