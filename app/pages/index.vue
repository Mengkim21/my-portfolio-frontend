<script setup>
const config = useRuntimeConfig();

const baseUrl = import.meta.server ? config.apiBaseInternal : config.public.apiBase;

const { data: projects, pending, error } = await useFetch(`${baseUrl}/projects`, {
  transform: (response) => response.data,

  key: "home-projects"
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

      <!-- Loading State -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <USkeleton v-for="i in 3" :key="i" class="h-64 w-full" />
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

      <!-- Projects Grid -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <UCard v-for="project in projects" :key="project.id" class="flex flex-col group overflow-hidden">
          
          <!-- Image Placeholder -->
          <template #header>
            <div class="bg-gray-100 dark:bg-gray-800 h-48 -m-4 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
              <img v-if="project.image_url" :src="project.image_url" class="object-cover w-full h-full" />
              <UIcon v-else name="i-heroicons-code-bracket" class="w-12 h-12 text-gray-400" />
            </div>
          </template>

          <!-- Project Details -->
          <h3 class="text-xl font-bold mb-2">{{ project.title }}</h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm line-clamp-2 mb-4">
            {{ project.summary }}
          </p>

          <!-- Tech Tags -->
          <div class="flex flex-wrap gap-2 mb-4">
            <UBadge 
              v-for="tag in project.tags" 
              :key="tag.id"
              size="xs"
              variant="subtle"
              :style="{ color: tag.color_hex, backgroundColor: tag.color_hex + '20' }"
            >
              {{ tag.name }}
            </UBadge>
          </div>

          <!-- Actions -->
          <template #footer>
            <div class="flex justify-between items-center">
              <UButton 
                v-if="project.github_url" 
                :to="project.github_url" 
                target="_blank" 
                icon="i-simple-icons-github" 
                color="gray" 
                variant="ghost" 
              />
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
    </section>

  </UContainer>
</template>