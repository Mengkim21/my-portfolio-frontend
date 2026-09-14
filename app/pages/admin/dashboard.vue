<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const { token, logout } = useAuth();
const toast = useToast();

const baseUrl = import.meta.server ? config.apiBaseInternal : config.public.apiBase

const { data: projects, refresh: refreshProjects } = await useFetch(`${config.public.apiBase}/projects`, {
  transform: (res: any) => res.data,
  key: 'admin-projects'
});

const { data: tags } = await useFetch(`${config.public.apiBase}/tags`, {
  transform: (res: any) => res.data,
  key: 'admin-tags'
});

const isModalOpen = ref(false);
const isCheck = ref(false);
const submitting = ref(false);

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  description_markdown: '',
  image_url: '',
  github_url: '',
  live_url: '',
  is_featured: false,
  tags: [] as number[]
});

watch(() => form.title, (newTitle) => {
  form.slug = newTitle
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
});

const handleCreateProject = async () => {
  submitting.value = true;
  try {
    await $fetch(`${config.public.apiBase}/projects`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: form
    });

    toast.add({ title: 'Project created successfully!', color: 'primary' });
    isModalOpen.value = false;

    // Reset Form
    Object.assign(form, {
      title: '', slug: '', summary: '', description_markdown: '',
      image_url: '', github_url: '', live_url: '', is_featured: false, tags: []
    });

    // INSTANT REFETCH
    await refreshProjects();
  } catch (err: any) {
    toast.add({
      title: 'Failed to create project',
      description: err.data?.error || err.message,
      color: 'error'
    });
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this project?')) return;

  try {
    await $fetch(`${config.public.apiBase}/projects/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token.value}`
      }
    });

    toast.add({ title: 'Project deleted', color: 'primary' });
    // INSTANT REFETCH
    await refreshProjects();
  } catch (err: any) {
    toast.add({ title: 'Delete failed', description: err.data?.error, color: 'error' });
  }
};


</script>

<template>
  <UContainer class="py-10">
    <div class="flex justify-between items-center mb-10">
      <div>
        <h1 class="text-3xl font-bold text-primary-500">Admin Dashboard</h1>
        <p class="text-gray-500">Create, edit, and organize your showcase items.</p>
      </div>
      <div class="flex gap-3">
        <UButton icon="i-heroicons-plus" color="primary" label="New Project" @click="isModalOpen = true" />
        <UButton icon="i-heroicons-arrow-right-on-rectangle" label="Logout" color="neutral" @click="logout" />
      </div>
    </div>

    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Manage Projects</h1>
    </div>

    <!-- Projects List -->
    <UCard>
      <div v-if="projects && projects.length > 0" class="divide-y divide-gray-100 dark:divide-gray-800">
        <div v-for="project in projects" :key="project.id" class="py-4 flex items-center justify-between">
          <div class="space-y-1">
            <div class="flex items-center gap-2">
              <h3 class="font-bold text-lg">{{ project.title }}</h3>
              <UBadge v-if="project.is_featured" color="warning" variant="subtle" size="xs">Featured</UBadge>
            </div>
            <p class="text-md text-gray-500">{{ project.summary || 'No summary provided' }}</p>
            <div class="flex gap-1">
              <UBadge v-for="tag in project.tags" :key="tag.id" size="sm" variant="outline" :style="{ color: tag.color_hex, backgroundColor: tag.color_hex + '20' }">
                {{ tag.name }}
              </UBadge>
            </div>
          </div>

          <UButton icon="i-heroicons-trash" color="error" variant="ghost" @click="handleDelete(project.id)" />
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-400">
        No projects yet. Click "New Project" to add your first one.
      </div>
    </UCard>

    <!-- Create Project Modal -->
    <UModal v-model:open="isModalOpen">
      <template #content>
        <UCard class="w-full max-w-lg">
          <template #header>
            <h3 class="text-lg font-bold">Add New Project</h3>
          </template>
  
          <form @submit.prevent="handleCreateProject" class="space-y-4 flex flex-col">
            <UFormGroup label="Title" required>
              <UInput v-model="form.title" placeholder="My Awesome App" required  class="w-full"/>
            </UFormGroup>
  
            <UFormGroup label="Slug (Auto-generated)">
              <UInput v-model="form.slug" required  class="w-full"/>
            </UFormGroup>
  
            <UFormGroup label="Summary">
              <UTextarea v-model="form.summary" placeholder="Short description for the project card..."  class="w-full"/>
            </UFormGroup>
  
            <UFormGroup label="GitHub URL">
              <UInput v-model="form.github_url" placeholder="https://github.com/..."  class="w-full"/>
            </UFormGroup>
  
            <UFormGroup label="Live URL">
              <UInput v-model="form.live_url" placeholder="https://myproject.com"  class="w-full"/>
            </UFormGroup>
  
            <UFormGroup label="Tech Stack (Tags)">
              <div class="flex flex-wrap gap-2">
                <UCheckboxGroup
                  v-model="form.tags"
                  :items="tags ?? []"
                  value-key="id" 
                  label-key="name" 
                  orientation="horizontal"
                />
              </div>
            </UFormGroup>
  
            <UCheckbox v-model="form.is_featured" label="Feature this on the home page" />
  
            <div class="flex justify-end gap-2 pt-4">
              <UButton color="neutral" variant="ghost" label="Cancel" @click="isModalOpen = false" />
              <UButton type="submit" color="primary" label="Save Project" :loading="submitting" />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </UContainer>
</template>