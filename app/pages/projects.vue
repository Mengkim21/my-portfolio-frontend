<script setup>
import ProjectCard from '~/components/ProjectCard.vue';

const config = useRuntimeConfig();
const baseUrl = import.meta.server ? (config.apiBaseInternal || config.public.apiBase) : config.public.apiBase;

const { data: projects, pending, error } = await useFetch(`${baseUrl}/projects`, {
  transform: (res) => res.data,
  key: 'all-projects'
});

const { data: tags } = await useFetch(`${baseUrl}/tags`, {
  transform: (res) => res.data,
  key: 'all-tags'
});

const searchQuery = ref('');

const featuredProjects = computed(() => {
  if (!projects.value) return [];

  return projects.value.filter((project) => {

    const query = searchQuery.value.toLowerCase().trim();
    const matchesSearch = 
      !query || 
      project.title.toLowerCase().includes(query) ||
      (project.summary && project.summary.toLowerCase().includes(query));

    return matchesSearch;
  });
});

</script>

<template>
  <UContainer class="py-12 space-y-8">
    <div class="text-center space-y-3 max-w-2xl mx-auto">
      <h1 class="text-4xl font-bold tracking-tight">My Projects</h1>
      <p class="text-white/50">Browse my complete collection of works with variant of technologies and experiments</p>
    </div>

    <!-- Search & Filter Controls -->
    <div class="mx-auto mt-15">
      <!-- Search Input -->
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search projects by name or keywords..."
        size="xl"
        class="w-1/3"
      />
    </div>

    <!-- Loading State -->
    <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
      <USkeleton v-for="i in 6" :key="i" class="h-80 w-full rounded-xl" />
    </div>

    <!-- Error State -->
    <UAlert
      v-else-if="error"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Backend Connection Error"
      description="Make sure your Dockerized API is running on port 5000."
    />
    
    <div v-else-if="featuredProjects.length === 0" class="text-center text-gray-500 py-20">
      <UIcon name="i-heroicons-magnifying-class" class="w-12 h-12 mx-auto mb-2 text-gray-400"/>
      <p class="text-lg font-medium">No matching projects found</p>
      <p class="text-sm text-gray-500">Try searching for a different keyword or clearing tag filters.</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <ProjectCard 
        v-for="project in featuredProjects"
        :key="project.id"
        :project="project"
      />
    </div>
  </UContainer>
</template>