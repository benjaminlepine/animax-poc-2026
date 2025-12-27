<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const route = useRoute()
const animaxNumber = ref(null)
const error = ref(null)

function extractAnimaxNumber(value) {
  const path = typeof value === 'string' ? value : value?.path
  if (!path) return null
  return path.split('/').filter(Boolean).pop() ?? null
}

onMounted(async () => {
  try {
    const tokenId = String(route.params.tokenId || '')
    const snap = await getDoc(doc(db, 'tokens', tokenId))
    if (!snap.exists()) {
      error.value = 'Token not found'
      return
    }
    const data = snap.data()
    animaxNumber.value = extractAnimaxNumber(
        data.animax ?? data.animaxRef ?? data.animal ?? data.animalRef
    )
    if (!animaxNumber.value) error.value = 'Animax ref missing'
  } catch (e) {
    console.error(e)
    error.value = 'Firestore error'
  }
})
</script>

<template>
  <div style="font-size:48px; font-weight:700; padding:24px;">
    <div v-if="animaxNumber">{{ animaxNumber }}</div>
    <div v-else-if="error" style="font-size:18px;">{{ error }}</div>
    <div v-else style="font-size:18px;">Loading…</div>
  </div>
</template>
