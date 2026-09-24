<script setup lang="ts">
interface Tag {
  id: number;
  name: string;
  color_hex: string;
}

interface GithubRepo {
  label: string;
  url: string;
}

interface Project {
  id: string;
  title: string;
  slug: string;
  summary?: string;
  image_url?: string;
  github_urls?: GithubRepo[];
  live_url?: string;
  is_featured?: boolean;
  tags?: Tag[];
}

defineProps<{
  project: Project;
}>();
</script>

<template>
  <UCard class="flex flex-col h-full hover:scale-102 border border-gray-600 hover:border-primary transition-all duration-300 group">
    <!-- Image Placeholder -->
    <div class="dark:bg-gray-800 h-52 mb-8 rounded-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
      <img 
        v-if="project.image_url" 
        :src="project.image_url" 
        :alt="project.title"
        class="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300" 
      />
      <UIcon v-else name="i-heroicons-code-bracket" class="w-12 h-12 text-gray-400" />
    </div>

    <!-- Content -->
    <div class="flex-1 space-y-2 mb-4">
      <div class="flex items-start justify-between">
        <h3 class="text-xl font-bold">{{ project.title }}</h3>
        <UBadge v-if="project.is_featured" color="warning" variant="subtle" size="sm" class="rounded-xl">Featured</UBadge>
      </div>
      
      <p class="text-sm text-gray-400 mb-12">
        {{ project.summary || 'No summary provided.' }}
      </p>

      <!-- Tags -->
      <div v-if="project.tags && project.tags.length > 0" class="flex flex-wrap gap-1.5 pt-2">
        <UBadge 
          v-for="tag in project.tags"
          :key="tag.id"
          size="md"
          variant="outline"
          :style="{ color: tag.color_hex, backgroundColor: tag.color_hex + '15' }"
        >
          {{ tag.name }}
        </UBadge>
      </div>
    </div>

    <!-- Repositories -->
    <div class="flex flex-col gap-3">
      <div class="flex justify-wrap gap-2">
        <template v-if="project.github_urls && project.github_urls.length > 0">
          <UButton
            v-for="(repo, rIdx) in project.github_urls"
            :key="rIdx"
            :to="repo.url"
            target="blank"
            icon="i-simple-icons-github"
            color="neutral"
            variant="ghost"
            class="border hover:border-primary transition-all duration-300"
            :label="project.github_urls.length > 1 ? repo.label : undefined"
          />
        </template>
      </div>
  
      <!-- Live Demo -->
      <div class="flex justify-center">
        <UButton 
          v-if="project.live_url"
          :to="project.live_url"
          target="blank"
          trailing-icon="i-heroicons-arrow-top-right-on-square"
          color="primary"
          class="w-full flex justify-center items-center"
          label="View Live"
        />
      </div>
    </div>
  </UCard>
</template>