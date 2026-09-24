<script setup>
const config = useRuntimeConfig();
const baseUrl = import.meta.server ? (config.apiBaseInternal || config.public.apiBase) : config.public.apiBase;

const { data: projects, pending } = await useFetch(`${baseUrl}/projects`, {
  transform: (response) => response.data,

  key: "home-projects",

  getCachedData: (key) => {
    const data = useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
    return data
  }
});

const featuredProjects = computed(() => {
  if (!projects.value) return [];
  const featured = projects.value.filter((p) => p.is_featured);
  return featured.length > 0 ? featured : projects.value;
});
</script>

<template>
  <UContainer class="py-12">
    
    <!-- Hero Section -->
    <section class="text-center mb-16 space-y-4">
      <!-- <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl mb-4">
        Hi, I'm <span class="text-primary-500">Chhay Mengkim</span>
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        A Full-stack Developer focused on building clean, scalable, and containerized applications. 
        Take a look at my latest work below.
      </p> -->
      <h1 class="text-4xl sm:text-6xl font-extrabold tracking-tight">
        Building Scalable, <span class="text-primary-500">Containerized</span> Web Apps
      </h1>
      <p class="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        A Full-stack Developer focused on building clean, scalable, and containerized applications. 
        Take a look at my latest work below.
      </p>
      
      <div class="mt-8 flex justify-center gap-4">
        <UButton to="/projects" size="lg" color="primary" label="View All Projects"/>
        <UButton to="https://github.com/Mengkim21" target="blank" size="xl" variant="ghost" color="gray" icon="i-simple-icons-github" />
      </div>
    </section>

    <!-- Projects Section -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <div class="space-y-3">
          <h2 class="text-3xl font-bold">Featured Projects</h2>
          <p class="text-md text-gray-500">Selected work and architectures.</p>
        </div>
        <UButton variant="link" to="/projects" trailing-icon="i-heroicons-arrow-right">See all</UButton>
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

      <div v-else-if="!featuredProjects || featuredProjects.length === 0" class="text-center text-gray-500 py-16">
        <UIcon name="i-heroicons-folder-open" class="w-12 h-12 mx-auto mb-2 text-gray-400" />
        <p>No projects published yet.</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard 
          v-for="project in featuredProjects"
          :key="project.id"
          :project="project"
        />
      </div>
    </section>
  </UContainer>
</template>