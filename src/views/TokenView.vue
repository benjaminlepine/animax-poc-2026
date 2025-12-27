<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import { getStorage, ref as storageRef, getDownloadURL } from 'firebase/storage'

let didFetch = false
const route = useRoute()
const imageUrl = ref(null)

const animal = ref(null)
const error = ref(null)

function extractAnimalId(value) {
  const path = typeof value === 'string' ? value : value?.path
  if (!path) return null
  return path.split('/').filter(Boolean).pop()
}

onMounted(async () => {

  console.count('TokenView mounted')

  if (didFetch) return
  didFetch = true

  console.count('Firestore token getDoc')


  try {
    const tokenId = route.params.tokenId
    const tokenSnap = await getDoc(doc(db, 'tokens', tokenId))

    if (!tokenSnap.exists()) {
      error.value = 'Token not found'
      return
    }

    const tokenData = tokenSnap.data()
    const animalId = extractAnimalId(tokenData.animax)
    try {
      const storage = getStorage()
      const path = `Animax/${animalId}/main.webp`

      console.count('getDownloadURL')
      imageUrl.value = await getDownloadURL(storageRef(storage, path))
    } catch (e) {
      // pas bloquant : si pas d'image ou règles storage => on continue sans image
      console.warn('Image not available for this animal', e)
      imageUrl.value = null
    }


    if (!animalId) {
      error.value = 'Animal ref missing in token'
      return
    }
    console.count('Firestore animal getDoc')
    const animalSnap = await getDoc(doc(db, 'animals', animalId))

    if (!animalSnap.exists()) {
      error.value = 'Animal not found'
      return
    }

    animal.value = animalSnap.data()
  } catch (e) {
    console.error(e)
    error.value = 'Firestore error'
  }
})
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

    <p><strong>Environments:</strong> {{ animal.environments?.join(', ') }}</p>

    <p class="about">{{ animal.about }}</p>
  </div>

  <div v-else-if="error">
    {{ error }}
  </div>

  <div v-else>
    Loading…
  </div>
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

</style>

