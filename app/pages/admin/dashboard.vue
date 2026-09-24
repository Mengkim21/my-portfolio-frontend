<script setup lang="ts">
definePageMeta({
  middleware: 'auth'
})

const config = useRuntimeConfig()
const { token, logout } = useAuth();
const toast = useToast();

const baseUrl = import.meta.server ? (config.apiBaseInternal || config.public.apiBase) : config.public.apiBase

const { data: projects, refresh: refreshProjects } = await useFetch(`${baseUrl}/projects`, {
  transform: (res: any) => res.data,
  key: 'admin-projects'
});

const { data: existingTags, refresh: refreshTags } = await useFetch(`${baseUrl}/tags`, {
  transform: (res: any) => res.data,
  key: 'admin-tags'
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref<string | null>(null);
const submitting = ref(false);

const form = reactive({
  title: '',
  slug: '',
  summary: '',
  description_markdown: '',
  image_url: '',
  github_urls: [] as Array<{ label: string; url: string }>,
  live_url: '',
  is_featured: false,
  tags: [] as Array<{name: string, color_hex: string}>
});

const newTagName = ref('');
const newTagColor = ref('#3b82f6');

watch(() => form.title, (newTitle) => {
  form.slug = newTitle
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
});

const addGithubUrl = () => {
  form.github_urls.push({ label: 'Frontend', url: ''});
};

const removeGithubUrl = (index: number) => {
  form.github_urls.splice(index, 1);
}

const addCustomTag = () => {
  const name = newTagName.value.trim();
  if (!name) return;

  const alreadySelected = form.tags.some(t => t.name.toLowerCase() === name.toLowerCase());
  if (!alreadySelected) {
    form.tags.push({
      name,
      color_hex: newTagColor.value
    });
  }

  newTagName.value = '';
  newTagColor.value = '#3b82f6';
};

const addExistingTag = (tag: { name: string, color_hex: string }) => {
  const alreadySelected = form.tags.some(t => t.name.toLowerCase() === tag.name.toLowerCase());

  if (!alreadySelected) {
    form.tags.push({
      name: tag.name,
      color_hex: tag.color_hex || '#3b82f6'
    });
  }
};

const removeTag = (index: number) => {
  form.tags.splice(index, 1);
};

// --- MODAL CONTROLS ---
const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  Object.assign(form, {
    title: '',
    slug: '',
    summary: '',
    description_markdown: '',
    image_url: '',
    github_urls: [{ label: 'Repository', url: '' }],
    live_url: '',
    is_featured: false,
    tags: []
  });
  isModalOpen.value = true;
};

const openEditModal = (project: any) => {
  isEditing.value = true;
  editingId.value = project.id;
  Object.assign(form, {
    title: project.title,
    slug: project.slug,
    summary: project.summary || '',
    description_markdown: project.description_markdown || '',
    image_url: project.image_url || '',
    github_urls: Array.isArray(project.github_urls) ? JSON.parse(JSON.stringify(project.github_urls)) : [],
    live_url: project.live_url || '',
    is_featured: project.is_featured || false,
    tags: Array.isArray(project.tags) ? JSON.parse(JSON.stringify(project.tags)) : []
  });
  isModalOpen.value = true;
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const url = isEditing.value
      ? `${config.public.apiBase}/projects/${editingId.value}`
      : `${config.public.apiBase}/projects`;

    const method = isEditing.value ? 'PUT' : 'POST';

    await $fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${token.value}`
      },
      body: form
    });

    toast.add({ title: isEditing.value ? 'Project updated!' : 'Project created!', color: 'primary' });
    isModalOpen.value = false;

    // Reset Form
    // Object.assign(form, {
    //   title: '', slug: '', summary: '', description_markdown: '',
    //   image_url: '', github_url: '', live_url: '', is_featured: false, tags: []
    // });

    // INSTANT REFETCH
    await Promise.all([refreshProjects(), refreshTags()]);
  } catch (err: any) {
    toast.add({
      title: 'Action failed',
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
        <UButton icon="i-heroicons-plus" color="primary" label="New Project" @click="openCreateModal" />
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
              <UBadge 
                v-for="tag in project.tags" 
                :key="tag.id" 
                size="sm" 
                variant="outline" 
                :style="{ color: tag.color_hex, backgroundColor: tag.color_hex + '20' }"
              >
                {{ tag.name }}
              </UBadge>
            </div>
          </div>

          <!-- Action Button-->
           <div class="flex items-center gap-1">
            <UButton icon="i-heroicons-pencil-square" color="neutral" variant="ghost" @click="openEditModal(project)"/>  
            <UButton icon="i-heroicons-trash" color="error" variant="ghost" @click="handleDelete(project.id)" />
           </div>
        </div>
      </div>

      <div v-else class="text-center py-12 text-gray-400">
        No projects yet. Click "New Project" to add your first one.
      </div>
    </UCard>

    <!-- Create Project Modal -->
    <UModal v-model:open="isModalOpen" scrollable >
      <template #content>
        <UCard class="w-full sm:max-w-2xl">
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-bold">{{ isEditing ? 'Edit Project' : 'Add New Project' }}</h3>
              <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" size="sm" @click="isModalOpen = false" />
            </div>          
        </template>
  
          <!-- Input detail form -->
          <form @submit.prevent="handleSubmit" class="space-y-4 flex flex-col">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <UFormField label="Title" required>
                <UInput v-model="form.title" placeholder="My Awesome App" required  class="w-full"/>
              </UFormField>
    
              <UFormField label="Slug (Auto-generated)">
                <UInput v-model="form.slug" required  class="w-full"/>
              </UFormField>
            </div>
  
            <UFormField label="Summary">
              <UTextarea v-model="form.summary" placeholder="Short description for the project card..."  class="w-full" />
            </UFormField>
  
            <UFormField label="Live URL">
              <UInput v-model="form.live_url" placeholder="https://myproject.com"  class="w-full" />
            </UFormField>

            <UFormField label="GitHub URL" help="Add separate repos for Frontend, Backend, etc.">
              <div class="space-y-2">
                <div v-for="(repo, index) in form.github_urls" :key="index" class="flex gap-2 items-center">
                  <UInput v-model="repo.label" placeholder="e.g. Client, Server, Mobile" class="w-1/3" />
                  <UInput v-model="repo.url" placeholder="https://github.com/..." class="flex-1" icon="i-simple-icons-github" />
                  <UButton icon="i-heroicons-trash" color="error" variant="ghost" size="sm" @click="removeGithubUrl(index)" />
                </div>

                <UButton type="button" icon="i-heroicons-plus" label="Add Another Repo Link" size="xs" color="neutral" variant="soft" @click="addGithubUrl" />
              </div>
            </UFormField>
  
  
            <!-- Custom tag builder -->
            <UFormField label="Tech Stack (Tags)" help="Click an existing tag or type a new one with custom color">
              
              <!-- Selected tag previews -->
              <div class="flex flex-wrap gap-2 mb-3 min-h-[32px] p-2 border border-gray-100 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                <span v-if="form.tags.length === 0" class="text-xs text-gray-400 self-center">
                  No tags added yet.
                </span>
                <UBadge
                  v-for="(tag, idx) in form.tags"
                  :key="idx"
                  size="sm"
                  variant="solid"
                  :style="{ backgroundColor: tag.color_hex }"
                  class="flex items-center gap-2 text-gray-800"
                >
                  <span>{{ tag.name }}</span>
                  <button type="button" @click="removeTag(idx)" class="hover:opacity-75">
                    <UIcon name="i-heroicons-x-mark" class="w-3.5 h-3.5" />
                  </button>
                </UBadge>
              </div>

              <!-- Input tag name + color picker -->
              <div class="flex gap-2 items-center mb-3">
                <UInput
                  v-model="newTagName"
                  placeholder="New tag (e.g. Redis, Tailwind)"
                  class="flex-1"
                  @click="addCustomTag"
                />

                <input 
                  type="color"
                  v-model="newTagColor"
                  title="Pick Tag Color"
                  class="w-9 h-9 p-0.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent cursor-pointer"
                />

                <UButton 
                  type="button"
                  color="neutral"
                  icon="i-heroicons-plus"
                  label="Add"
                  @click="addCustomTag"
                />
              </div>

              <!-- Existing Tag Selection -->
              <div v-if="existingTags && existingTags.length > 0" class="space-y-1">
                <p class="text-xs text-gray-400">Quick add from database:</p>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    v-for="tag in existingTags"
                    :key="tag.id"
                    @click="addExistingTag(tag)"
                    class="text-xs px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 transition-colors"
                    :style="{ color: tag.color_hex }"
                  >
                   {{ tag.name }}
                  </button>
                </div>
              </div>
            </UFormField>
  
            <UCheckbox v-model="form.is_featured" label="Feature this on the home page" />
  
            <div class="flex justify-end gap-2 pt-4">
              <UButton color="neutral" variant="ghost" label="Cancel" @click="isModalOpen = false" />
              <UButton type="submit" color="primary" :label="isEditing ? 'Update Project' : 'Create Project'" :loading="submitting" />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </UContainer>
</template>