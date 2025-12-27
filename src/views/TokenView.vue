<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Animal } from '@/domain/animal'
import { fetchAnimalForToken, fetchAnimalImageUrl } from '@/services/animalService'

const props = defineProps<{ tokenId: string }>()

const loading = ref(true)
const imageUrl = ref<string | null>(null)
const animal = ref<Animal | null>(null)
const error = ref<string | null>(null)

async function load() {
  loading.value = true
  error.value = null
  animal.value = null
  imageUrl.value = null

  try {
    const tokenId = decodeURIComponent(String(props.tokenId || ''))
    const res = await fetchAnimalForToken(tokenId)

    if (!res) {
      error.value = 'Animal not found'
      return
    }

    animal.value = res.animal
    imageUrl.value = await fetchAnimalImageUrl(res.animalKey)
  } catch (e) {
    console.error(e)
    error.value = 'Unexpected error'
  } finally {
    loading.value = false
  }
}

onMounted(load)
</script>


<template>
  <div v-if="animal" class="animal">
    <img
        v-if="imageUrl"
        :src="imageUrl"
        :alt="animal.name"
        class="animal-img"
    />

    <h1>{{ animal.name }}</h1>
    <h2><em>{{ animal.scientificName }}</em></h2>

    <p><strong>Category:</strong> {{ animal.category }}</p>
    <p><strong>Class:</strong> {{ animal.class }}</p>
    <p><strong>Rareness:</strong> {{ animal.rareness }}</p>

    <p><strong>Height:</strong> {{ animal.height }}</p>
    <p><strong>Weight:</strong> {{ animal.weight }}</p>
    <p><strong>Longevity:</strong> {{ animal.longevity }}</p>

    <p><strong>Environments:</strong> {{ animal.environments.join(', ') }}</p>

    <p class="about">{{ animal.about }}</p>
  </div>

  <div v-else-if="error" class="state">{{ error }}</div>
  <div v-else-if="loading" class="state">Loading…</div>
  <div v-else class="state">Empty</div>
</template>

<style scoped>
.animal {
  max-width: 640px;
  margin: 40px auto;
  font-family: system-ui, sans-serif;
}
.about {
  margin-top: 24px;
  line-height: 1.6;
}
.animal-img {
  width: 100%;
  max-width: 420px;
  display: block;
  margin: 0 0 20px 0;
  border-radius: 12px;
}
.state {
  max-width: 640px;
  margin: 40px auto;
  font-family: system-ui, sans-serif;
}
</style>
