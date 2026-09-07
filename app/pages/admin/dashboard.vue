<script setup>
definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const user = useSupabaseUser()
const supabase = useSupabaseClient()
const router = useRouter()

const session = useSupabaseSession();
const token = session.value?.access_token;

const { data: projects, refresh } = await useFetch(`${config.public.apiBase}/projects`, {
  transform: (res) => res.data
});

const handleLogout = async () => {
  await supabase.auth.signOut()
  router.push('/')
}
</script>

<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold text-primary-500">Admin Dashboard</h1>
        <p class="text-gray-500">Welcome, {{ user?.email }}</p>
      </div>
      <UButton color="error" variant="soft" icon="i-heroicons-arrow-left-on-rectangle" @click="handleLogout">
        Logout
      </UButton>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Projects</h1>
      <UButton label="New Project" icon="i-heroicons-plus" color="primary"/>
    </div>

    <UCard>
      <div v-for="project in projects" :key="project.id" 
           class="flex items-center justify-between p-4 border-b last:border-0">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-gray-100 rounded overflow-hidden">
            <img v-if="project.image_url" :src="project.image_url" class="object-cover w-full h-full" />
          </div>
          <div>
            <p class="font-bold">{{ project.title }}</p>
            <p class="text-xs text-gray-500">{{ project.slug }}</p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <UButton icon="i-heroicons-pencil-square" variant="ghost" color="gray" />
          <UButton icon="i-heroicons-trash" variant="ghost" color="red" @click="deleteProject(project.id)" />
        </div>
      </div>
    </UCard>
  </UContainer>
</template>