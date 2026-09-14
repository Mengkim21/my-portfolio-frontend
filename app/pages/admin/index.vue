<script setup>
const { login } = useAuth();
const router = useRouter();

const email = ref('');
const password = ref('');
const loading = ref(false);
const toast = useToast();

const handleLogin = async () => {
  loading.value = true;
  try {
    await login(email.value, password.value);
    toast.add({ title: 'Welcome back!', color: 'primary' });
    router.push('/admin/dashboard');
  } catch (err) {
    toast.add({ title: 'Login Failed', color: 'error' });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UContainer class="flex items-center justify-center min-h-[80vh]">
    <UCard class="w-full max-w-md">
      <template #header>
        <h1 class="text-xl font-bold text-center">Admin Login</h1>
      </template>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <UFormField label="Email" required>
          <UInput v-model="email" type="email" placeholder="example@gmail.com" icon="i-heroicons-envelope" class="w-full"/>
        </UFormField>
        
        <UFormField label="Password" required>
          <UInput v-model="password" type="password" icon="i-heroicons-lock-closed" class="w-full"/>
        </UFormField>

        <UButton type="submit" block :loading="loading" color="primary">
          Login
        </UButton>
      </form>
    </UCard>
  </UContainer>
</template>