<script setup lang="ts">
import { ref } from 'vue';
import type { NavigationMenuItem } from '@nuxt/ui';

const colorMode = useColorMode()

// Function to toggle between light and dark mode
const isDark = computed({
  get () {
    return colorMode.value === 'dark'
  },
  set () {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  }
})

const items = ref<NavigationMenuItem[]>([
  {
    label: 'Home',
    icon: 'i-heroicons-home',
    to: '/'
  }, 
  {
    label: 'Projects',
    icon: 'i-heroicons-code-bracket',
    to: '/projects'
  },
  {
    label: 'Admin',
    icon: 'i-heroicons-lock-closed',
    to: '/admin'
  }
])
</script>

<template>
  <div class="border-b border-gray-200 dark:border-gray-800">
    <UContainer class="flex items-center justify-between py-2">
      <!-- Logo / Name -->
      <NuxtLink to="/" class="text-xl font-bold text-primary-500">
        Portfolio.zip
      </NuxtLink>

      <!-- Navigation Links -->
      <UNavigationMenu :items="items" class="hidden md:flex border-none" />

      <!-- Action Buttons -->
      <div class="flex items-center gap-2">
        <ClientOnly>
          <UButton
            :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'"
            color="neutral"
            variant="ghost"
            aria-label="Theme"
            @click="isDark = !isDark"
          />
        </ClientOnly>
        
        <UButton color="primary" variant="soft" label="Hire Me" class="hidden sm:flex" />
      </div>
    </UContainer>
  </div>
</template>