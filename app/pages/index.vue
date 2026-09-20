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
    <section class="text-center mb-16">
      <h1 class="text-5xl font-extrabold tracking-tight sm:text-6xl mb-4">
        Hi, I'm <span class="text-primary-500">Chhay Mengkim</span>
      </h1>
      <p class="text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
        A Full-stack Developer focused on building clean, scalable, and containerized applications. 
        Take a look at my latest work below.
      </p>
      
      <div class="mt-8 flex justify-center gap-4">
        <UButton to="/projects" size="lg" color="primary">View All Work</UButton>
        <UButton to="#contact" size="lg" variant="ghost" color="gray">Get In Touch</UButton>
      </div>
    </section>

    <!-- Projects Section -->
    <section>
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold">Featured Projects</h2>
        <UButton variant="link" to="/projects" trailing-icon="i-heroicons-arrow-right">See all</UButton>
      </div>

      <!-- Projects Grid -->
      <div v-if="projects && projects.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UCard v-for="project in featuredProjects" :key="project.id" class="flex flex-col group overflow-hidden">
          
          <!-- Image Placeholder -->
          <template #header>
            <div class="bg-gray-100 dark:bg-gray-800 h-48 -m-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img v-if="project.image_url" :src="project.image_url" class="object-cover w-full h-full" />
              <UIcon v-else name="i-heroicons-code-bracket" class="w-12 h-12 text-gray-400" />
            </div>
          </template>

          <!-- Project Details -->
          <div class="flex-1 space-y-2">
            <div class="flex items-center justify-between">
              <h3 class="text-xl font-bold line-clamp-1">{{ project.title }}</h3>
              <UBadge v-if="project.is_featured" color="warning" variant="subtle" size="xs">Featured</UBadge>
            </div>
            
            <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ project.summary || 'No summary provided.' }}
            </p>

            <!-- Tags -->
            <div class="flex flex-wrap gap-1.5 pt-2">
              <UBadge 
                v-for="tag in project.tags" 
                :key="tag.id" 
                size="sm" 
                variant="outline"
                :style="{ color: tag.color_hex, backgroundColor: tag.color_hex + '15' }"
              >
                {{ tag.name }}
              </UBadge>
            </div>
          </div>

          <!-- Actions -->
          <template #footer>
            <div class="flex justify-between items-center gap-2">
              <!-- Repositories-->
              <div class="flex flex-wrap gap-1">
                <template v-if="project.github_urls && project.github_urls.length > 0">
                  <UButton 
                    v-for="(repo, rIdx) in project.github_urls"
                    :key="rIdx"
                    :to="repo.url" 
                    target="_blank" 
                    icon="i-simple-icons-github" 
                    color="gray" 
                    variant="ghost" 
                    :label="project.github_urls.length > 1 ? repo.label : undefined"
                  />
                </template>
              </div>

              <!-- Live Demo -->
              <UButton 
                v-if="project.live_url" 
                :to="project.live_url" 
                target="_blank" 
                variant="solid" 
                color="primary"
                label="View Live"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Empty State -->
      <div v-else-if="!pending" class="text-center py-20 text-gray-500">
        No projects found in the database.
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
    </section>
  </UContainer>
</template>