<template>
    <div class="bg-muted flex min-h-svh flex-col items-center justify-center gap-6 p-6 md:p-10">
        <div class="flex w-full max-w-sm flex-col gap-6">
            <div class="flex items-center gap-2 self-center font-medium">
                <div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                    <RiStackLine class="size-4" />
                </div>
                OpenPFM
            </div>

            <Card>
                <CardHeader class="text-center">
                    <CardTitle class="text-xl">Ersteinrichtung</CardTitle>
                    <CardDescription>Lege deinen Admin-Account an</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleSetup" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <Label for="username">Benutzername</Label>
                            <Input id="username" v-model="form.username" placeholder="admin" required autocomplete="username" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label for="email">E-Mail</Label>
                            <Input id="email" v-model="form.email" type="email" placeholder="admin@example.com" required autocomplete="email" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label for="password">Passwort</Label>
                            <Input id="password" v-model="form.password" type="password" required autocomplete="new-password" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label for="confirm">Passwort bestätigen</Label>
                            <Input id="confirm" v-model="confirm" type="password" required autocomplete="new-password" />
                        </div>
                        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
                        <Button type="submit" :disabled="loading" class="w-full">
                            {{ loading ? 'Einrichten...' : 'Admin-Account erstellen' }}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { RiStackLine } from '@remixicon/vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/stores/auth'
import { resetSetupCheck } from '@/router'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ username: '', email: '', password: '' })
const confirm = ref('')
const error = ref('')
const loading = ref(false)

async function handleSetup() {
    error.value = ''
    if (form.password !== confirm.value) {
        error.value = 'Passwörter stimmen nicht überein'
        return
    }
    loading.value = true
    try {
        await authApi.setup(form)
        resetSetupCheck()
        await auth.login(form.email, form.password)
        router.push('/')
    } catch (e: any) {
        error.value = e?.response?.data?.detail || 'Einrichtung fehlgeschlagen'
    } finally {
        loading.value = false
    }
}
</script>