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
                    <CardTitle class="text-xl">Willkommen</CardTitle>
                    <CardDescription>Melde dich mit deiner E-Mail an</CardDescription>
                </CardHeader>
                <CardContent>
                    <form @submit.prevent="handleLogin" class="flex flex-col gap-4">
                        <div class="flex flex-col gap-2">
                            <Label for="email">E-Mail</Label>
                            <Input id="email" v-model="email" type="email" placeholder="admin@example.com" required autocomplete="email" />
                        </div>
                        <div class="flex flex-col gap-2">
                            <Label for="password">Passwort</Label>
                            <Input id="password" v-model="password" type="password" required autocomplete="current-password" />
                        </div>
                        <p v-if="error" class="text-sm text-destructive">{{ error }}</p>
                        <Button type="submit" :disabled="loading" class="w-full">
                            {{ loading ? 'Anmelden...' : 'Anmelden' }}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { RiStackLine } from '@remixicon/vue'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleLogin() {
    error.value = ''
    loading.value = true
    try {
        await auth.login(email.value, password.value)
        router.push('/')
    } catch (e: any) {
        error.value = e?.response?.data?.detail || 'Anmeldung fehlgeschlagen'
    } finally {
        loading.value = false
    }
}
</script>