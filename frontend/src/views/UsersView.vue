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
                {{ filteredUsers.length }} von {{ users.length }}
            </p>
            <ViewToggle v-model="viewMode" class="hidden sm:flex" />
            <Tooltip>
                <TooltipTrigger as-child>
                    <Button size="icon" @click="openCreate">
                        <RiAddLine class="w-4 h-4" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>Benutzer hinzufügen</TooltipContent>
            </Tooltip>
        </div>

        <div v-if="loading" class="text-sm text-muted-foreground">Laden...</div>

        <div v-else-if="filteredUsers.length === 0 && users.length > 0" class="flex flex-col items-center justify-center py-16 text-center">
            <RiSearchLine class="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p class="text-sm font-medium">Keine Ergebnisse</p>
            <p class="text-xs text-muted-foreground mt-1">Versuche andere Suchbegriffe oder Filter</p>
        </div>

        <div v-else-if="users.length === 0" class="flex flex-col items-center justify-center py-16 text-center">
            <RiGroupLine class="w-12 h-12 text-muted-foreground/30 mb-4" />
            <p class="text-sm font-medium">Noch keine Benutzer</p>
        </div>

        <!-- Grid view -->
        <div v-else-if="viewMode === 'grid'" class="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
            <Card v-for="user in filteredUsers" :key="user.id">
                <CardHeader class="pb-2">
                    <div class="flex items-start justify-between">
                        <div class="flex items-center gap-3">
                            <div class="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-sm font-medium shrink-0">
                                {{ user.username.slice(0, 2).toUpperCase() }}
                            </div>
                            <div>
                                <CardTitle class="text-base">{{ user.username }}</CardTitle>
                            <p class="text-xs text-muted-foreground">{{ user.email }}</p>
                            </div>
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" class="h-8 w-8 -mt-1">
                                <RiMoreLine class="w-4 h-4" />
                            </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem @click="openEdit(user)">Bearbeiten</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem class="text-destructive" @click="confirmDelete(user)">Löschen</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </CardHeader>
                <CardContent>
                    <div class="flex items-center gap-2">
                        <Badge :variant="user.role === 'admin' ? 'default' : 'secondary'">{{ user.role }}</Badge>
                        <Badge :variant="user.is_active ? 'outline' : 'destructive'">
                            {{ user.is_active ? 'Aktiv' : 'Inaktiv' }}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>

        <!-- List view -->
        <div v-else class="overflow-x-auto">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Benutzername</TableHead>
                        <TableHead>E-Mail</TableHead>
                        <TableHead>Rolle</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="user in filteredUsers" :key="user.id">
                        <TableCell class="font-medium">{{ user.username }}</TableCell>
                        <TableCell class="text-muted-foreground">{{ user.email }}</TableCell>
                        <TableCell>
                            <Badge :variant="user.role === 'admin' ? 'default' : 'secondary'">{{ user.role }}</Badge>
                        </TableCell>
                        <TableCell>
                            <Badge :variant="user.is_active ? 'outline' : 'destructive'">
                              {{ user.is_active ? 'Aktiv' : 'Inaktiv' }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" class="h-8 w-8">
                                    <RiMoreLine class="w-4 h-4" />
                                </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem @click="openEdit(user)">Bearbeiten</DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem class="text-destructive" @click="confirmDelete(user)">Löschen</DropdownMenuItem>
                                </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>

        <Dialog v-model:open="dialogOpen">
            <DialogContent class="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>{{ editingUser ? 'Benutzer bearbeiten' : 'Benutzer hinzufügen' }}</DialogTitle>
                </DialogHeader>
                <form @submit.prevent="saveUser" class="space-y-4">
                    <div class="space-y-1">
                        <Label>Benutzername</Label>
                        <Input v-model="form.username" placeholder="max.mustermann" required />
                    </div>
                    <div class="space-y-1">
                        <Label>E-Mail</Label>
                        <Input v-model="form.email" type="email" placeholder="max@example.com" required />
                    </div>
                    <div class="space-y-1">
                        <Label>{{ editingUser ? 'Neues Passwort (leer = unverändert)' : 'Passwort' }}</Label>
                        <Input v-model="form.password" type="password" :required="!editingUser" />
                    </div>
                    <div class="space-y-1">
                        <Label>Rolle</Label>
                        <Select v-model="form.role">
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="admin">Admin</SelectItem>
                                <SelectItem value="user">User</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div class="flex items-center gap-2">
                        <Switch
                            :model-value="form.is_active"
                            @update:model-value="(val: boolean) => form.is_active = val"
                        />
                        <Label>Aktiv</Label>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" @click="dialogOpen = false">Abbrechen</Button>
                        <Button type="submit" :disabled="saving">{{ saving ? 'Speichern...' : 'Speichern' }}</Button>
                    </DialogFooter>
                </form>
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
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { RiAddLine, RiGroupLine, RiMoreLine, RiSearchLine } from '@remixicon/vue'
import { usersApi } from '@/api/users'
import type { User } from '@/types/user'
import ViewToggle from '@/components/ViewToggle.vue'
import SearchFilter from '@/components/SearchFilter.vue'

const users = ref<User[]>([])
const loading = ref(true)
const dialogOpen = ref(false)
const saving = ref(false)
const editingUser = ref<User | null>(null)
const viewMode = ref<'grid' | 'list'>('list')
const search = ref('')
const filterValues = ref<Record<string, string>>({})

const filterDefs = [
    { label: 'Rolle', value: 'role', options: [{ label: 'Admin', value: 'admin' }, { label: 'User', value: 'user' }] },
    { label: 'Status', value: 'active', options: [{ label: 'Aktiv', value: 'active' }, { label: 'Inaktiv', value: 'inactive' }] },
]

const filteredUsers = computed(() => {
    return users.value.filter(u => {
        const q = search.value.toLowerCase()
        if (q && !u.username.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
        if (filterValues.value.role && u.role !== filterValues.value.role) return false
        if (filterValues.value.active === 'active' && !u.is_active) return false
        if (filterValues.value.active === 'inactive' && u.is_active) return false
        return true
    })
})

const form = reactive({
  username: '', email: '', password: '', role: 'user' as 'admin' | 'user', is_active: true
})

const resetForm = () => {
  form.username = ''; form.email = ''; form.password = ''; form.role = 'user'; form.is_active = true
}

const openCreate = () => {
  editingUser.value = null; resetForm(); dialogOpen.value = true
}

const openEdit = (user: User) => {
  editingUser.value = user
  form.username = user.username; form.email = user.email
  form.password = ''; form.role = user.role; form.is_active = user.is_active
  dialogOpen.value = true
}
const saveUser = async () => {
    saving.value = true
    try {
        if (editingUser.value) {
            const data: any = { ...form }
            if (!data.password) delete data.password
            await usersApi.update(editingUser.value.id, data)
        } else {
            await usersApi.create(form)
        }
        await loadUsers()
        dialogOpen.value = false
    } finally {
        saving.value = false
    }
}
const confirmDelete = async (user: User) => {
    if (confirm(`Benutzer "${user.username}" wirklich löschen?`)) {
      await usersApi.delete(user.id)
      await loadUsers()
    }
}

const loadUsers = async () => {
  const { data } = await usersApi.getAll()
  users.value = data
}

onMounted(async () => {
    try { await loadUsers() } finally { loading.value = false }
})
</script>
